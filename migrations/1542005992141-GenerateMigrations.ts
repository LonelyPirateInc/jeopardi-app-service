import {MigrationInterface, QueryRunner} from "typeorm";

export class GenerateMigrations1542005992141 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `category` (`id` int NOT NULL AUTO_INCREMENT, `categoryText` varchar(255) NOT NULL, `isAllIn` tinyint NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_be372bd61202b74f6339e10407` (`categoryText`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `game` (`id` varchar(255) NOT NULL, `name` varchar(500) NOT NULL, `isActive` tinyint NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `question` (`id` varchar(255) NOT NULL, `questionText` varchar(500) NOT NULL, `musicName` varchar(500) NOT NULL, `musicNamePath` varchar(500) NOT NULL, `difficulty` int NOT NULL, `isActive` tinyint NOT NULL, `isCurrent` tinyint NOT NULL DEFAULT FALSE, `isAnswersShown` tinyint NOT NULL DEFAULT FALSE, `isPlayMusicOn` tinyint NOT NULL DEFAULT FALSE, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `category_id` int NULL, `game_id` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `answer` (`id` varchar(255) NOT NULL, `answerText` varchar(500) NULL, `point` int NOT NULL, `answerIndex` int NOT NULL, `isCorrect` tinyint NOT NULL DEFAULT 0, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `questionId` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `auth_token` (`id` int NOT NULL, `token` varchar(255) NOT NULL, UNIQUE INDEX `IDX_7a74281711d1a581b4dcc4d59f` (`token`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user` (`id` varchar(255) NOT NULL, `username` varchar(50) NOT NULL, `password` varchar(100) NULL, `userType` enum ('host', 'player') NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `teamId` varchar(255) NULL, UNIQUE INDEX `IDX_78a916df40e02a9deb1c4b75ed` (`username`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `team` (`id` varchar(255) NOT NULL, `name` varchar(500) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_cf461f5b40cf1a2b8876011e1e` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `score` (`id` varchar(255) NOT NULL, `point` int NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `teamId` varchar(255) NULL, `gameId` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `question` ADD CONSTRAINT `FK_5fd605f755be75e9ea3ee3fdc18` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`)");
        await queryRunner.query("ALTER TABLE `question` ADD CONSTRAINT `FK_25f114c3544f685da66b637bdcf` FOREIGN KEY (`game_id`) REFERENCES `game`(`id`)");
        await queryRunner.query("ALTER TABLE `answer` ADD CONSTRAINT `FK_a4013f10cd6924793fbd5f0d637` FOREIGN KEY (`questionId`) REFERENCES `question`(`id`)");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_1e89f1fd137dc7fea7242377e25` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`)");
        await queryRunner.query("ALTER TABLE `score` ADD CONSTRAINT `FK_3f446d741687acc589389ba1711` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`)");
        await queryRunner.query("ALTER TABLE `score` ADD CONSTRAINT `FK_0778913dcc5349f3bcb0ebeab8c` FOREIGN KEY (`gameId`) REFERENCES `game`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `score` DROP FOREIGN KEY `FK_0778913dcc5349f3bcb0ebeab8c`");
        await queryRunner.query("ALTER TABLE `score` DROP FOREIGN KEY `FK_3f446d741687acc589389ba1711`");
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_1e89f1fd137dc7fea7242377e25`");
        await queryRunner.query("ALTER TABLE `answer` DROP FOREIGN KEY `FK_a4013f10cd6924793fbd5f0d637`");
        await queryRunner.query("ALTER TABLE `question` DROP FOREIGN KEY `FK_25f114c3544f685da66b637bdcf`");
        await queryRunner.query("ALTER TABLE `question` DROP FOREIGN KEY `FK_5fd605f755be75e9ea3ee3fdc18`");
        await queryRunner.query("DROP TABLE `score`");
        await queryRunner.query("DROP INDEX `IDX_cf461f5b40cf1a2b8876011e1e` ON `team`");
        await queryRunner.query("DROP TABLE `team`");
        await queryRunner.query("DROP INDEX `IDX_78a916df40e02a9deb1c4b75ed` ON `user`");
        await queryRunner.query("DROP TABLE `user`");
        await queryRunner.query("DROP INDEX `IDX_7a74281711d1a581b4dcc4d59f` ON `auth_token`");
        await queryRunner.query("DROP TABLE `auth_token`");
        await queryRunner.query("DROP TABLE `answer`");
        await queryRunner.query("DROP TABLE `question`");
        await queryRunner.query("DROP TABLE `game`");
        await queryRunner.query("DROP INDEX `IDX_be372bd61202b74f6339e10407` ON `category`");
        await queryRunner.query("DROP TABLE `category`");
    }

}
