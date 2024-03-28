import { Category } from '../schemas/book.schema';
import { IsEmpty, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/schemas/user.schema';

export class UpdateBookDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly author: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly price: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Category, { message: 'Category must be one of: science, fantasy, adventure' })
  readonly category: Category;

  @ApiProperty()
  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}
