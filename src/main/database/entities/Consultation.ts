import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Patient } from "./Patient";
import { Doctor } from "./Doctor";

@Entity("consultations")
export class Consultation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "datetime" })
  date!: Date;

  @Column({ type: "int", name: "patient_id" })
  patientId!: number;

  @Column({ type: "int", name: "doctor_id" })
  doctorId!: number;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patient_id" })
  patient!: Patient;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: "doctor_id" })
  doctor!: Doctor;

  @Column("decimal", { precision: 10, scale: 2, name: "consultation_fee", nullable: true })
  consultationFee!: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0, name: "discount" })
  discount!: number;

  @Column("text", { nullable: true })
  notes!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
