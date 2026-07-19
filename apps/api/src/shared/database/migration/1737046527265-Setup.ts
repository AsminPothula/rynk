import { MigrationInterface, QueryRunner } from 'typeorm';

export class Setup1737046527265 implements MigrationInterface {
  name = 'Setup1737046527265';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."UserProfileRole" AS ENUM('admin', 'developer', 'systemadmin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "UserRole" ("id" uuid NOT NULL, "userId" uuid NOT NULL, "role" "public"."UserProfileRole" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_a75d332aa5140fe0882a1b4ff49" UNIQUE ("userId", "role"), CONSTRAINT "PK_83fd6b024a41173978f5b2b9b79" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."SignUpMode" AS ENUM('guest')`,
    );
    await queryRunner.query(
      `CREATE TABLE "User" ("id" uuid NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "status" character varying NOT NULL, "statusChangedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deactivatedAt" TIMESTAMP, "isEmailVerified" boolean NOT NULL DEFAULT true, "verificationEmailLastSent" TIMESTAMP, "signUpMode" "public"."SignUpMode" NOT NULL DEFAULT 'guest', "isGuest" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Auth" ("id" uuid NOT NULL, "password" character varying, "passwordChangedAt" TIMESTAMP, "oldPasswords" text, "deactivatedAt" TIMESTAMP, "passwordToken" character varying, "passwordTokenIssuedAt" TIMESTAMP, "userId" uuid NOT NULL, CONSTRAINT "UQ_fee4a2ee6693dbef79c39ff336d" UNIQUE ("id"), CONSTRAINT "REL_10b96a5538c04c5c9a93f33b96" UNIQUE ("userId"), CONSTRAINT "PK_fee4a2ee6693dbef79c39ff336d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "CronJobLock" ("id" uuid NOT NULL, "key" character varying NOT NULL, "locked" boolean NOT NULL, CONSTRAINT "UQ_709ab001a0794c5a5c0dbe545fe" UNIQUE ("key"), CONSTRAINT "PK_a068fb6e15df4580ddf56fc5e92" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "CronJob" ("id" uuid NOT NULL, "key" character varying NOT NULL, "executor" character varying NOT NULL, "startedAt" TIMESTAMP NOT NULL, "completedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_41cf4e6fbe3a149b574c995e8e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."DevApiKeyPermissions" AS ENUM('USV', 'MTD')`,
    );
    await queryRunner.query(
      `CREATE TABLE "DevApiKey" ("id" uuid NOT NULL, "hashedApiKey" character varying NOT NULL, "hmacId" character varying NOT NULL, "assignedTo" character varying NOT NULL, "permissions" "public"."DevApiKeyPermissions" array NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_070709649db015a868d1e5f0a5e" UNIQUE ("hmacId"), CONSTRAINT "PK_e38c03d901207d13b14be3d6876" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f9215d9c52beb899d1ed4d8ae4" ON "DevApiKey" ("assignedTo") `,
    );
    await queryRunner.query(
      `CREATE TABLE "MultiMediaMetadata" ("id" uuid NOT NULL, "creatorId" character varying, "mimeType" character varying NOT NULL, "fileType" character varying NOT NULL, "extension" character varying NOT NULL, "filename" character varying NOT NULL, "fileSize" integer NOT NULL, "encoding" character varying NOT NULL, "s3Key" character varying NOT NULL, "s3Url" character varying NOT NULL, "whRatio" double precision, "versionId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_642253bab8ca62f78daf44a3f69" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."SystemVariableType" AS ENUM('regional_director_email')`,
    );
    await queryRunner.query(
      `CREATE TABLE "SystemVariable" ("id" uuid NOT NULL, "name" "public"."SystemVariableType" NOT NULL, "value" character varying NOT NULL, CONSTRAINT "UQ_cfbb7127844ff1885522d880b82" UNIQUE ("id", "name"), CONSTRAINT "PK_bd3eeb6b60e26ab8d01fe0e8724" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserRole" ADD CONSTRAINT "FK_c09e6f704c7cd9fe2bbc26a1a38" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Auth" ADD CONSTRAINT "FK_10b96a5538c04c5c9a93f33b960" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Auth" DROP CONSTRAINT "FK_10b96a5538c04c5c9a93f33b960"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserRole" DROP CONSTRAINT "FK_c09e6f704c7cd9fe2bbc26a1a38"`,
    );
    await queryRunner.query(`DROP TABLE "SystemVariable"`);
    await queryRunner.query(`DROP TYPE "public"."SystemVariableType"`);
    await queryRunner.query(`DROP TABLE "MultiMediaMetadata"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f9215d9c52beb899d1ed4d8ae4"`,
    );
    await queryRunner.query(`DROP TABLE "DevApiKey"`);
    await queryRunner.query(`DROP TYPE "public"."DevApiKeyPermissions"`);
    await queryRunner.query(`DROP TABLE "CronJob"`);
    await queryRunner.query(`DROP TABLE "CronJobLock"`);
    await queryRunner.query(`DROP TABLE "Auth"`);
    await queryRunner.query(`DROP TABLE "User"`);
    await queryRunner.query(`DROP TYPE "public"."SignUpMode"`);
    await queryRunner.query(`DROP TABLE "UserRole"`);
    await queryRunner.query(`DROP TYPE "public"."UserProfileRole"`);
  }
}
