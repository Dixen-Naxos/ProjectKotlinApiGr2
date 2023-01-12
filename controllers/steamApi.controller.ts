import express, {Request, Response, Router} from "express";
import {SteamApiService} from "../services";
import {CacheContainer} from "node-ts-cache";
import {MemoryStorage} from "node-ts-cache-storage-memory";

const steamApiCache = new CacheContainer(new MemoryStorage);

export class SteamApiController {
    async getMostPlayedGames(req: Request, res: Response) {
        try {
            let data = await steamApiCache.getItem<any>(`mostPlayedGames_${req.params.language}`);
            if (data === null || data === undefined) {
                data = await SteamApiService.getInstance().getMostPlayedGames(req.params.language);
                await steamApiCache.setItem(`mostPlayedGames_${req.params.language}`, data, {ttl: 3600})
            }
            res.json(data);
        } catch (err) {
            res.status(500).end();
        }
    }

    async getGameDetails(req: Request, res: Response) {
        try {
            let data = await steamApiCache.getItem<any>(`details_${req.params.language}_${req.params.appId}`);
            if (data === null || data === undefined) {
                data = await SteamApiService.getInstance().getGameDetails(req.params.appId, req.params.language);
                const res = await steamApiCache.setItem(`details_${req.params.language}_${req.params.appId}`, data, {ttl: 3600});
            }
            res.json(data);
        } catch (err) {
            res.status(500).end();
        }
    }

    async getGameOpinions(req: Request, res: Response) {
        try {
            let data = await steamApiCache.getItem<any>(`opinions_${req.params.language}_${req.params.appId}`);
            if (data === null || data === undefined) {
                data = await SteamApiService.getInstance().getGameOpinions(req.params.appId, req.params.language);
                const res = await steamApiCache.setItem(`opinions_${req.params.language}_${req.params.appId}`, data, {ttl: 3600});
            }
            res.json(data);
        } catch (err) {
            res.status(500).end();
        }
    }

    async getListOfGames(req: Request, res: Response) {
        try {
            let data = await steamApiCache.getItem(`ListOfGames`);
            if(data === null || data === undefined) {
                data = await SteamApiService.getInstance().getListOfGames();
                const res = await steamApiCache.setItem(`ListOfGames`, data, {ttl: 3600});
            }
            res.json(data);
        } catch (err) {
            res.status(500).end()
        }
    }

    async searchGames(req: Request, res: Response) {
        try {
            let data = await steamApiCache.getItem(`SearGames_${req.params.searched}`);
            if(data === null || data === undefined) {
                data = await SteamApiService.getInstance().searchGames(req.params.searched);
                const res = await steamApiCache.setItem(`SearGames_${req.params.searched}`, data, {ttl: 3600});
            }
            res.json(data);
        } catch (err) {
            res.status(500).end()
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/getMostPlayedGames/:language', this.getMostPlayedGames.bind(this));
        router.get('/getGameDetails/:appId/:language', this.getGameDetails.bind(this));
        router.get('/getGameOpinions/:appId/:language', this.getGameOpinions.bind(this));
        router.get('/getListOfGames', this.getListOfGames.bind(this));
        router.get('/searchGames/:searched', this.searchGames.bind(this));
        return router;
    }
}
