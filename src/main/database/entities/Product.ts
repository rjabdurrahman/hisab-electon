import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import type { Category } from "./Category";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  name!: string;

  @Column("float")
  price!: number;

  @Column("int", { default: 0 })
  stock!: number;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @ManyToOne("Category", (category: any) => category.products)
  category!: Category;
}
