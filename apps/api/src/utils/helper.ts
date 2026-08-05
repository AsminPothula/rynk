import { ServiceError } from '@error';
import {
  AdminPermissions,
  DeveloperPermissions,
  SystemPermissions,
  UserPermission,
  UserProfileRole,
  UserProfileRoleType,
} from '@types';
import { customAlphabet } from 'nanoid';

import crypto from 'crypto';

type rejectType = (reason?: any) => void;
export const reasonRejecter = (reject: rejectType) => (reason: string) =>
  reject(Error(reason));

export const guardEmpty = <T>(value: T | null | undefined): T => {
  if (value === null || value === undefined) {
    throw new ServiceError(
      'Application',
      new Error('Unexpected empty value found.'),
    );
  }
  return value;
};

export const formatAmount = (amount: number) => {
  return Number((Math.round(Number(amount) * 100) / 100).toFixed(2));
};

export const convertStringIntoObject = (data: string) => {
  const resultObj: any = {};
  data.split('&').forEach((item) => {
    const [key, value] = item.split('=');
    resultObj[key] = value;
  });
  return resultObj;
};

export const generateRandomAlphaNumericString = (length = 16) => {
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', length);
  return nanoid();
};

export const isValidPhoneNumber = (phone: string) => {
  if (!phone.trim()) return false;
  const phoneNumberPattern = /^(\+\d{1,2}\s?)?\d{10,11}$/;
  return phoneNumberPattern.test(phone);
};

export const transformToArrayOrValue = <T>(value?: T | T[]) => {
  const resultArray = [];
  if (value === undefined) {
    return value;
  }
  if (!(value instanceof Array)) {
    resultArray.push(value);
  } else {
    resultArray.push(...value);
  }
  return resultArray;
};

export const transformToArray = <T>(value?: T | T[]) => {
  const resultArray = [];
  if (value === undefined) {
    return [];
  }
  if (!(value instanceof Array)) {
    resultArray.push(value);
  } else {
    resultArray.push(...value);
  }
  return resultArray;
};

export const getNewAndDeletedIds = ({
  existingIds,
  uploadingIds,
}: {
  existingIds: string[];
  uploadingIds: string[];
}): { newIds: string[]; deletedIds: string[] } => {
  const uploadingIdsSet = new Set(uploadingIds);
  const deletedIds = existingIds.filter((id) => !uploadingIdsSet.has(id));
  return {
    newIds: uploadingIds.filter((id) => !existingIds.includes(id)),
    deletedIds,
  };
};

export const getNameId = (name: string) => {
  const nameId = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return nameId;
};

// Function to generate a random string for PKCE code verifier
export const generateCodeVerifier = () => {
  return base64URLEncode(crypto.randomUUID());
};

// Function to generate PKCE code challenge from code verifier
export const generateCodeChallenge = (codeVerifier: string) => {
  const hashedVerifier = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64');
  return hashedVerifier
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

export const generateCodeChallengeVerifier = () => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  return { codeVerifier, codeChallenge };
};

// Function to URL-encode base64 string
export const base64URLEncode = (str: string) => {
  return str
    .toString()
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

export const getRolePermissions = (role: UserProfileRoleType) => {
  switch (role) {
    case UserProfileRole.Admin:
      return AdminPermissions;
    case UserProfileRole.Developer:
      return DeveloperPermissions;
    case UserProfileRole.SystemAdmin:
      return SystemPermissions;
    default:
      return [];
  }
};
export const getUserPermissions = (roles: UserProfileRoleType[]) => {
  const userPermissions = new Set<UserPermission>();
  roles.forEach((role) => {
    const permissions = getRolePermissions(role);
    permissions.forEach((permission) => {
      userPermissions.add(permission);
    });
  });
  return Array.from(userPermissions);
};

/**
 * A rynk admin (Admin or SystemAdmin) sees and manages every client; a Client
 * role only ever sees the companies it owns. Used to bypass ownership scoping.
 */
export const isRynkAdmin = (roles: UserProfileRoleType[]): boolean =>
  roles.some((r) => r === UserProfileRole.Admin || r === UserProfileRole.SystemAdmin);

export const haveSameElements = <T>(array1: T[], array2: T[]) => {
  if (array1.length !== array2.length) {
    return false;
  }

  // Sort both arrays
  const sortedArray1 = [...array1].sort();
  const sortedArray2 = [...array2].sort();

  // Check if all elements are the same
  for (let i = 0; i < sortedArray1.length; i++) {
    if (sortedArray1[i] !== sortedArray2[i]) {
      return false;
    }
  }

  return true;
};

export const formNameId = (input: string, separator = '_'): string => {
  // Convert the string to lowercase

  let result = input.trim().toLowerCase();

  // Remove special characters except for spaces
  result = result.replace(/[^a-z0-9\s]/g, '');

  // Replace spaces with separator
  if (separator) {
    result = result.replace(/ /g, separator);
  }

  return result;
};

export const toCamelCase = (s: string) => {
  const words = s.split(' ');
  if (words.length === 0) {
    return s;
  }
  // Convert the first word to lowercase, and capitalize the subsequent words
  const camelCase =
    words[0].toLowerCase() +
    words
      .slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  return camelCase;
};

export const getNextOffset = (
  limit: number,
  offset: number,
  totalCount: number,
) => {
  const nextOffset = offset + limit;
  // Ensure nextOffset does not exceed totalCount
  return nextOffset > totalCount ? totalCount : nextOffset;
};

export const isBooleanValue = (value: any): boolean =>
  typeof value === 'boolean';

export const isNotNullOrUndefined = <T>(
  value: T | null | undefined,
): value is T => {
  return value !== null && value !== undefined;
};

export const encryptValue = <T>(value: T, key: string): string => {
  const algorithm = 'aes-256-cbc';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(key, 'base64'),
    iv,
  );

  const stringValue = JSON.stringify(value);
  let encrypted = cipher.update(stringValue, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return iv.toString('base64') + ':' + encrypted;
};

export const decryptValue = <T>(encryptedValue: string, key: string): T => {
  const algorithm = 'aes-256-cbc';
  const [ivString, encryptedData] = encryptedValue.split(':');

  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key, 'base64'),
    Buffer.from(ivString, 'base64'),
  );

  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted) as T;
};
