import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { isValidObjectId } from 'mongoose';

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any, args: ValidationArguments) {
          console.log(`value: ${value}, args: ${args}`);
          return isValidObjectId(value);
        }
      }
    });
  };
}



