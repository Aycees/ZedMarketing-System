import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prismaService: PrismaService) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    const { employeeId, ...attendanceData } = createAttendanceDto;
    const dateOnly = createAttendanceDto.time_in.toISOString().split('T')[0];
    const existingAttendance = await this.prismaService.attendance.findFirst({
      where: {
        employeeId: employeeId,
        time_in: new Date(dateOnly),
      },
    });

    if (existingAttendance) {
      throw new BadRequestException('Attendance already exists.');
    }

    try {
      const createAttendance = await this.prismaService.attendance.create({
        data: {
          employeeId,
          ...attendanceData,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Attendance created successfully.',
        data: createAttendance,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      const allAttendance = await this.prismaService.attendance.findMany({});

      if (!allAttendance || allAttendance.length === 0) {
        throw new NotFoundException('No attendances found.');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Attendance is found',
        data: allAttendance,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      const attendance = await this.prismaService.attendance.findUnique({
        where: { id: id },
      });

      if (!attendance) {
        throw new NotFoundException('Attendance not found.');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Attendance is found',
        data: attendance,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    const attendance = await this.findOne(id);
    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }
    
    const { time_in, ...updateData } = updateAttendanceDto;

    try {
      const updatedAttendance = await this.prismaService.attendance.update({
        where: { id },
        data:{
          ...updateData,
        }
      })

      return {
        statusCode: HttpStatus.OK,
        message: 'Attendance updated successfully.',
        data: updatedAttendance,
      };

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async archiveAttendance(id: string) {
    const attendance = await this.findOne(id);

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    const { isArchived, ...attendanceData } = attendance.data;
    try {
      const archiveAttendance = await this.prismaService.attendance.update({
        where: {
          id: id,
        },
        data: {
          ...attendanceData,
          isArchived: !isArchived,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Attendance updated successfully',
        data: archiveAttendance,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
