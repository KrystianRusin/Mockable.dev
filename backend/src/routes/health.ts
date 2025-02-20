import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

router.get('/check', async (req: Request, res: Response) => {
    return res.status(200).json({message: 'Health Check Good!'})
})

export default router