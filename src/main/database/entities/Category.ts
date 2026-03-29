import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import type { Product } from "./Product";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  name!: string;

  @Column("text", { nullable: true })
  description!: string;

  @OneToMany("Product", (product: any) => product.category)
  products!: Product[];
}
