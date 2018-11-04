import { Controller, Post, HttpStatus, HttpCode, Get, Response, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { IAuthCredential } from './interfaces/auth-credential.interface';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService) {}

    @Post('login')
    async loginUser(@Response() res: any, @Body() body: IAuthCredential) {
        if (!(body && body.username && body.password)) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'Username and password are required!' });
        }

        const user: User = await this.userService.getUserByUsername(body.username);
        if (user) {
            if (await this.userService.compareHash(body.password, user.password)) {
                const token = await this.authService.createToken(user);
                return res.status(HttpStatus.OK).json({
                    success: true,
                    payload: token,
                });
            }
        }

        return res.status(HttpStatus.FORBIDDEN).json({
            success: false,
            message: 'Username or password wrong!',
        });
    }

    @Post('register')
    async registerUser(@Response() res: any, @Body() body: User) {
        if (!(body && body.username && body.password)) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'Username and password are required!' });
        }

        let user = await this.userService.getUserByUsername(body.username);

        if (user) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'Username exists' });
        } else {
            user = await this.userService.createUser(body);
            if (user) {
                user.password = undefined;
            }
        }

        return res.status(HttpStatus.OK).json(user);
    }
}