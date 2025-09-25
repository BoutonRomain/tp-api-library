import {Body, Controller, Post, Route, Tags} from "tsoa";
import {AuthenticationDTO} from "../dto/authentication.dto";
import {CustomError} from "../middlewares/errorHandler";
import {authenticationService} from "../services/authentication.service";

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
}

