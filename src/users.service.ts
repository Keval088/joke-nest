import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './user.model';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs/operators';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly httpService: HttpService,
    ) { }

    async validateUser(email: string, password: string): Promise<User> {
        const user: User = await User.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const isMatch: boolean = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            throw new BadRequestException('Password does not match');
        }
        return user;
    }

    async signup(createUserDto: CreateUserDto): Promise<any> {
        const { email, password } = createUserDto;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        User.create({ email, password: hashedPassword });
        return { message: "Signup Successfully" }
    }

    async login(createUserDto: CreateUserDto): Promise<{ access_token: string }> {
        const { email, password } = createUserDto;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user?.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { email: user?.email, id: user.id };
        const access_token = this.jwtService.sign(payload);

        return { access_token };
    }

    async getProfile(id: number): Promise<User> {
        // Retrieve user by ID
        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async getRandomJoke() {
        return this.httpService.get('https://api.chucknorris.io/jokes/random').pipe(
            map((response: any) => response?.data),
            catchError(error => {
                throw new Error('Failed to fetch joke');
            }),
        ).toPromise();
    }

    async logout() {
        return { message: 'Logged out successfully' };
    }
}
