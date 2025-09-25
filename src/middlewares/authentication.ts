import * as express from "express";
import * as jwt from "jsonwebtoken";

let adminRights = [];
let userRights = [];
let managerRights = [];

export function expressAuthentication (
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    if (securityName === "jwt") {
        const token = request.headers["authorization"];

        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new Error("Token is required"));
            } else {
                jwt.verify(token, "your_secret_key", function(erreur, decoded){
                    if (scopes !== undefined) {
                        // Gestion des droits
                    }
                    resolve(decoded);
                })
            }
        })
    } else {
        throw new Error("Only supports JWT authentication");
    }
}