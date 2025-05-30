import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

enum AttendanceStatus {
    PRESENT = "PRESENT",
    ABSENT = "ABSENT",
    LATE = "LATE",
    HALF_DAY = "HALF_DAY"
}

export class CreateAttendanceDto {
    @IsString()
    @IsNotEmpty()
    employeeId: string;

    @Type(() => Date)
    @IsDate()
    time_in: Date;

    @IsEnum(AttendanceStatus)
    @IsNotEmpty()
    attendanceStatus: AttendanceStatus;

    @IsString()
    @IsOptional()
    remark: string;
    
    @IsBoolean()
    @IsOptional()
    isArchived: boolean;
}
