import axios from "axios";

export class SteamApiService {
    private static instance?: SteamApiService;

    public static getInstance(): SteamApiService {
        if (SteamApiService.instance === undefined) {
            SteamApiService.instance = new SteamApiService();
        }
        return SteamApiService.instance;
    }

    private constructor() {
    }

    public async getMostPlayedGames(): Promise<any> {
        const res = await axios.get("https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/?l=french");
        return res.data;
    }

    public async getGameDetails(appId: string): Promise<any> {
        const res = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}&l=french`)
        return res.data;
    }

    public async getGameOpinions(appId: string): Promise<any> {
        const res = await axios.get(`https://store.steampowered.com/appreviews/${appId}?json=1&l=french`)
        return res.data;
    }
}