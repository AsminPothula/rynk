import {
  FILES_FIELD_NAME,
  FILE_FIELD_NAME,
  METADATA,
  REGEX,
  SAMPLE_DECIMAL,
  SAMPLE_EMAIL,
  SAMPLE_INT,
  SAMPLE_NUMBER_STRING,
  SAMPLE_PASSWORD,
  SAMPLE_UUID,
} from '@constant';
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  InvalidBoolValidationError,
  InvalidDateValidationError,
  InvalidDecimalValidationError,
  InvalidEmailValidationError,
  InvalidEnumValidationError,
  InvalidIntValidationError,
  InvalidNumberValidationError,
  InvalidStringValidationError,
  InvalidValueValidationError,
  MaxNumberValidationError,
  MaxStringLengthValidationError,
  MinNumberValidationError,
  MinStringLengthValidationError,
  NotMatchingRegexValidationError,
  NotOneOfValuesValidationError,
  UnauthorizedError,
} from '@error';
import { DomainEvent, IntegrationEvent, NotifyEvent } from '@events';
import { isNotNullOrUndefined } from '@helper';
import { TimeoutInterceptor } from '@interceptor';
import {
  DefaultValuePipe,
  Delete,
  ExecutionContext,
  FileTypeValidator,
  ForbiddenException,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  SetMetadata,
  UploadedFile,
  UseInterceptors,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiBodyOptions,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiParamOptions,
  ApiProperty,
  ApiPropertyOptional,
  ApiPropertyOptions,
  ApiQuery,
  ApiQueryOptions,
  ApiResponse,
  ApiResponseOptions,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {
  AppError,
  Constructor,
  DevApiKeyPermissionsType,
  UserPermission,
} from '@types';
import { AuthDetail } from '@user/types';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsDecimal,
  IsEmail,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  DeveloperApiKeyPermissionsGuard,
  HasDevApiKeyPermissions,
} from 'src/dev-api-key/dev-api-key.utils';

export const Public = () => SetMetadata(METADATA.IS_PUBLIC_KEY, true);

export const HasPermission = (permission: UserPermission | UserPermission[]) =>
  SetMetadata(METADATA.PERMISSION, permission);

export const DecodedJwt = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthDetail => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const ServerKey = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const serverKey = request.headers['x-server-key'];
    if (!serverKey) {
      throw new ForbiddenException('Server key is missing');
    }
    return serverKey;
  },
);

export const Api = (
  options: (
    | {
        hasPermission: UserPermission;
      }
    | {
        isPublic: boolean;
      }
    | {
        hasDevApiKey:
          | {
              adminOnly: true;
            }
          | {
              adminOnly: false;
              otherDevPermissions: DevApiKeyPermissionsType[];
            };
      }
  ) & {
    deprecated?: boolean;
    excludeFromSwagger?: boolean;
    swaggerRequestBody?: ApiBodyOptions;
    swaggerRequestParam?: ApiParamOptions;
    swaggerRequestQueries?: ApiQueryOptions[];
    swaggerRequestErrors?: Constructor<AppError>[];
    swaggerSuccessResponseCode?: number;
    path: string;
    fileUpload?: 'single' | 'multiple';
    maxFilesUpload?: number;
    extraMultiPartData?: Record<string, SchemaObject | ReferenceObject>;
    timeoutMs?: number;
  } & (
      | {
          verb: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
        }
      | {
          verb: 'GET';
          disableCache?: boolean;
          cacheTTL?: number; // In seconds
        }
    ) &
    (
      | {
          swaggerSuccessResponse: Constructor<any> | null;
        }
      | {
          swaggerResponses: ApiResponseOptions[];
        }
    ),
) => {
  if (!options) {
    throw Error('Please supply api info.');
  }
  const {
    swaggerRequestBody,
    swaggerRequestParam,
    swaggerRequestQueries,
    swaggerRequestErrors,
    path,
    verb,
    deprecated,
    excludeFromSwagger,
    fileUpload,
    swaggerSuccessResponseCode,
    extraMultiPartData,
    timeoutMs,
  } = options;
  const decorators: MethodDecorator[] = [];
  const swaggerErrors = [
    {
      $ref: getSchemaPath(InternalServerError),
    },
  ];

  const isPublicAPI =
    !('isPublic' in options) || ('isPublic' in options && options['isPublic']);

  if (isPublicAPI) {
    decorators.push(Public());
  } else {
    swaggerErrors.push(
      {
        $ref: getSchemaPath(ForbiddenError),
      },
      {
        $ref: getSchemaPath(UnauthorizedError),
      },
    );
    decorators.push(ApiBearerAuth());
  }
  if (swaggerRequestBody) {
    decorators.push(ApiBody(swaggerRequestBody));
  }
  if (swaggerRequestParam) {
    decorators.push(ApiParam(swaggerRequestParam));
  }
  if (swaggerRequestQueries) {
    swaggerRequestQueries.forEach((query) => {
      decorators.push(ApiQuery(query));
    });
  }
  if (timeoutMs) {
    decorators.push(UseInterceptors(new TimeoutInterceptor(timeoutMs)));
  }
  if (fileUpload) {
    const isSingleFileUpload = fileUpload === 'single';
    decorators.push(ApiConsumes('multipart/form-data'));
    if (isSingleFileUpload) {
      decorators.push(UseInterceptors(FileInterceptor(FILE_FIELD_NAME)));
      if (!swaggerRequestBody) {
        decorators.push(
          ApiBody({
            schema: {
              type: 'object',
              properties: {
                [FILE_FIELD_NAME]: {
                  type: 'string',
                  format: 'binary',
                },
                ...(extraMultiPartData || {}),
              },
            },
          }),
        );
      }
    } else {
      decorators.push(
        UseInterceptors(
          FilesInterceptor(FILES_FIELD_NAME, options.maxFilesUpload),
        ),
      );
      if (!swaggerRequestBody) {
        decorators.push(
          ApiBody({
            schema: {
              type: 'object',
              properties: {
                [`${FILES_FIELD_NAME}`]: {
                  type: 'array',
                  items: {
                    format: 'binary',
                    type: 'string',
                  },
                },
                ...(extraMultiPartData || {}),
              },
            },
          }),
        );
      }
    }
  }

  switch (verb) {
    case 'POST':
      decorators.push(Post(path));
      if ('swaggerSuccessResponse' in options) {
        decorators.push(
          ApiResponse({
            type: options.swaggerSuccessResponse ?? undefined,
            status: 201,
          }),
        );
      }
      break;
    case 'GET':
      decorators.push(Get(path));
      if (!options.disableCache) {
        // decorators.push(UseInterceptors(HttpCacheInterceptor));
        // decorators.push(
        //   CacheTTL(options.cacheTTL || Config.Cache.DefaultCacheDuration),
        // );
      }
      if ('swaggerSuccessResponse' in options) {
        decorators.push(
          ApiResponse({
            type: options.swaggerSuccessResponse ?? undefined,
            status: swaggerSuccessResponseCode ?? 200,
          }),
        );
      }
      break;
    case 'PATCH':
      decorators.push(Patch(path));
      if ('swaggerSuccessResponse' in options) {
        decorators.push(
          ApiResponse({
            type: options.swaggerSuccessResponse ?? undefined,
            status: 200,
          }),
        );
      }
      break;
    case 'PUT':
      decorators.push(Put(path));
      if ('swaggerSuccessResponse' in options) {
        decorators.push(
          ApiResponse({
            type: options.swaggerSuccessResponse ?? undefined,
            status: 200,
          }),
        );
      }
      break;
    case 'DELETE':
      decorators.push(Delete(path));
      if ('swaggerSuccessResponse' in options) {
        decorators.push(
          ApiResponse({
            type: options.swaggerSuccessResponse ?? undefined,
            status: 200,
          }),
        );
      }
      break;
    default:
      throw Error('Should never happen');
  }
  if ('swaggerResponses' in options) {
    options.swaggerResponses.forEach((res) => {
      decorators.push(ApiResponse(res));
    });
  }

  const swaggerErrorExample = swaggerRequestErrors
    ? new swaggerRequestErrors[0]()
    : new BadRequestError();

  decorators.push(
    ApiResponse({
      status: 400,
      schema: {
        type: 'object',
        properties: {
          status: {
            type: 'number',
          },
          message: {
            type: 'string',
          },
          errors: {
            type: 'array',
            items: {
              oneOf: [
                ...(swaggerRequestErrors || []).map((error) => ({
                  $ref: getSchemaPath(error),
                })),
                ...swaggerErrors,
              ],
            },
          },
        },
        example: {
          status: 400,
          errors: [
            {
              type: swaggerErrorExample.type,
              message: swaggerErrorExample.message,
            },
          ],
          message: swaggerErrorExample.message,
        },
      },
    }),
  );

  if ('hasDevApiKey' in options && options.hasDevApiKey) {
    if (options.hasDevApiKey.adminOnly) {
      decorators.push(HasDevApiKeyPermissions([]));
    } else {
      if (!options.hasDevApiKey.otherDevPermissions.length) {
        throw new Error('Please provide dev api key permissions');
      }
      decorators.push(
        HasDevApiKeyPermissions(options.hasDevApiKey.otherDevPermissions),
      );
    }

    decorators.push(DeveloperApiKeyPermissionsGuard());
  }

  if ('hasPermission' in options && options.hasPermission) {
    decorators.push(HasPermission(options.hasPermission));
  }
  if (excludeFromSwagger) {
    decorators.push(ApiExcludeEndpoint());
  }
  const decoratorList = applyDecorators(...decorators);
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiTags(target.constructor.name.replace('Controller', ''))(
      target,
      propertyKey,
      descriptor,
    );
    ApiOperation({
      operationId: propertyKey,
      deprecated,
    })(target, propertyKey, descriptor);
    return decoratorList(target, propertyKey, descriptor);
  };
};

const generateArrayIfNeeded = (
  isArray: boolean,
  value: string | number | boolean,
  count = 2,
):
  | string
  | number
  | boolean
  | string[]
  | number[]
  | boolean[]
  | Record<string, any> => {
  if (!isArray) {
    return value;
  }
  return [...Array(count)].map(() => value) as
    | string
    | number
    | boolean
    | string[]
    | number[]
    | boolean[]
    | Record<string, any>;
};

export const DtoProperty = (
  options: (
    | {
        type: 'String';
        maxLength?: number;
        minLength?: number;
      }
    | {
        type: 'Email';
      }
    | {
        type: 'Integer' | 'Decimal' | 'Number';
        min?: number;
        max?: number;
      }
    | {
        type: 'Regex';
        matches: RegExp;
      }
    | {
        type: 'OneOf';
        possibleValues: any[];
      }
    | {
        type: 'Date';
      }
    | {
        type: 'Boolean';
      }
    | {
        type: 'UUID';
      }
    | { type: 'Enum'; enumType: object }
    | {
        type: 'Object';
        objectType: { new (...args: any): any };
      }
    | {
        type: 'NumberString';
      }
  ) & {
    isNotEmpty?: boolean;
    isArray?: true;
    isOptional?: boolean;
    swaggerSampleValue?:
      | string
      | number
      | boolean
      | string[]
      | number[]
      | boolean[]
      | object;
    errorMessage?: string;
    nullable?: boolean;
  },
) => {
  const {
    isOptional,
    swaggerSampleValue,
    errorMessage,
    type,
    isArray = false,
    isNotEmpty,
    nullable,
  } = options;
  const decorators: PropertyDecorator[] = [];
  let defaultValue:
    | string
    | number
    | boolean
    | string[]
    | number[]
    | boolean[]
    | Record<string, any>
    | undefined;
  if (isNotEmpty) {
    decorators.push(IsNotEmpty());
  }
  let apiType: any;
  switch (type) {
    case 'Email':
      decorators.push(
        IsEmail(undefined, {
          message: errorMessage,
          each: isArray,
          context: {
            appError: new InvalidEmailValidationError(errorMessage),
          },
        }),
      );
      defaultValue = generateArrayIfNeeded(isArray, SAMPLE_EMAIL);
      apiType = String;
      break;
    case 'Integer':
      decorators.push(
        IsInt({
          message: errorMessage,
          each: isArray,
          context: {
            appError: new InvalidIntValidationError(errorMessage),
          },
        }),
        Transform((id) => {
          return id
            ? isNotNullOrUndefined(id.value)
              ? parseInt(id.value)
              : id.value
            : id;
        }),
      );
      if (options.min) {
        decorators.push(
          Min(options.min, {
            context: {
              appError: new MinNumberValidationError(options.min),
            },
          }),
        );
      }
      if (options.max) {
        decorators.push(
          Max(options.max, {
            context: {
              type: new MaxNumberValidationError(options.max),
            },
          }),
        );
      }
      defaultValue = generateArrayIfNeeded(isArray, SAMPLE_INT);
      apiType = Number;
      break;
    case 'Decimal':
      decorators.push(
        IsDecimal(undefined, {
          message: errorMessage,
          each: isArray,
          context: {
            appError: new InvalidDecimalValidationError(errorMessage),
          },
        }),
        Transform((id) => {
          return id
            ? isNotNullOrUndefined(id.value)
              ? parseFloat(id.value)
              : id.value
            : id;
        }),
      );
      if (options.min) {
        decorators.push(
          Min(options.min, {
            context: {
              appError: new MinNumberValidationError(options.min),
            },
          }),
        );
      }
      if (options.max) {
        decorators.push(
          Max(options.max, {
            context: {
              appError: new MaxNumberValidationError(options.max),
            },
          }),
        );
      }
      defaultValue = generateArrayIfNeeded(isArray, SAMPLE_DECIMAL);
      apiType = Number;
      break;
    case 'Number':
      decorators.push(
        IsNumber(
          {
            allowNaN: false,
            allowInfinity: false,
          },
          {
            message: errorMessage,
            each: isArray,
            context: {
              appError: new InvalidNumberValidationError(errorMessage),
            },
          },
        ),
        Transform((id) => {
          return id
            ? isNotNullOrUndefined(id.value)
              ? parseInt(id.value)
              : id.value
            : id;
        }),
      );
      if (options.min) {
        decorators.push(
          Min(options.min, {
            context: {
              appError: new MinNumberValidationError(options.min),
            },
          }),
        );
      }
      if (options.max) {
        decorators.push(
          Max(options.max, {
            context: {
              appError: new MaxNumberValidationError(options.max),
            },
          }),
        );
      }
      defaultValue = generateArrayIfNeeded(isArray, SAMPLE_DECIMAL);
      apiType = Number;
      break;
    case 'NumberString':
      decorators.push(
        IsNumberString(undefined, {
          message: errorMessage,
          each: isArray,
          context: {
            appError: new InvalidNumberValidationError(errorMessage),
          },
        }),
      );
      defaultValue = generateArrayIfNeeded(isArray, SAMPLE_NUMBER_STRING);
      apiType = String;
      break;
    case 'OneOf':
      decorators.push(
        IsIn(options.possibleValues, {
          each: isArray,
          message: errorMessage,
          context: {
            appError: new NotOneOfValuesValidationError(
              options.possibleValues,
              errorMessage,
            ),
          },
        }),
      );
      if (isArray) {
        defaultValue = options.possibleValues;
      } else {
        defaultValue = options.possibleValues[0];
      }
      break;
    case 'Regex':
      decorators.push(
        Matches(options.matches, {
          message: errorMessage,
          each: isArray,
          context: {
            appError: new NotMatchingRegexValidationError(
              options.matches,
              errorMessage,
            ),
          },
        }),
      );
      if (options.matches === REGEX.PASSWORD) {
        defaultValue = generateArrayIfNeeded(isArray, SAMPLE_PASSWORD);
      }
      apiType = String;
      break;
    case 'String':
      decorators.push(
        IsString({
          message: errorMessage,
          each: isArray,
          context: {
            appError: new InvalidStringValidationError(),
          },
        }),
      );
      if (options.maxLength) {
        decorators.push(
          MaxLength(options.maxLength, {
            context: {
              appError: new MaxStringLengthValidationError(options.maxLength),
            },
          }),
        );
      }
      if (options.minLength) {
        decorators.push(
          MinLength(options.minLength, {
            context: {
              appError: new MinStringLengthValidationError(options.minLength),
            },
          }),
        );
      }
      defaultValue = generateArrayIfNeeded(isArray, 'string');
      apiType = String;
      break;
    case 'UUID':
      decorators.push(
        IsUUID(4, {
          message: errorMessage,
          each: isArray,
          context: {
            appError: new InvalidValueValidationError(errorMessage),
          },
        }),
      );
      defaultValue = generateArrayIfNeeded(isArray, SAMPLE_UUID);
      apiType = String;
      break;
    case 'Date':
      decorators.push(
        IsDateString(undefined, {
          message: errorMessage,
          each: isArray,
          context: {
            appError: new InvalidDateValidationError(errorMessage),
          },
        }),
      );
      defaultValue = generateArrayIfNeeded(isArray, new Date().toISOString());
      apiType = Date;
      break;
    case 'Boolean':
      decorators.push(
        IsBoolean({
          message: errorMessage,
          each: isArray,
          context: {
            appError: new InvalidBoolValidationError(),
          },
        }),
      );
      defaultValue = generateArrayIfNeeded(isArray, true);
      apiType = Boolean;
      break;
    case 'Enum':
      decorators.push(
        IsEnum(options.enumType, {
          message: errorMessage,
          each: isArray,
          context: {
            appError: new InvalidEnumValidationError(errorMessage),
          },
        }),
      );
      defaultValue = generateArrayIfNeeded(isArray, true);
      apiType = String;
      break;
    case 'Object':
      decorators.push(
        IsObject({
          message: errorMessage,
          each: isArray,
          context: {
            appError: new InvalidEnumValidationError(errorMessage),
          },
        }),
        Type(() => options.objectType),
        ValidateNested(),
      );
      defaultValue = generateArrayIfNeeded(isArray, true);
      apiType = options.objectType;
      break;
  }
  if (swaggerSampleValue !== undefined) {
    defaultValue = swaggerSampleValue;
  }
  if (isOptional) {
    decorators.push(IsOptional());
    decorators.push(
      ApiPropertyOptional({
        example: defaultValue,
        enum: type === 'OneOf' ? options.possibleValues : undefined,
        type: apiType,
        isArray,
        nullable,
      }),
    );
  } else {
    decorators.push(
      ApiProperty({
        example: defaultValue,
        enum: type === 'OneOf' ? options.possibleValues : undefined,
        type: apiType,
        isArray,
        nullable,
      }),
    );
  }
  return applyDecorators(...decorators);
};

export const ResponseProperty = <T extends string | number | boolean | object>(
  swaggerSampleValue: T | T[],
  options: Omit<ApiPropertyOptions, 'oneOf'> & {
    oneOf?: Constructor<any>[];
  } = {},
) =>
  applyDecorators(
    ApiProperty({
      ...options,
      oneOf:
        'oneOf' in options
          ? options.oneOf?.map((c) => ({
              $ref: getSchemaPath(c),
            }))
          : undefined,
      example: swaggerSampleValue,
    }),
  );

export const OnDomainEvent = (event: DomainEvent) =>
  applyDecorators(OnEvent(event));

export const OnIntegrationEvent = (event: IntegrationEvent) =>
  applyDecorators(
    OnEvent(event, {
      async: true,
      promisify: false,
    }),
  );

export const OnNotifyEvent = (event: NotifyEvent) =>
  applyDecorators(
    OnEvent(event, {
      async: true,
      promisify: false,
    }),
  );
export const IntQuery = (name: string, defaultValue?: number) => {
  if (defaultValue !== undefined) {
    return Query(name, new DefaultValuePipe(defaultValue), ParseIntPipe);
  }
  return Query(name, ParseIntPipe);
};

export const UploadedImage = (maxSizeKb = 5 * 1000) => {
  return UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: /^image\// }),
        new MaxFileSizeValidator({ maxSize: maxSizeKb * 1000 }),
      ],
    }),
  );
};

export const Uploaded3DModel = (maxSizeKb = 50 * 1000) => {
  return UploadedFile(
    new ParseFilePipe({
      validators: [new MaxFileSizeValidator({ maxSize: maxSizeKb * 1000 })],
    }),
  );
};

export const UploadedSizeChart = (maxSizeKb = 50 * 1000) => {
  return UploadedFile(
    new ParseFilePipe({
      validators: [new MaxFileSizeValidator({ maxSize: maxSizeKb * 1000 })],
    }),
  );
};
