import { IsObjectId } from '../../validator/object-id.validator';

export class BookId {
  @IsObjectId({ message: 'Invalid book id' })
  id: string;
}
