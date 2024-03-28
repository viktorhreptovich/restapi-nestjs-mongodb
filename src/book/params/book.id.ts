import { IsObjectId } from '../../validator/object-id.validator';

export class ObjectIdParam {
  @IsObjectId({ message: 'Invalid book id' })
  id: string;
}
