import {config} from "dotenv";
config();

import express from "express";
import mongoose, {Mongoose} from "mongoose";
import {AuthController, SteamApiController} from "./controllers";

async function startServer(): Promise<void> {

    const m: Mongoose = await mongoose.connect(process.env.MONGO_URI as string, {
        auth: {
            username: process.env.MONGO_USER  as string,
            password: process.env.MONGO_PASSWORD as string
        }
    });

    const app = express();

    const authController = new AuthController();
    app.use('/auth', authController.buildRoutes());
    const steamApiController = new SteamApiController();
    app.use('/steamApi', steamApiController.buildRoutes());

    app.listen(process.env.PORT, function() {
        console.log("Server listening on port " + process.env.PORT);
    });
}

startServer().catch(console.error);