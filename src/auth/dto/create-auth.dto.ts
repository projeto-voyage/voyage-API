import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAuthDto {
    @ApiProperty({ example: 'john@example.com', description: 'User email' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password (min 8 characters)' })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;
}
