import { Category } from '../schemas/book.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsObjectId } from '../../validator/object-id.validator';
import { User } from '../../auth/schemas/user.schema';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly author: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Category, { message: 'Category must be one of: science, fantasy, adventure' })
  readonly category: Category;

  @ApiProperty()
  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}
