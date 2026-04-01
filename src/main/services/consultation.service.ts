import { AppDataSource } from "../database/data-source";
import { Consultation } from "../database/entities/Consultation";

export class ConsultationService {
  static async getAll() {
    const repository = AppDataSource.getRepository(Consultation);
    const result = await repository.find({
      relations: { patient: true, doctor: true },
      order: { date: "DESC", id: "DESC" },
    });
    return JSON.parse(JSON.stringify(result));
  }

  static async create(data: { date: string; patientId: number; doctorId: number; consultationFee?: number; notes?: string }) {
    const repository = AppDataSource.getRepository(Consultation);
    const consultation = repository.create({
      ...data,
      date: new Date(data.date)
    });
    const saved = await repository.save(consultation);
    return await this.getOne(saved.id);
  }

  static async getOne(id: number) {
    const repository = AppDataSource.getRepository(Consultation);
    const result = await repository.findOne({
      where: { id },
      relations: { patient: true, doctor: true },
    });
    return JSON.parse(JSON.stringify(result));
  }

  static async update(id: number, data: Partial<Consultation>) {
    const repository = AppDataSource.getRepository(Consultation);
    if (data.date) data.date = new Date(data.date);
    await repository.update(id, data);
    return await this.getOne(id);
  }

  static async delete(id: number) {
    const repository = AppDataSource.getRepository(Consultation);
    const result = await repository.delete(id);
    return result.affected! > 0;
  }
}
