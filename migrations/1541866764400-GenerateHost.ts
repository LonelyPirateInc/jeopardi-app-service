import {MigrationInterface, QueryRunner} from "typeorm";

export class GenerateHost1541866764400 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("INSERT INTO `user` (username, password, userType, id) VALUES ('al.lounsbury', 'ciena2018', 'host', MID(UUID(),1,36))");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
