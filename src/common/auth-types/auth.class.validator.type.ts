import {IsString, isNumber, IsEmail, MinLength, minLength} from 'class-validator'


export class RegisterDto {
    @IsString()
    @MinLength(4)
    login: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string
}


export class LoginDto {
    @IsEmail()
    email: string

    @IsString()
    @MinLength(8)
    password: string
}