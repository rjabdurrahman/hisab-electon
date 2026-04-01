import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("doctors")
export class Doctor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 255 })
  name!: string;

  @Column("varchar", { length: 255, nullable: true })
  specialization!: string;

  @Column("varchar", { length: 20, nullable: true })
  phone!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  consultationFee!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
