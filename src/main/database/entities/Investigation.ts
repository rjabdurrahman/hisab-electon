import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("investigations")
export class Investigation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 255 })
  name!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column("varchar", { length: 100, nullable: true })
  category!: string;

  @Column("boolean", { default: true, name: "is_active" })
  isActive!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
