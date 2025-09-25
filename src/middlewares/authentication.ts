import * as express from "express";
import * as jwt from "jsonwebtoken";

const roles: {[key: string]: string[]} = {
    "admin": ["get-*", "post-*", "delete-*", "patch-*"],
    "user": ["get-*", "post-books"],
    "manager": ["get-*", "post-*", "patch-*", "delete-bookCopies"]
};

const regex = "/\\*/g";

export function expressAuthentication (
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    if (securityName === "jwt") {
        const token = request.headers["authorization"];
        console.log("token : " + token);
        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new Error("Token is required"));
            } else {
                jwt.verify(token, "your_secret_key", function(erreur, decoded){
                    if (scopes !== undefined) {
                        // Gestion des droits
                        const arrayRole = token.split(".")[1];
                        const role = JSON.parse(atob(arrayRole)).username;

                        switch (role) {
                            case "admin":
                                resolve(decoded);
                                break;
                            case "user":
                                scopes.forEach((scope) => {
                                    console.log("Scope : " + scope);
                                    console.log("Role : " + role);
                                    console.log("Roles[user] : " + roles["user"]);
                                    console.log("Role[user] : " + role["user"]);
                                    if (roles["user"].includes(scope) ||
                                        (
                                            role["user"].split("-")[0] === scope.split("-")[0]
                                            && role["user"].split("-")[1] === "*"
                                        )
                                    ) {
                                        resolve(decoded);
                                    }
                                })
                                break;
                            case "manager":
                                scopes.forEach((scope) => {
                                    if (roles["manager"].includes(scope) ||
                                        (
                                            role["manager"].split("-")[0] === scope.split("-")[0]
                                            && role["manager"].split("-")[1] === "*"
                                        )
                                    ) {
                                        resolve(decoded);
                                    }
                                })
                                break;
                            default:
                                reject(new Error("Token is required"));

                        }
                    }
                })
            }
        })
    } else {
        throw new Error("Only supports JWT authentication");
    }
}