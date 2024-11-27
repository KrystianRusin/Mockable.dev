import express, { Router, Request, Response } from 'express';
import generateData from '../functions/handleGET';
import Endpoint from '../models/Endpoint';

const router: Router = express.Router();

router.all("/:userslug/*", async (req: Request, res: Response) => {
    const userSlug = req.params.userslug;
    let endpointPath = req.params[0];

    if(!endpointPath){
        endpointPath = '';
    }

    const url = "/" + endpointPath;
    const method = req.method.toUpperCase();

    try {
        const endpoint = await Endpoint.findOne({userSlug, url, method});

        if(!endpoint){
            return res.status(404).json({message: 'Endpoint not found'});
        }
        const data = await generateData(endpoint);
        res.json(data);
    } catch (err) {
        console.error('Internal Server Error', err);
        res.status(500).json({message: 'Server Error'});
    }
});

export default router;