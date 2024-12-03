import express, { Router, Request, Response } from 'express';
import generateGETData from '../functions/handleGET';
import generatePOSTData from '../functions/handlePOST';
import Endpoint from '../models/Endpoint';

const router: Router = express.Router();

router.get("/:userslug/*", async (req: Request, res: Response) => {
    const forceRefresh = req.query.r === 'true';
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
        const data = await generateGETData(endpoint, forceRefresh);
        res.json(data);
    } catch (err) {
        console.error('Internal Server Error', err);
        res.status(500).json({message: 'Server Error'});
    }
});

router.post("/:userslug/*", async (req: Request, res: Response) => {
    const userSlug = req.params.userslug;
    const endpointPath = req.params[0];
    const url = "/" + endpointPath;
    const method = req.method.toUpperCase();
    const forceRefresh = req.query.forceRefresh === 'true';
  
    try {
      const endpoint = await Endpoint.findOne({ userSlug, url, method });
      if (!endpoint) {
        return res.status(404).json({ message: 'Endpoint not found' });
      }
      const data = await generatePOSTData(endpoint, req.body, forceRefresh);
      res.status(201).json(data);
    } catch (err: any) {
      console.error('Error handling POST request', err);
      if (err.message.includes('does not match')) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Server Error' });
      }
    }
  });
  

export default router;