import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("investigation_categories")
export class InvestigationCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 255 })
  name!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
