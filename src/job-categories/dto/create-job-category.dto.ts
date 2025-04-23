import { IsNotEmpty, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateJobCategoryDto {
    @IsString()
    @IsNotEmpty({ message: 'Name must not be empty.'})
    @MinLength(1, { message: 'Name must be more than 1 character long.'})
    name: string;

    @IsString()
    @IsOptional()
    @MinLength(1, { message: 'Name must be more than 1 character long.'})
    description: string
}
