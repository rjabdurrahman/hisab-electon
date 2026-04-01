import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other"
}

@Entity("patients")
export class Patient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 255 })
  name!: string;

  @Column("int", { nullable: true })
  age!: number;

  @Column({ type: "simple-enum", enum: Gender, nullable: true })
  gender!: Gender;

  @Column("varchar", { length: 20, unique: true, nullable: true })
  phone!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
