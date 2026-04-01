import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { PathologyTest } from "./PathologyTest";
import { Investigation } from "./Investigation";

@Entity("pathology_test_investigations")
export class PathologyTestInvestigation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("int", { name: "pathology_test_id" })
  pathologyTestId!: number;

  @Column("int", { name: "investigation_id" })
  investigationId!: number;

  @ManyToOne(() => PathologyTest, (pt) => pt.investigations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "pathology_test_id" })
  pathologyTest!: PathologyTest;

  @ManyToOne(() => Investigation, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: "investigation_id" })
  investigation!: Investigation;

  @Column("varchar", { length: 255 })
  name!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;
}
