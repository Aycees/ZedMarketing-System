import { Injectable, NotFoundException, HttpStatus, HttpException, BadRequestException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prismaService: PrismaService ) {}
  
  async create(createAccountDto: CreateAccountDto) {
    try {
      const createAccount = await this.prismaService.account.create({
        data: {
          ...createAccountDto
        }
      });

      if (!createAccount) {
        throw new BadRequestException('Account creation failed');
      }

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Account created successfully',
        data: createAccount,
      };

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

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
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
