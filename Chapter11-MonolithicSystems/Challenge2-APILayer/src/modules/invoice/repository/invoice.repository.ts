import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceItem from "../domain/invoice_item.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceModel } from "./invoice.model";
import { InvoiceItemModel } from "./invoice_item.model";

export default class InvoiceRepository implements InvoiceGateway {
  async save(invoice: Invoice): Promise<void> {
    await InvoiceModel.create({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipcode: invoice.address.zipCode,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt
    })

    try {
      await InvoiceItemModel.bulkCreate(invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        invoiceId: invoice.id.id
      })));
    } catch (error) {
      console.log(error);
    }
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({ where: { id } });

    if (!invoice) {
      throw new Error("Invoice not found")
    }

    const items = await InvoiceItemModel.findAll({ where: { invoiceId: id } });

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address(
        invoice.street,
        invoice.number,
        invoice.complement,
        invoice.city,
        invoice.state,
        invoice.zipcode,
      ),
      createdAt: invoice.createdAt,
      updatedAt: invoice.createdAt,
      items: items.map(item => new InvoiceItem({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
        createdAt: invoice.createdAt,
        updatedAt: invoice.createdAt
      }))
    })
  }
}