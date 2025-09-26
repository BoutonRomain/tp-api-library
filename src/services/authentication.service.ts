import {User} from "../models/user.model";
import jwt from "jsonwebtoken";
import {CustomError} from "../middlewares/errorHandler";
import {UserDTO} from "../dto/user.dto";

export class AuthenticationService {
    public async authenticate(username: string, password: string): Promise<string> {
        const user = await User.findOne({where: { username, password }});

        if (!user) {
            let error: CustomError = new Error("Invalid credentials");
            error.status = 401;
            throw error;
        }

        return jwt.sign(
            {username: user.dataValues.username},
            "your_secret_key",
            {expiresIn: "1h"});
    }

    public async deleteUser(id: number) {
        const user = await User.findByPk(id);
        if (!user) {
            let error: CustomError = new Error(`User ${id} not found`);
            error.status = 404;
            throw error;
        }

        await user.destroy();
    }

    public async patchUser(id: number, responseBody: UserDTO): Promise<User> {
        let user: User | null = await User.findByPk(id);
        if (!user) {
            let error: CustomError = new Error(`User ${id} not found`);
            error.status = 404;
            throw error;
        }
        if (responseBody.password) user.password = responseBody.password;
        if (responseBody.username) user.username = responseBody.username;
        await user.save();
        return user;
    }
}

export const authenticationService = new AuthenticationService();
