import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categories" ADD COLUMN "key" varchar NOT NULL;
  ALTER TABLE "tags" ADD COLUMN "key" varchar NOT NULL;
  CREATE UNIQUE INDEX "categories_key_idx" ON "categories" USING btree ("key");
  CREATE UNIQUE INDEX "tags_key_idx" ON "tags" USING btree ("key");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "categories_key_idx";
  DROP INDEX "tags_key_idx";
  ALTER TABLE "categories" DROP COLUMN "key";
  ALTER TABLE "tags" DROP COLUMN "key";`)
}
