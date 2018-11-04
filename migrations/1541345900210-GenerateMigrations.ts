import {MigrationInterface, QueryRunner} from "typeorm";

export class GenerateMigrations1541345900210 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `auth_token` (`id` int NOT NULL, `token` varchar(255) NOT NULL, UNIQUE INDEX `IDX_7a74281711d1a581b4dcc4d59f` (`token`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `game` (`id` varchar(255) NOT NULL, `name` varchar(500) NOT NULL, `isActive` tinyint NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_5d1e08e04b97aa06d671cd5840` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user` (`id` varchar(255) NOT NULL, `username` varchar(50) NOT NULL, `password` varchar(100) NULL, `userType` enum ('host', 'player') NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `teamId` varchar(255) NULL, UNIQUE INDEX `IDX_78a916df40e02a9deb1c4b75ed` (`username`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `team` (`id` varchar(255) NOT NULL, `name` varchar(500) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_cf461f5b40cf1a2b8876011e1e` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `score` (`id` varchar(255) NOT NULL, `name` varchar(500) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `teamId` varchar(255) NULL, `gameId` varchar(255) NULL, UNIQUE INDEX `IDX_44454fa745435510f0eb1fd004` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_1e89f1fd137dc7fea7242377e25` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`)");
        await queryRunner.query("ALTER TABLE `score` ADD CONSTRAINT `FK_3f446d741687acc589389ba1711` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`)");
        await queryRunner.query("ALTER TABLE `score` ADD CONSTRAINT `FK_0778913dcc5349f3bcb0ebeab8c` FOREIGN KEY (`gameId`) REFERENCES `game`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `score` DROP FOREIGN KEY `FK_0778913dcc5349f3bcb0ebeab8c`");
        await queryRunner.query("ALTER TABLE `score` DROP FOREIGN KEY `FK_3f446d741687acc589389ba1711`");
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_1e89f1fd137dc7fea7242377e25`");
        await queryRunner.query("DROP INDEX `IDX_44454fa745435510f0eb1fd004` ON `score`");
        await queryRunner.query("DROP TABLE `score`");
        await queryRunner.query("DROP INDEX `IDX_cf461f5b40cf1a2b8876011e1e` ON `team`");
        await queryRunner.query("DROP TABLE `team`");
        await queryRunner.query("DROP INDEX `IDX_78a916df40e02a9deb1c4b75ed` ON `user`");
        await queryRunner.query("DROP TABLE `user`");
        await queryRunner.query("DROP INDEX `IDX_5d1e08e04b97aa06d671cd5840` ON `game`");
        await queryRunner.query("DROP TABLE `game`");
        await queryRunner.query("DROP INDEX `IDX_7a74281711d1a581b4dcc4d59f` ON `auth_token`");
        await queryRunner.query("DROP TABLE `auth_token`");
    }

}
