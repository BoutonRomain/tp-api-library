import {User} from "../models/user.model";
import jwt from "jsonwebtoken";
import {CustomError} from "../middlewares/errorHandler";

export class AuthenticationService {
    public async authenticate(username: string, password: string): Promise<string> {
        const user = await User.findOne({where: { username, password }});

        if (!user) {
            let error: CustomError = new Error("Invalid credentials");
            error.status = 401;
            throw error;
        }

        return jwt.sign(
            {username: user.username},
            "your_secret_key",
            {expiresIn: "1h"});
    }
}

export const authenticationService = new AuthenticationService();
