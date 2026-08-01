import { HttpException, ValidationPipe } from '@nestjs/common';
import { isArray, ValidationError } from 'class-validator';

function flattenErrors(errors: ValidationError[]): ValidationError[] {
  return errors.reduce((aggr: ValidationError[], curr: ValidationError) => {
    if (curr.contexts) {
      aggr.push(curr);
    }
    if (curr.children && isArray(curr.children) && curr.children.length > 0) {
      aggr.push(...flattenErrors(curr.children));
    }
    return aggr;
  }, []);
}

export const globalValidationPipe = new ValidationPipe({
  transform: true,
  exceptionFactory: (errors) => {
    return new HttpException(
      {
        status: 400,
        message: 'Validation Error',
        errors: flattenErrors(errors)
          .filter(
            (error) =>
              error.contexts && Object.values(error.contexts).length > 0,
          )
          .map((error) =>
            error.contexts
              ? Object.values(error.contexts).map((c) => c['appError'])
              : [],
          )
          .reduce((aggr, curr) => {
            return aggr.concat(curr);
          }, []),
      },
      400,
    );
  },
});
