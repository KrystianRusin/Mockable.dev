import Endpoint, { IEndpoint } from "../models/Endpoint";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import OpenAI from "openai";

const generateData = async (endpoint: IEndpoint) => {
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

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant that generates data based on JSON schemas. Use any provided description for additional context if the description is not useful, then make your own assumptions based on the input schema and avoid using generic data, make the data realistic. Output only the JSON data without any additional text."
            },
            {
                role: "user",
                content: `JSON Schema: ${JSON.stringify(JSONSchema)}\nDescription: ${description}`
            }
        ]
    });

    const generatedContent = response.choices[0]?.message?.content;

    if (!generatedContent) {
        throw new Error('Failed to generate data');
    }

    let data;
    try {
        // If the response includes code blocks, extract the JSON
        const codeBlockMatch = generatedContent.match(/```json([\s\S]*?)```/);
        const jsonString = codeBlockMatch ? codeBlockMatch[1].trim() : generatedContent.trim();

        data = JSON.parse(jsonString);
    } catch (err) {
        console.error('Failed to parse generated data:', err);
        throw new Error('Generated data is not valid JSON');
    }

    const ajv = new Ajv();
    addFormats(ajv); // Add this line to include format support

    const validate = ajv.compile(JSONSchema);
    const valid = validate(data);

    if (!valid) {
        console.error('Generated data does not match JSON schema:', validate.errors);
        throw new Error('Generated data does not match JSON schema');
    }

    return data;
}

export default generateData;
