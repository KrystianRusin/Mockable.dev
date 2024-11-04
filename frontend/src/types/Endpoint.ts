// frontend/src/types/Endpoint.ts
export interface Endpoint {
  id: string;
  name: string;
  method: string;
  url: string;
  description?: string;
  jsonSchema: string;
}

