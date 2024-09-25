import { MigrationInterface, QueryRunner } from "typeorm";

export class Sample1697927038586 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<any> {
        return new Promise((res, rej) =>  res(true))
    }

    down(queryRunner: QueryRunner): Promise<any> {
        return new Promise((res, rej) =>  res(true))
    }
}