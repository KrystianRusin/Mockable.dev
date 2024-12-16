import Endpoint, { IEndpoint } from "../models/Endpoint";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import jsf from "json-schema-faker";
import OpenAI from "openai";
import redisClient from "../redisClient";
import crypto from "crypto";

const generateDELETEData = async (endpoint: IEndpoint, forceRefresh = false): Promise<any> => {
  console.log('Generating DELETE data for endpoint:', endpoint);

  let JSONSchema = endpoint.responseSchema;

  // Ensure JSONSchema is an object
  if (typeof JSONSchema === 'string') {
    try {
      JSONSchema = JSON.parse(JSONSchema);
    } catch (err) {
      console.error('Failed to parse JSONSchema:', err);
      throw new Error('Response schema is not valid JSON.');
    }
  }

  const schemaHash = crypto.createHash('sha256').update(JSON.stringify(JSONSchema)).digest('hex');
  const cacheKey = `delete:${endpoint._id}:schema:${schemaHash}`;

  if (!forceRefresh) {
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log('Returning cached DELETE response data');
        return JSON.parse(cachedData);
      }
    } catch (err) {
      console.error('Redis GET error:', err);
    }
  }

  const ajv = new Ajv({ strict: false });
  addFormats(ajv);

  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Generating data for DELETE operation using GPT.`);

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
            content: `JSON Schema: ${JSON.stringify(JSONSchema)}`
          }
        ]
      });

      const generatedContent = response.choices[0]?.message?.content;

      if (!generatedContent) {
        console.error(`Attempt ${attempt}: GPT did not generate valid data.`);
        if (attempt === maxRetries) {
          throw new Error('Failed to generate data using GPT after multiple attempts.');
        }
        continue;
      }

      let data;
      try {
        const codeBlockMatch = generatedContent.match(/```json([\s\S]*?)```/);
        const jsonString = codeBlockMatch ? codeBlockMatch[1].trim() : generatedContent.trim();

        data = JSON.parse(jsonString);
      } catch (err) {
        console.error(`Attempt ${attempt}: Failed to parse GPT-generated data`, err);
        if (attempt === maxRetries) {
          throw new Error('GPT-generated data is not valid JSON.');
        }
        continue;
      }

      const validate = ajv.compile(JSONSchema);
      const valid = validate(data);

      if (valid) {
        console.log('GPT-generated data matches schema. Caching and returning response.');
        await redisClient.set(cacheKey, JSON.stringify(data), 'EX', 3600);
        return data;
      } else {
        console.error(`Attempt ${attempt}: GPT-generated data does not match JSON schema:`, validate.errors);
        if (attempt === maxRetries) {
          console.warn("Falling back to JSF to generate valid data.");
        }
      }
    } catch (err) {
      console.error(`Attempt ${attempt}: Error generating data using GPT`, err);
      if (attempt === maxRetries) {
        console.warn("Falling back to JSF to generate valid data.");
      }
    }
  }

  // Fallback to JSF
  try {
    console.log('Using JSF to generate DELETE response data as fallback.');
    const data = jsf.generate(JSONSchema);

    const validate = ajv.compile(JSONSchema);
    const valid = validate(data);

    if (valid) {
      console.log('JSF-generated data matches schema. Caching and returning response.');
      await redisClient.set(cacheKey, JSON.stringify(data), 'EX', 3600);
      return data;
    } else {
      console.error('JSF-generated data does not match JSON schema:', validate.errors);
      throw new Error('JSF-generated data does not match JSON schema.');
    }
  } catch (err) {
    console.error('Failed to generate data using JSF as fallback:', err);
    throw new Error('Failed to generate DELETE response data.');
  }
};

export default generateDELETEData;
