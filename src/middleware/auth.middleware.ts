import { Injectable, NestMiddleware, NotAcceptableException } from "@nestjs/common";
import { Req, Res } from "@nestjs/common/decorators/http/route-params.decorator";
import { Request, Response } from "express";
import { AuthService } from "src/module/auth/auth.service";


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private authService: AuthService
    ) { }

    use(@Req() req: Request, @Res() res: Response, next: (error?: any) => void) {
        const userToken = req.headers.authorization.replace("Bearer ", "");

        const userData = this.authService.getUser(userToken);

        if (userData) {
            if (userData.isActived) {
                req.body = { ...req.body, level: userData.level }
                next()
            }
            else throw new NotAcceptableException({ error: "Akun belum diaktivasi" })
        } else {
            res.status(403).send({ error: "No Authentication Token Provided" });
        }

    }
}