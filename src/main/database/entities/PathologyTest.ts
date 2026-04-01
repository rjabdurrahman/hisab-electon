import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Patient } from "./Patient";
import { Doctor } from "./Doctor";
import { PathologyTestInvestigation } from "./PathologyTestInvestigation";

@Entity("pathology_tests")
export class PathologyTest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "datetime" })
  date!: Date;

  @Column({ type: "int", name: "patient_id" })
  patientId!: number;

  @Column({ type: "int", name: "doctor_id", nullable: true })
  doctorId!: number;

  @Column({ type: "int", name: "prepared_by", nullable: true })
  preparedBy!: number;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patient_id" })
  patient!: Patient;

  @ManyToOne(() => Doctor, { nullable: true })
  @JoinColumn({ name: "doctor_id" })
  doctor!: Doctor;

  @Column("decimal", { precision: 10, scale: 2, default: 0.00, name: "total_amount" })
  totalAmount!: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0, name: "discount" })
  discount!: number;

  @OneToMany(() => PathologyTestInvestigation, (pti) => pti.pathologyTest)
  investigations!: PathologyTestInvestigation[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
