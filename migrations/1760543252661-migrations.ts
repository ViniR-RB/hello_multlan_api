import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1760543252661 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Inserir configurações iniciais na tabela configs
    await queryRunner.query(`
            INSERT INTO "configs" ("id", "key", "value", "createdAt", "updatedAt") 
            VALUES 
                ('c1d2e3f4-a5b6-4c7d-8e9f-0a1b2c3d4e5f', 'occurrence_type_schedule_id', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', now(), now()),
                ('d2e3f4a5-b6c7-4d8e-9f0a-1b2c3d4e5f6a', 'frequence_change_zone_box', 10, now(), now())
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM "configs" 
            WHERE "key" IN ('occurrence_type_schedule_id', 'frequence_change_zone_box')
        `);
  }
}
