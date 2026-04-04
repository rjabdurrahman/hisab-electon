import { AppDataSource } from "../database/data-source";
import { InvestigationCategory } from "../database/entities/InvestigationCategory";

export class InvestigationCategoryService {
  static async getAll() {
    const repository = AppDataSource.getRepository(InvestigationCategory);
    const categories = await repository.find({ order: { name: "ASC" } });
    return JSON.parse(JSON.stringify(categories));
  }

  static async create(data: Partial<InvestigationCategory>) {
    const repository = AppDataSource.getRepository(InvestigationCategory);
    const category = repository.create(data);
    const saved = await repository.save(category);
    return JSON.parse(JSON.stringify(saved));
  }

  static async update(id: number, data: Partial<InvestigationCategory>) {
    const repository = AppDataSource.getRepository(InvestigationCategory);
    await repository.update(id, data);
    const updated = await repository.findOneBy({ id });
    return JSON.parse(JSON.stringify(updated));
  }

  static async delete(id: number) {
    const repository = AppDataSource.getRepository(InvestigationCategory);
    const result = await repository.delete(id);
    return result.affected! > 0;
  }
}
