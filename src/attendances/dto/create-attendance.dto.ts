import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

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

    @IsDate()
    @IsOptional()
    time_in: Date;

    @IsEnum(AttendanceStatus)
    @IsNotEmpty()
    attendanceStatus: AttendanceStatus;

    @IsString()
    @IsOptional()
    remark: string;
}
