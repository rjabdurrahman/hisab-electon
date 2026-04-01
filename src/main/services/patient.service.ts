import { AppDataSource } from "../database/data-source";
import { Patient } from "../database/entities/Patient";

export class PatientService {
  static async getAll() {
    const repository = AppDataSource.getRepository(Patient);
    const patients = await repository.find({ order: { id: "DESC" } });
    return JSON.parse(JSON.stringify(patients));
  }

  static async create(data: Partial<Patient>) {
    const repository = AppDataSource.getRepository(Patient);
    const patient = repository.create(data);
    const saved = await repository.save(patient);
    return JSON.parse(JSON.stringify(saved));
  }

  static async update(id: number, data: Partial<Patient>) {
    const repository = AppDataSource.getRepository(Patient);
    await repository.update(id, data);
    const updated = await repository.findOneBy({ id });
    return JSON.parse(JSON.stringify(updated));
  }

  static async delete(id: number) {
    const repository = AppDataSource.getRepository(Patient);
    const result = await repository.delete(id);
    return result.affected! > 0;
  }
}
