import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        SequelizeModule.forFeature([User]),
        PassportModule,
        JwtModule.register({
            secret: 'test123Key',
            signOptions: { expiresIn: '60m' },
        }),
        HttpModule,
    ],
    providers: [UsersService, JwtStrategy],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule { }
