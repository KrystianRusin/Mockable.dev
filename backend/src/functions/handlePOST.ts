import Endpoint, { IEndpoint } from "../models/Endpoint";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const generatePOSTData = async (
    endpoint: IEndpoint,
    requestBody: Record<string, any>
  ): Promise<any> => {
    const requestSchema = parseSchema(endpoint.requestSchema);
    validateData(requestBody, requestSchema, 'Request body does not match request schema');
  
    const createdResource = {
      id: generateUniqueId(),
      ...requestBody,
    };
  
    const responseSchema = parseSchema(endpoint.responseSchema);
    validateData(createdResource, responseSchema, 'Response data does not match response schema');
  
    return createdResource;
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
  
const generateUniqueId = () => {
    return Math.floor(Math.random() * 1000000).toString();
};

export default generatePOSTData;