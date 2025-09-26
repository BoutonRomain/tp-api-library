import {Body, Controller, Delete, Patch, Path, Post, Route, Security, Tags} from "tsoa";
import {AuthenticationDTO} from "../dto/authentication.dto";
import {CustomError} from "../middlewares/errorHandler";
import {authenticationService} from "../services/authentication.service";
import {UserDTO} from "../dto/user.dto";
import {toDto} from "../mapper/user.mapper";

@Route("auth")
export class AuthenticationController extends Controller {
    @Post("/")
    public async authenticate(@Body() responseBody: AuthenticationDTO) {
        const {grant_type, username, password} = responseBody;

        if (grant_type !== "password") {
            let error: CustomError = new Error("Unsupported grant type");
            error.status = 400;
            throw error;
        }

        const token = await authenticationService.authenticate(username, password);

        return { token };
    }

    @Security("jwt", ["delete-users"])
    @Delete("{id}")
    public async delete(@Path() id: number): Promise<void> {
        await authenticationService.deleteUser(id);
    }

    @Security("jwt", ["patch-users"])
    @Patch("{id}")
    public async getUser(
        @Path() id: number,
        @Body() responseBody: UserDTO
        ): Promise<UserDTO> {
        const user = await authenticationService.patchUser(id, responseBody);
        return toDto(user);
    }
}

