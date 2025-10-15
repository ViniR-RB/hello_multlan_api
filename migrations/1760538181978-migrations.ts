import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1760538181978 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO "occurrence_types" ("id", "name") VALUES
                ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'manutenção'),
                ('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'adicionar Cliente'),
                ('c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'instalar internet'),
                ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'trocar equipamento'),
                ('e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'reparo de rede'),
                ('f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'upgrade de plano'),
                ('a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'downgrade de plano'),
                ('b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'cancelamento'),
                ('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'suporte técnico'),
                ('d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'lentidão internet'),
                ('e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'sem conexão'),
                ('f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c', 'oscilação de sinal'),
                ('a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d', 'troca de endereço'),
                ('b4c5d6e7-f8a9-4b0c-1d2e-3f4a5b6c7d8e', 'instalação de roteador'),
                ('c5d6e7f8-a9b0-4c1d-2e3f-4a5b6c7d8e9f', 'configuração de wifi'),
                ('d6e7f8a9-b0c1-4d2e-3f4a-5b6c7d8e9f0a', 'problema de autenticação'),
                ('e7f8a9b0-c1d2-4e3f-4a5b-6c7d8e9f0a1b', 'mudança de titularidade'),
                ('f8a9b0c1-d2e3-4f4a-5b6c-7d8e9f0a1b2c', 'corte por inadimplência'),
                ('a9b0c1d2-e3f4-4a5b-6c7d-8e9f0a1b2c3d', 'religação'),
                ('b0c1d2e3-f4a5-4b6c-7d8e-9f0a1b2c3d4e', 'vistoria técnica'),
                ('c1d2e3f4-a5b6-4c7d-8e9f-0a1b2c3d4e5f', 'instalação de fibra óptica'),
                ('d2e3f4a5-b6c7-4d8e-9f0a-1b2c3d4e5f6a', 'manutenção preventiva'),
                ('e3f4a5b6-c7d8-4e9f-0a1b-2c3d4e5f6a7b', 'manutenção corretiva'),
                ('f4a5b6c7-d8e9-4f0a-1b2c-3d4e5f6a7b8c', 'upgrade de velocidade'),
                ('a5b6c7d8-e9f0-4a1b-2c3d-4e5f6a7b8c9d', 'ajuste de sinal'),
                ('b6c7d8e9-f0a1-4b2c-3d4e-5f6a7b8c9d0e', 'teste de velocidade'),
                ('c7d8e9f0-a1b2-4c3d-4e5f-6a7b8c9d0e1f', 'visita comercial'),
                ('d8e9f0a1-b2c3-4d4e-5f6a-7b8c9d0e1f2a', 'segunda via de boleto'),
                ('e9f0a1b2-c3d4-4e5f-6a7b-8c9d0e1f2a3b', 'alteração de vencimento'),
                ('f0a1b2c3-d4e5-4f6a-7b8c-9d0e1f2a3b4c', 'reclamação')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop occurrence_types table
    await queryRunner.query(`DELETE from "occurrence_types"`);
  }
}
