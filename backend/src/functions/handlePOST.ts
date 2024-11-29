import Endpoint, { IEndpoint } from "../models/Endpoint";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const generatePOSTData = async (endpoint: IEndpoint, requestBody: Record<string, any>) => {
    let JSONSchema = endpoint.JSONSchema;

    if (typeof JSONSchema === 'string') {
        try {
            JSONSchema = JSON.parse(JSONSchema);
        } catch (err) {
            console.error('Failed to parse JSONSchema:', err);
            throw new Error('JSONSchema is not valid JSON');
        }
    }

    const ajv = new Ajv();
    addFormats(ajv); 

    const validate = ajv.compile(JSONSchema);
    const valid = validate(requestBody);

    if (!valid) {
        console.error('Request body is not valid:', validate.errors);
        throw new Error('Request body is not valid');
    }

    const createdResource = {
        id: generateUniqueId(),
        ...requestBody
    };

    return createdResource
};

const generateUniqueId = () => {
    return Math.floor(Math.random() * 1000000).toString();
};

export default generatePOSTData;