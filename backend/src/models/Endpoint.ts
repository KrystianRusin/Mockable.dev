import mongoose, { Document, Schema } from 'mongoose';

export interface IEndpoint extends Document {
    _id: string; 
    name: string;
    description?: string;
    method: string;
    url: string;
    requestSchema?: any;
    responseSchema?: any;
    LastRequest?: Date;
    userSlug: string;
    user: Schema.Types.ObjectId;
}

const EndpointSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    method: {
        type: String,
        required: true,
        trim: true,
    },
    url: {
        type: String,
        required: true,
        trim: true,
    },
    requestSchema: {
        type: Schema.Types.Mixed,
        required: false,
        trim: true,
    },
    responseSchema: {
        type: Schema.Types.Mixed,
        required: false,
        trim: true,
    },
    LastRequest: {
        type: Date,
        required: false,
    },
    userSlug: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    collection: 'Endpoints',
    timestamps: true,
});

export default mongoose.model<IEndpoint>('Endpoint', EndpointSchema);