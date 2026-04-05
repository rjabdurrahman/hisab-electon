import { AppDataSource } from "../database/data-source";
import { PathologyTest } from "../database/entities/PathologyTest";
import { PathologyTestInvestigation } from "../database/entities/PathologyTestInvestigation";
import { Investigation } from "../database/entities/Investigation";

export class PathologyService {
  static async getAll() {
    const repository = AppDataSource.getRepository(PathologyTest);
    const tests = await repository.find({
      relations: { patient: true, doctor: true, investigations: true },
      order: { id: "DESC" },
    });
    return JSON.parse(JSON.stringify(tests));
  }

  static async create(data: { date: string; patientId: number; doctorId?: number; discount?: number; testIds: number[] }) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const pathologyTest = new PathologyTest();
      pathologyTest.date = new Date(data.date);
      pathologyTest.patientId = data.patientId;
      if (data.doctorId) pathologyTest.doctorId = data.doctorId;
      if (data.discount !== undefined) pathologyTest.discount = Number(data.discount);

      const savedTest = await queryRunner.manager.save(pathologyTest);

      let totalAmount = 0;
      const testItems: PathologyTestInvestigation[] = [];

      for (const testId of data.testIds) {
        const investigation = await queryRunner.manager.findOneBy(Investigation, { id: testId });
        if (investigation) {
          const item = new PathologyTestInvestigation();
          item.pathologyTest = savedTest;
          item.investigationId = investigation.id;
          item.name = investigation.name;
          item.price = Number(investigation.price);
          testItems.push(item);
          totalAmount += Number(investigation.price);
        }
      }

      await queryRunner.manager.save(testItems);

      savedTest.totalAmount = totalAmount;
      await queryRunner.manager.save(savedTest);

      await queryRunner.commitTransaction();

      return await this.getOne(savedTest.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  static async getOne(id: number) {
    const repository = AppDataSource.getRepository(PathologyTest);
    const test = await repository.findOne({
      where: { id },
      relations: { patient: true, doctor: true, investigations: true },
    });
    return JSON.parse(JSON.stringify(test));
  }

  static async update(payload: { id: number; date?: string; patientId?: number; doctorId?: number; discount?: number; testIds?: number[] }) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repository = queryRunner.manager.getRepository(PathologyTest);
      const test = await repository.findOne({ 
        where: { id: payload.id },
        relations: { investigations: true }
      });

      if (!test) throw new Error("Pathology test not found");

      if (payload.date) test.date = new Date(payload.date);
      if (payload.patientId) test.patientId = payload.patientId;
      if (payload.doctorId !== undefined) test.doctorId = payload.doctorId;
      if (payload.discount !== undefined) test.discount = Number(payload.discount);

      if (payload.testIds) {
        // Remove old relations
        await queryRunner.manager.delete(PathologyTestInvestigation, { pathologyTest: { id: test.id } });

        let totalAmount = 0;
        const testItems: PathologyTestInvestigation[] = [];

        for (const testId of payload.testIds) {
          const investigation = await queryRunner.manager.findOneBy(Investigation, { id: testId });
          if (investigation) {
            const item = new PathologyTestInvestigation();
            item.pathologyTest = test;
            item.investigationId = investigation.id;
            item.name = investigation.name;
            item.price = Number(investigation.price);
            testItems.push(item);
            totalAmount += Number(investigation.price);
          }
        }
        await queryRunner.manager.save(testItems);
        test.totalAmount = totalAmount;
      }

      await queryRunner.manager.save(test);
      await queryRunner.commitTransaction();
      return await this.getOne(test.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  static async delete(id: number) {
    const repository = AppDataSource.getRepository(PathologyTest);
    const result = await repository.delete(id);
    return result.affected! > 0;
  }
}
