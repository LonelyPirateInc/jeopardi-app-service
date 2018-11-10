import {MigrationInterface, QueryRunner} from "typeorm";

export class GenerateHost1541866764400 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("INSERT INTO `user` (username, password, userType) VALUES ('anton', 'a', 'host')");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
