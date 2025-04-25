import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const account = await this.prismaService.account.findUnique({
      where: {
        username: username,
      },
    });

    if (!account) {
      throw new NotFoundException(`No accounts found with username: ${username} `)
    }

    if (account.isArchived) {
      throw new ForbiddenException('Account is archived')
    }

    const isPasswordValid = await bcrypt.compare(pass, account.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect.');
    }

    const payload = { sub: account.id, username: account.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
