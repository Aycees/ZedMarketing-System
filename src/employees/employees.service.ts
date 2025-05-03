import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prismaService: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const existingEmployee = await this.prismaService.employee.findFirst({
      where: {
        firstname: createEmployeeDto.firstname,
        lastname: createEmployeeDto.lastname,
      },
    });

    if (existingEmployee) {
      throw new BadRequestException('Employee already exists.');
    }

    const { accountId, jobId, ...employeeData } = createEmployeeDto;
    try {
      const createEmployee = await this.prismaService.employee.create({
        data: {
          ...employeeData,
          ...(accountId && {
            account: {
              connect: { id: accountId },
            },
          }),
          ...(jobId && {
            job: {
              connect: { id: jobId },
            },
          }),
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Employee created successfully.',
        data: createEmployee,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      const allEmployee = await this.prismaService.employee.findMany({
        where: {
          isArchived: false,
        },
      });

      if (!allEmployee || allEmployee.length === 0) {
        throw new NotFoundException('No employees found.');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Employee fetched successfully.',
        data: allEmployee,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      const employee = await this.prismaService.employee.findUnique({
        where: {
          id: id,
        },
      });

      if (!employee) {
        throw new NotFoundException('Employee not found.');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Employee fetched successfully.',
        data: employee,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const { accountId, jobId, ...employeeData } = updateEmployeeDto;
    const employee = await this.findOne(id);

    if (!employee) {
      throw new NotFoundException('Employee not found.');
    }

    try {
      const updateEmployee = await this.prismaService.employee.update({
        where: {
          id: id,
        },
        data: {
          ...employeeData,
          ...(accountId && {
            account: {
              connect: { id: accountId },
            },
          }),
          ...(jobId && {
            job: {
              connect: { id: jobId },
            },
          }),
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Employee updated successfully',
        data: updateEmployee,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async archiveEmployee(id: string) {
    const employee = await this.findOne(id);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const { isArchived, ...employeeData } = employee.data;
    try {
      const archiveEmployee = await this.prismaService.employee.update({
        where: {
          id: id,
        },
        data: {
          ...employeeData,
          isArchived: !isArchived,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Attendance updated successfully',
        data: archiveEmployee,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
