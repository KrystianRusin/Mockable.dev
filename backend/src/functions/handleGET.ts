import Endpoint, { IEndpoint } from "../models/Endpoint";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import jsf from "json-schema-faker";
import OpenAI from "openai";
import redisClient from "../redisClient";
import crypto from "crypto";

const generateGETData = async (endpoint: IEndpoint, forceRefresh = false) => {
    let JSONSchema = endpoint.JSONSchema;
    const description = endpoint.description;

    // Ensure JSONSchema is an object
    if (typeof JSONSchema === 'string') {
        try {
            JSONSchema = JSON.parse(JSONSchema);
        } catch (err) {
            console.error('Failed to parse JSONSchema:', err);
            throw new Error('JSONSchema is not valid JSON');
        }
    }

    const schemaHash = crypto.createHash('sha256').update(JSON.stringify(JSONSchema)).digest('hex');
    const cacheKey = `endpoint:${endpoint._id}:schema:${schemaHash}`;
    if (!forceRefresh) {
        try {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                console.log('returning cached data');
                return JSON.parse(cachedData);
            }
        } catch (err) {
            console.error('Redis GET error: ', err);
        }
    }

    const ajv = new Ajv();
    addFormats(ajv); 

    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `
                            You are a data generator that strictly adheres to the provided JSON schema. When generating data:

                            - Ensure all properties meet the required types and constraints.
                            - Pay special attention to 'oneOf', 'anyOf', and 'allOf' conditions.
                            - Do not include additional properties not defined in the schema.
                            - Output only the JSON data without any explanations or extra text.
                            `
                },
                {
                    role: "user",
                    content: `JSON Schema: ${JSON.stringify(JSONSchema)}\nDescription: ${description}`
                }
            ]
        });

        const generatedContent = response.choices[0]?.message?.content;

        if (!generatedContent) {
            console.error(`Attempt ${attempt}: Failed to generate data.`);
            if (attempt === maxRetries) {
                throw new Error('Failed to generate data after multiple attempts.');
            }
            continue;
        }

        let data;
        try {
            const codeBlockMatch = generatedContent.match(/```json([\s\S]*?)```/);
            const jsonString = codeBlockMatch ? codeBlockMatch[1].trim() : generatedContent.trim();

            data = JSON.parse(jsonString);
        } catch (err) {
            console.error(`Attempt ${attempt}: Failed to parse generated data`, err);
            if (attempt === maxRetries) {
                throw new Error('Generated data is not valid JSON.');
            }
            continue; 
        }

        const validate = ajv.compile(JSONSchema);
        const valid = validate(data);

        if (valid) {
            await redisClient.set(cacheKey, JSON.stringify(data), 'EX', 3600);
            return data; 
        } else {
            console.error(`Attempt ${attempt}: Generated data does not match JSON schema:`, validate.errors);
            if (attempt === maxRetries) {
                try {
                    console.warn("Using JSF as fallback to generate data that matches the schema.");
                    const data = jsf.generate(JSONSchema);
                    await redisClient.set(cacheKey, JSON.stringify(data), 'EX', 3600);
                    console.log("Generated data using JSF:", data);
                    return data;
                } catch (err) {
                    console.error("Failed to generate data using JSF:", err);
                    throw new Error('Failed to generate data that matches the schema.');
            }
        }
    }
    }
};

export default generateGETData;
