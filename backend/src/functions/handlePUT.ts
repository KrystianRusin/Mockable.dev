import Endpoint, { IEndpoint } from "../models/Endpoint";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import OpenAI from "openai";
import redisClient from "../redisClient";
import crypto from "crypto";

const generatePUTData = async (
  endpoint: IEndpoint,
  requestBody: Record<string, any>,
  forceRefresh = false
): Promise<any> => {
  // Parse and validate request schema
  const requestSchema = parseSchema(endpoint.requestSchema);
  validateData(requestBody, requestSchema, 'Request body does not match request schema');

  // Parse response schema
  const responseSchema = parseSchema(endpoint.responseSchema);

  // Create a cache key based on endpoint ID, request body, and schemas
  const hashInput = JSON.stringify({
    endpointId: endpoint._id,
    requestBody,
    requestSchema,
    responseSchema,
  });
  const cacheHash = crypto.createHash('sha256').update(hashInput).digest('hex');
  const cacheKey = `put:${cacheHash}`;

  if (!forceRefresh) {
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log('Returning cached PUT response data');
        return JSON.parse(cachedData);
      }
    } catch (err) {
      console.error('Redis GET error:', err);
    }
  }

  const ajv = new Ajv();
  addFormats(ajv);

  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Adjusted system prompt to reflect that this is a PUT (update) request scenario
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
              You are a data generator that strictly adheres to the provided JSON schemas. When generating response data for a PUT request:
              
              - Use the provided request body and request schema as context.
              - Assume this represents a full resource update.
              - Ensure all properties in the response match the response schema.
              - Do not include additional properties not defined in the response schema.
              - Output only the JSON data without any explanations or extra text.
            `
          },
          {
            role: "user",
            content: `
              Request Body: ${JSON.stringify(requestBody)}
              Request Schema: ${JSON.stringify(requestSchema)}
              Response Schema: ${JSON.stringify(responseSchema)}
            `
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

      let responseData;
      try {
        const codeBlockMatch = generatedContent.match(/```json([\s\S]*?)```/);
        const jsonString = codeBlockMatch ? codeBlockMatch[1].trim() : generatedContent.trim();
        responseData = JSON.parse(jsonString);
      } catch (err) {
        console.error(`Attempt ${attempt}: Failed to parse generated data`, err);
        if (attempt === maxRetries) {
          throw new Error('Generated data is not valid JSON.');
        }
        continue;
      }

      const validate = ajv.compile(responseSchema);
      const valid = validate(responseData);

      if (valid) {
        await redisClient.set(cacheKey, JSON.stringify(responseData), 'EX', 3600);
        return responseData;
      } else {
        console.error(`Attempt ${attempt}: Generated data does not match response schema:`, validate.errors);
        if (attempt === maxRetries) {
          throw new Error('Failed to generate data that matches the response schema.');
        }
        continue;
      }
    } catch (err) {
      console.error(`Attempt ${attempt}: Error during data generation`, err);
      if (attempt === maxRetries) {
        throw new Error('Failed to generate data after multiple attempts.');
      }
      continue;
    }
  }
};

// Helper functions
const parseSchema = (schemaString: string): object => {
  try {
    return JSON.parse(schemaString);
  } catch (err) {
    throw new Error('Invalid JSON schema');
  }
};

const validateData = (data: any, schema: object, errorMessage: string) => {
  const ajv = new Ajv();
  addFormats(ajv);
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    console.error(errorMessage, validate.errors);
    throw new Error(errorMessage);
  }
};

export default generatePUTData;
