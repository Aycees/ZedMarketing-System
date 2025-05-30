import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, isUUID, MinLength } from "class-validator";

export class CreateJobDto {
    @IsString()
    @IsNotEmpty({ message: 'Title must not be empty.'})
    @MinLength(1, { message: 'Title must be more than 1 character long.'})
    title: string;

    @IsString()
    @IsOptional()
    @MinLength(1, { message: 'Description must be more than 1 character.'})
    description: string;

    @IsString()
    @IsOptional()
    jobCategoryId: string;

    @IsBoolean()
    @IsOptional()
    isArchived: boolean;
}
