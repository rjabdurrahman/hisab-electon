import { AppDataSource } from "../database/data-source";
import { Investigation } from "../database/entities/Investigation";

export class InvestigationService {
  static async getAll() {
    const repository = AppDataSource.getRepository(Investigation);
    const investigations = await repository.find({ order: { name: "ASC" } });
    return JSON.parse(JSON.stringify(investigations));
  }

  static async create(data: Partial<Investigation>) {
    const repository = AppDataSource.getRepository(Investigation);
    const investigation = repository.create(data);
    const saved = await repository.save(investigation);
    return JSON.parse(JSON.stringify(saved));
  }

  static async update(id: number, data: Partial<Investigation>) {
    const repository = AppDataSource.getRepository(Investigation);
    await repository.update(id, data);
    const updated = await repository.findOneBy({ id });
    return JSON.parse(JSON.stringify(updated));
  }

  static async delete(id: number) {
    const repository = AppDataSource.getRepository(Investigation);
    const result = await repository.delete(id);
    return result.affected! > 0;
  }
}
