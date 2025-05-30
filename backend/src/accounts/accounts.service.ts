import {
  Injectable,
  NotFoundException,
  HttpStatus,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prismaService: PrismaService) {}

  async create(createAccountDto: CreateAccountDto) {
    const existingUsername = await this.prismaService.account.findUnique({
      where: {
        username: createAccountDto.username,
      },
    });

    if (existingUsername) {
      throw new BadRequestException('Username already exists');
    }

    try {
      const hashedPassword = await bcrypt.hash(createAccountDto.password, 10);
      const createAccount = await this.prismaService.account.create({
        data: {
          ...createAccountDto,
          password: hashedPassword,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Account created successfully',
        data: createAccount,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      const allAccounts = await this.prismaService.account.findMany();

      if (!allAccounts || allAccounts.length === 0) {
        throw new NotFoundException('No accounts found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Accounts retrieved successfully',
        data: allAccounts,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      const account = await this.prismaService.account.findUnique({
        where: {
          id: id,
        },
      });

      if (!account) {
        throw new NotFoundException(`No account found`);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Account retrieved successfully',
        data: account,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const account = await this.prismaService.account.findUnique({
      where: {
        id: id,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    try {
      const hashedPassword = await bcrypt.hash(updateAccountDto.password, 10);
      const updateAccount = await this.prismaService.account.update({
        where: {
          id: account.id,
        },
        data: {
          ...updateAccountDto,
          password: hashedPassword,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Account updated successfully',
        data: updateAccount,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async archiveAccount(id: string) {
    const account = await this.prismaService.account.findUnique({
      where: {
        id: id,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }
    const { isArchived, ...accountData } = account;
    try {
      const archiveAccount = this.prismaService.account.update({
        where: {
          id: account.id,
        },
        data: {
          ...accountData,
          isArchived: !isArchived,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Account un/archive successfully',
        data: archiveAccount,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
