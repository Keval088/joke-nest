import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
    password: string;
}
