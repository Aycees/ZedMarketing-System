import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

enum EmployeeType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
}

enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
}

export class CreateEmployeeDto {
  @IsString()
  firstname: string;

  @IsString()
  @IsOptional()
  middlename: string;

  @IsString()
  lastname: string;

  @IsString()
  address: string;

  @IsString()
  @MinLength(11, {
    message: 'Contact number must be exactly 11 characters long.',
  })
  @MaxLength(11, {
    message: 'Contact number must be exactly 11 characters long.',
  })
  contactNumber: string;

  @IsString()
  @IsOptional()
  accountId: string;

  @IsString()
  @IsOptional()
  jobId: string;

  @IsEnum(EmployeeType)
  employeeType: EmployeeType;

  @IsEnum(EmployeeStatus)
  employeeStatus: EmployeeStatus;

  @IsBoolean()
  isArchived: boolean;
}
