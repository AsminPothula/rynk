import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * rynk domain tables: Client (one onboarded domain, owned by a user) and
 * Run (one Layer 1-3 pipeline execution for a client). status/phase are
 * stored as varchar (the TS enums give type safety in code).
 */
export class ClientAndRun1789700000000 implements MigrationInterface {
  name = 'ClientAndRun1789700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Client" ("id" uuid NOT NULL, "domain" character varying NOT NULL, "name" character varying NOT NULL, "ownerId" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'Onboarding', "context" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_client_domain" UNIQUE ("domain"), CONSTRAINT "PK_client_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_client_ownerId" ON "Client" ("ownerId")`,
    );
    await queryRunner.query(
      `CREATE TABLE "Run" ("id" uuid NOT NULL, "clientId" uuid NOT NULL, "domain" character varying NOT NULL, "phase" character varying NOT NULL DEFAULT 'layer1', "error" text, "startedAt" TIMESTAMP NOT NULL, "completedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_run_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_run_clientId" ON "Run" ("clientId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_run_clientId"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Run"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_client_ownerId"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Client"`);
  }
}
