import { LogService } from '@logger';
import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

@Injectable()
export class DevApiKeyHelper {
  private _logger = new LogService(DevApiKeyHelper.name);

  // Function to generate a random API key
  private generateApiKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Function to create a HMAC identifier using a secret key
  createHmacIdentifier(apiKey: string, secret: string) {
    return crypto.createHmac('sha256', secret).update(apiKey).digest('hex');
  }

  // Function to hash the API key
  private async hashApiKey(apiKey: string) {
    const saltRounds = 10;
    return await bcrypt.hash(apiKey, saltRounds);
  }

  generateHashAndHmac = async ({
    secret,
    apiKey,
  }: {
    secret: string;
    apiKey?: string;
  }) => {
    const myApiKey = apiKey || this.generateApiKey();
    const hmacIdentifier = this.createHmacIdentifier(myApiKey, secret);
    const hashedApiKey = await this.hashApiKey(myApiKey);
    // assignedTo
    return {
      hmacIdentifier,
      hashedApiKey,
      apiKey: myApiKey,
    };
  };

  async compareHash(providedApiKey: string, hashedApikey: string) {
    return await bcrypt.compare(providedApiKey, hashedApikey);
  }

  // Function to save a HMAC identifier and hashed API key to the database
  // saveToDatabase(hmacIdentifier: string, hashedApiKey: string) {
  //   // This is a placeholder. Replace with actual database interaction code.
  //   database.push({ hmacIdentifier, hashedApiKey });
  // }

  // Function to fetch a hashed API key from the database using the HMAC identifier
  // fetchFromDatabase(hmacIdentifier: string) {
  //   // This is a placeholder. Replace with actual database interaction code.
  //   return database.find((entry) => entry.hmacIdentifier === hmacIdentifier);
  // }

  // // Function to verify if a provided API key matches any hashed keys in the database
  // async verifyApiKey(providedApiKey, secret) {
  //   const hmacIdentifier = createHmacIdentifier(providedApiKey, secret);
  //   const record = fetchFromDatabase(hmacIdentifier);
  //   if (record) {
  //     return await bcrypt.compare(providedApiKey, record.hashedApiKey);
  //   }
  //   return false;
  // }
}
