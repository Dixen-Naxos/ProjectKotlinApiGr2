import express, {Request, Response, Router} from "express";
import {SteamApiService} from "../services";
import {CacheContainer} from "node-ts-cache";
import {MemoryStorage} from "node-ts-cache-storage-memory";

const steamApiCache = new CacheContainer(new MemoryStorage);

export class SteamApiController {
    async getMostPlayedGames(req: Request, res: Response) {
        try {
            let data = await steamApiCache.getItem<any>("mostPlayedGames");
            if (data === null || data === undefined) {
                data = await SteamApiService.getInstance().getMostPlayedGames();
                await steamApiCache.setItem("mostPlayedGames", data, {ttl: 3600})
            }
            res.json(data);
        } catch (err) {
            res.status(500).end();
        }
    }

    async getGameDetails(req: Request, res: Response) {
        try {
            let data = await steamApiCache.getItem<any>(`details_${req.params.appId}`);
            if (data === null || data === undefined) {
                data = await SteamApiService.getInstance().getGameDetails(req.params.appId);
                const res = await steamApiCache.setItem(`details_${req.params.appId}`, data, {ttl: 3600});
            }
            res.json(data);
        } catch (err) {
            res.status(500).end();
        }
    }

    async getGameOpinions(req: Request, res: Response){
        try {
            let data = await steamApiCache.getItem<any>(`opinions_${req.params.appId}`);
            if (data === null || data === undefined) {
                data = await SteamApiService.getInstance().getGameOpinions(req.params.appId);
                const res = await steamApiCache.setItem(`opinions_${req.params.appId}`, data, {ttl: 3600});
            }
            res.json(data);
        } catch (err) {
            res.status(500).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/getMostPlayedGames', this.getMostPlayedGames.bind(this));
        router.get('/getGameDetails/:appId', this.getGameDetails.bind(this));
        router.get('/getGameOpinions/:appId', this.getGameOpinions.bind(this));
        return router;
    }
}