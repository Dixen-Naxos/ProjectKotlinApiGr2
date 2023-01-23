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

    public async getMostPlayedGames(language: string): Promise<any> {
        const res = await axios.get(`https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/?l=${language}`);
        return res.data;
    }

    public async getGameDetails(appId: string, language:string): Promise<any> {
        const res = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}&l=${language}`);
        return res.data;
    }

    public async getGameOpinions(appId: string, language:string): Promise<any> {
        const res = await axios.get(`https://store.steampowered.com/appreviews/${appId}?json=1&l=${language}`);
        return res.data;
    }

    public async getListOfGames(): Promise<any> {
        const res = await axios.get(`http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=${process.env.STEAM_API_KEY}&format=json`);
        return res.data;
    }

    public async searchGames(searched: string, language:string): Promise<any> {
        let res = await axios.get(`https://steamcommunity.com/actions/SearchApps/${searched}/?key=${process.env.STEAM_API_KEY}&l=${language}&format=json`);
        let returned = {};
        for (let i = 0; i < res.data.length; i++) {
            let game = await this.getGameDetails(res.data[i]['appid'], language);
            returned = Object.assign({}, returned, game);
        }
        return returned;
    }
}
