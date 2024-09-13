import { Controller, Post, Get, Body, Req, UseGuards, ValidationPipe, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from './create-user.dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,

    ) { }

    @Post('signup')
    async signup(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return this.usersService.signup(createUserDto);
    }

    @Post('login')
    async login(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return this.usersService.login(createUserDto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req: Request) {
        const authHeader = req?.headers?.authorization;
        if (!authHeader) {
            throw new BadRequestException('Authorization header is missing or incorrect');
        }

        // Extract the token from the header
        const token = authHeader.split(' ')[1];
        console.log(token);
        const user_data: any = this.jwtService.verify(token, { secret: 'test123Key' })
        console.log(user_data);

        const userId = user_data?.id;
        if (!userId) {
            throw new NotFoundException('User ID not found in request');
        }
        const user = await this.usersService.getProfile(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return {email:user.email};
    }

    @Get('random-joke')
    async getRandomJoke() {
        return this.usersService.getRandomJoke();
    }

    @Post('logout')
    async logout(@Req() req) {
        return this.usersService.logout();
    }
}
