import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import Invoice from "../domain/invoice.entity";

@Table({
  tableName: 'invoice_item',
  timestamps: false
})
export class InvoiceItemModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  price: number;
  
  @Column({ allowNull: false })
  createdAt: Date;
  
  @Column({ allowNull: false })
  updatedAt: Date;

  @ForeignKey(() => InvoiceItemModel)
  @Column
  invoiceId: string;

  @BelongsTo(() => InvoiceItemModel)
  invoice: Invoice;
}