// frontend/src/types/Endpoint.ts
export interface Endpoint {
  _id: string; 
  name: string;
  description?: string;
  method: string;
  url: string;
  JSONSchema?: any;
  LastRequest?: Date;
  userSlug: string;
}

