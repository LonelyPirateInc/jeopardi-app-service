import {MigrationInterface, QueryRunner} from "typeorm";

export class GenerateMigrations1541303641636 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `auth_token` (`id` int NOT NULL, `token` varchar(255) NOT NULL, UNIQUE INDEX `IDX_7a74281711d1a581b4dcc4d59f` (`token`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user` (`id` varchar(255) NOT NULL, `username` varchar(50) NOT NULL, `password` varchar(100) NULL, `userType` enum ('host', 'player') NOT NULL, `teamId` varchar(255) NULL, UNIQUE INDEX `IDX_78a916df40e02a9deb1c4b75ed` (`username`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `team` (`id` varchar(255) NOT NULL, `name` varchar(500) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_1e89f1fd137dc7fea7242377e25` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_1e89f1fd137dc7fea7242377e25`");
        await queryRunner.query("DROP TABLE `team`");
        await queryRunner.query("DROP INDEX `IDX_78a916df40e02a9deb1c4b75ed` ON `user`");
        await queryRunner.query("DROP TABLE `user`");
        await queryRunner.query("DROP INDEX `IDX_7a74281711d1a581b4dcc4d59f` ON `auth_token`");
        await queryRunner.query("DROP TABLE `auth_token`");
    }

}
