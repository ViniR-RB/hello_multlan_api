import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1760538181978 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO "occurrence_types" ("id", "name") VALUES
                ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'manutenção'),
                ('7d5ff48c-d417-4dbb-abb0-ed1b31d1a7a1', 'adicionar Cliente'),
                ('8633a198-cdce-479d-be17-059180f1a92d', 'instalar internet'),
                ('8665bdf3-8ebb-4a7e-b8ad-5d70e1d8922e', 'trocar equipamento'),
                ('fe05c70b-1796-49fb-88be-6aab2d506b40', 'reparo de rede'),
                ('0364dcef-a107-460f-81a8-e397d1042d0b', 'upgrade de plano'),
                ('139471fd-dd59-453a-a2e0-9ba60a3bc10e', 'downgrade de plano'),
                ('8110e289-9232-44a6-a7b9-41c6e570611b', 'cancelamento'),
                ('a6975b8f-87b6-4cf3-8017-b8d9aa59e5c5', 'suporte técnico'),
                ('ef3b824e-dd24-4d9f-933a-c2f1ee34f84f', 'lentidão internet'),
                ('15cdfa70-294a-4483-b5c3-e1e783ba6135', 'sem conexão'),
                ('c002a1d5-51f0-4cad-995e-babb3a6e7287', 'oscilação de sinal'),
                ('73eac05d-3bfa-4bbc-9d65-c0e3b1d916fc', 'troca de endereço'),
                ('db90a796-2412-4453-a450-a19adbf721f4', 'instalação de roteador'),
                ('93972d35-cfe5-42ab-a984-9bd19fc40592', 'configuração de wifi'),
                ('2677a484-42bd-4508-a2de-299769f727e8', 'problema de autenticação'),
                ('5a9f4b26-7b57-4cc6-9e9d-16cb7ff45f46', 'mudança de titularidade'),
                ('225045ae-39c2-4f83-becf-3936ccab46d0', 'corte por inadimplência'),
                ('20451768-9daa-454c-a7b3-a264ec200c8e', 'religação'),
                ('d930d14e-d966-4a3c-9d7b-9086758cc898', 'vistoria técnica'),
                ('df274aa2-3cf2-474b-a70d-6823dd187772', 'instalação de fibra óptica'),
                ('5c266410-7a53-41d8-8820-ca72ca16974b', 'manutenção preventiva'),
                ('274b4b02-a78c-4eef-822d-0c08b2a61a14', 'manutenção corretiva'),
                ('4f93693b-5cce-4370-8630-d8b011733ac5', 'upgrade de velocidade'),
                ('2ed63b16-661e-4270-b496-e2621fddbae9', 'ajuste de sinal'),
                ('ae343f80-0717-45a6-b9b2-fbc7ff3c92b4', 'teste de velocidade'),
                ('4334511c-bd75-49c4-acb9-e2c50eb66889', 'visita comercial'),
                ('3f210531-a882-4e55-bc37-1658821f9e32', 'segunda via de boleto'),
                ('4437ab9c-b144-481e-a9a1-3f471cca228a', 'alteração de vencimento'),
                ('2ef60867-6f8e-4a7b-b21d-a18cb50223a4', 'reclamação')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop occurrence_types table
    await queryRunner.query(`DELETE from "occurrence_types"`);
  }
}
