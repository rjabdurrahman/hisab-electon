import { AppDataSource } from "../database/data-source";
import { Doctor } from "../database/entities/Doctor";

export class DoctorService {
  static async getAll() {
    const repository = AppDataSource.getRepository(Doctor);
    const doctors = await repository.find({ order: { name: "ASC" } });
    return JSON.parse(JSON.stringify(doctors));
  }

  static async create(data: Partial<Doctor>) {
    const repository = AppDataSource.getRepository(Doctor);
    const doctor = repository.create(data);
    const saved = await repository.save(doctor);
    return JSON.parse(JSON.stringify(saved));
  }

  static async update(id: number, data: Partial<Doctor>) {
    const repository = AppDataSource.getRepository(Doctor);
    await repository.update(id, data);
    const updated = await repository.findOneBy({ id });
    return JSON.parse(JSON.stringify(updated));
  }

  static async delete(id: number) {
    const repository = AppDataSource.getRepository(Doctor);
    const result = await repository.delete(id);
    return result.affected! > 0;
  }
}
