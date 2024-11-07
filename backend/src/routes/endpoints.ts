import express, { Router, Request, Response } from 'express';
import Endpoint from '../models/Endpoint';
import auth from '../middleware/auth';
import mongoose from 'mongoose';


const router: Router = express.Router();

router.post('/create', auth, async (req: Request, res: Response) => {
    try {
        const {name, method, url, description, JSONSchema, userSlug } = req.body;
        const userId = (req as any).user.userId; 
        console.log(JSONSchema)

        // Query to check if the endpoint already exists for the user
        const existingEndpoint = await Endpoint.findOne({
        url: url,
        user: userId,
        });
        if (existingEndpoint) {
            return res.status(400).json({ message: 'Endpoint already exists' });
        }

        // Create a new endpoint
        try {
            const newEndpoint = new Endpoint({name, description, method, url, JSONSchema, userSlug, user: userId});
            const savedEndpoint = await newEndpoint.save();
            console.log(savedEndpoint)
        } catch (err) {
            console.error('Failed to create endpoint:', err);
            return res.status(500).json({ message: 'Failed to create endpoint' });
        }
        

        res.status(200).json({ message: 'Success' });
    } catch (err: any) {
        console.error('Endpoint error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
    });

router.delete('/delete/:id', auth, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const endpointId = new mongoose.Types.ObjectId(req.params.id);
        const deletedEndpoint = await Endpoint.findOneAndDelete({
            _id: endpointId,
            user: userId,
        });
        if (!deletedEndpoint) {
            return res.status(404).json({ message: 'Endpoint not found' });
        }
        res.status(200).json({ message: 'Success' });
    } catch (err) {
        console.error('Failed to delete endpoint:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/edit/:id', auth, async (req: Request, res: Response) => {
    try {
        const { name, description, method, url, JSONSchema, userSlug } = req.body;
        const userId = (req as any).user.userId;
        const endpointId = new mongoose.Types.ObjectId(req.params.id);
        const existingEndpoint = await Endpoint.findOne({
            url: url,
            user: userId,
            _id: { $ne: endpointId },
        });
        if (existingEndpoint) {
            return res.status(400).json({ message: 'Endpoint already exists' });
        }

        // Update the endpoint
        const updatedEndpoint = await Endpoint.findByIdAndUpdate
        (endpointId, 
        { name, description, method, url, JSONSchema, userSlug }, 
        );

        if (!updatedEndpoint) {
            return res.status(404).json({ message: 'Endpoint not found' });
        }

        res.status(200).json({ updatedEndpoint });
    } catch (err) {
        console.error('Failed to update endpoint:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/all', auth, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const endpoints = await Endpoint.find({ user: userId });
        res.status(200).json({ endpoints });
    } catch (err) {
        console.error('Failed to get endpoints:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});


export default router;