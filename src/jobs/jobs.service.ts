import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JobsService {
  constructor(private prismaService: PrismaService) {}

  async create(createJobDto: CreateJobDto) {
    const { jobCategoryId, ...jobData } = createJobDto;
    const existingJob = await this.prismaService.job.findUnique({
      where: {
        title: createJobDto.title,
      },
    });

    if (existingJob) {
      throw new BadRequestException('Job already exists.');
    }

    try {
      const createJob = await this.prismaService.job.create({
        data: {
          ...jobData,
          ...(jobCategoryId && {
            jobCategory: {
              connect: { id: jobCategoryId },
            },
          }),
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Job crated successfully',
        data: createJob,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      const allJob = await this.prismaService.job.findMany();

      if (!allJob || allJob.length === 0) {
        throw new NotFoundException('No jobs found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Jobs retrieved successfully',
        data: allJob,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      const job = await this.prismaService.job.findUnique({
        where: {
          id: id,
        },
      });

      if (!job) {
        throw new NotFoundException('No job found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Job retrieved successfully',
        data: job,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    const { jobCategoryId, ...jobData } = updateJobDto;
    const job = await this.prismaService.job.findUnique({
      where: {
        id: id,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    try {
      const updateJob = await this.prismaService.job.update({
        where: {
          id: job.id,
        },
        data: {
          ...jobData,
          ...(jobCategoryId && {
            jobCategory: {
              connect: { id: jobCategoryId },
            },
          }),
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Job updated successfully',
        data: updateJob,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async archiveJob(id: string) {
    const job = await this.prismaService.job.findUnique({
      where: {
        id: id,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }
    const { isArchived, ...jobData } = job;
    try {
      const archiveJob = await this.prismaService.job.update({
        where: {
          id: id,
        },
        data: {
          ...jobData,
          isArchived: !isArchived,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Category updated successfully',
        data: archiveJob,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
