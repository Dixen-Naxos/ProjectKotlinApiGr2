import {Request, RequestHandler} from "express";
import {AuthService} from "../services";
import {UserProps} from "../models";

declare module 'express' {
    export interface Request {
        user?: UserProps;
        files?: any
    }
}

export function checkUserConnected(): RequestHandler {
    return async function(req: Request,
                          res,
                          next) {
        const authorization = req.headers['authorization'];
        if(authorization === undefined) {
            res.status(401).end();
            return;
        }
        const parts = authorization.split(" ");
        if(parts.length !== 2) {
            res.status(401).end();
            return;
        }
        if(parts[0] !== 'Bearer') {
            res.status(401).end();
            return;
        }
        const token = parts[1];
        try {
            const user = await AuthService.getInstance().getUserFrom(token);
            if(user === null) {
                res.status(401).end();
                return;
            }
            req.user = user;
            next();
        } catch(err) {
            res.status(401).end();
        }
    }
}