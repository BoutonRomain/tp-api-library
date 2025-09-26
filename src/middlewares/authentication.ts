import * as express from "express";
import * as jwt from "jsonwebtoken";

const usersRights: { [key: string]: string[] } = {
    "admin": ["get-*", "post-*", "delete-*", "patch-*"],
    "user": ["get-*", "post-books"],
    "manager": ["get-*", "post-*", "patch-*", "delete-bookCopies"]
};

const regex = "/\\*/g";

export function expressAuthentication(
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
                jwt.verify(token, "your_secret_key", function (erreur, decoded) {
                    if (scopes !== undefined) {
                        // Gestion des droits
                        const arrayRole = token.split(".")[1];
                        const tokenRole = JSON.parse(atob(arrayRole)).username;

                        if (tokenRole === "admin") resolve(decoded);

                        scopes.forEach(scope => {
                            for (let role in usersRights) {
                                if (role === tokenRole) {
                                    usersRights[role].forEach((right) => {
                                        if (right === scope) {
                                            console.log("right===scope");
                                            console.log("right.split(\"-\")[0] = " + right.split("-")[0]);
                                            console.log("scope.split(\"-\")[0] = " + scope.split("-")[0]);
                                            console.log("right.split(\"-\")[1] = " + right.split("-")[1]);
                                            resolve(decoded);
                                        } else {
                                            if (
                                                right.split("-")[0] === scope.split("-")[0]
                                                && right.split("-")[1] === "*") {
                                                resolve(decoded);
                                            }
                                        }
                                    })
                                    console.log("role content : " + usersRights[role] + ", role key = " + role);
                                    console.log("tokenRole : " + tokenRole);
                                }
                            }
                        })
                    }
                    reject(new Error("Wrong token"));
                })
            }
        })
    } else {
        throw new Error("Only supports JWT authentication");
    }
}