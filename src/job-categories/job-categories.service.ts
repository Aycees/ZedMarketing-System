import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobCategoryDto } from './dto/create-job-category.dto';
import { UpdateJobCategoryDto } from './dto/update-job-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JobCategoriesService {
  constructor(private prismaService: PrismaService) {}

  async create(createJobCategoryDto: CreateJobCategoryDto) {
    const existingCategory = await this.prismaService.jobCategory.findUnique({
      where: {
        name: createJobCategoryDto.name,
      },
    });

    if (existingCategory) {
      throw new BadRequestException('Category already exists.');
    }

    try {
      const createCategory = await this.prismaService.jobCategory.create({
        data: {
          ...createJobCategoryDto,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Category created successfully',
        data: createCategory,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      const allCategory = await this.prismaService.jobCategory.findMany();

      if (!allCategory || allCategory.length === 0) {
        throw new NotFoundException('No categories found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Categories retrieved successfully',
        data: allCategory,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prismaService.jobCategory.findUnique({
        where: {
          id: id,
        },
      });

      if (!category) {
        throw new NotFoundException('No category found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Category retrieved successfully',
        data: category,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateJobCategoryDto: UpdateJobCategoryDto) {
    const category = await this.prismaService.jobCategory.findUnique({
      where: {
        id: id,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    try {
      const updateCategory = await this.prismaService.jobCategory.update({
        where: {
          id: category.id,
        },
        data: {
          ...updateJobCategoryDto,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Category updated successfully',
        data: updateCategory,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async archiveCategory(id: string) {
    const category = await this.prismaService.jobCategory.findUnique({
      where: {
        id: id,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const { isArchived, ...rest } = category;
    try {
      const archiveCategory = await this.prismaService.jobCategory.update({
        where: {
          id: id,
        },
        data: {
          ...rest,
          isArchived: !isArchived,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Category updated successfully',
        data: archiveCategory,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
