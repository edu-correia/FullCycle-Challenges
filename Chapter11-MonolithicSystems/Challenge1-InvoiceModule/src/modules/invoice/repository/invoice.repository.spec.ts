import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "./invoice.model"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"
import Invoice from "../domain/invoice.entity"
import InvoiceItem from "../domain/invoice_item.entity"
import { InvoiceItemModel } from "./invoice_item.model"
import InvoiceRepository from "./invoice.repository"

describe("Invoice Repository test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([InvoiceItemModel, InvoiceModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should create an invoice", async () => {
    const items: InvoiceItem[] = [
      new InvoiceItem({ id: new Id("1"), name: "Item 1", price: 12.95 }),
      new InvoiceItem({ id: new Id("2"), name: "Item 2", price: 20.30 })
    ]

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "1234-5678",
      items,
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      )
    })

    const repository = new InvoiceRepository()
    await repository.save(invoice);

    const clientDb = await InvoiceModel.findOne({ where: { id: "1" } })

    expect(clientDb).toBeDefined()
    expect(clientDb.id).toEqual(invoice.id.id)
    expect(clientDb.name).toEqual(invoice.name)
    expect(clientDb.document).toEqual(invoice.document)
    expect(clientDb.street).toEqual(invoice.address.street)
    expect(clientDb.number).toEqual(invoice.address.number)
    expect(clientDb.complement).toEqual(invoice.address.complement)
    expect(clientDb.city).toEqual(invoice.address.city)
    expect(clientDb.state).toEqual(invoice.address.state)
    expect(clientDb.zipcode).toEqual(invoice.address.zipCode)
    expect(clientDb.createdAt).toStrictEqual(invoice.createdAt)
    expect(clientDb.updatedAt).toStrictEqual(invoice.updatedAt)

    const itemsDb = await InvoiceItemModel.findAll({ where: { invoiceId: invoice.id.id } });

    expect(itemsDb).toBeDefined()
    expect(itemsDb.length).toEqual(2)
    expect(itemsDb[0].id).toEqual(items[0].id.id)
    expect(itemsDb[0].name).toEqual(items[0].name)
    expect(itemsDb[0].price).toEqual(items[0].price)
    expect(itemsDb[1].id).toEqual(items[1].id.id)
    expect(itemsDb[1].name).toEqual(items[1].name)
    expect(itemsDb[1].price).toEqual(items[1].price)
  })

  it("should find an invoice", async () => {
    const inputInvoice = {
      id: "1",
      name: "Invoice 1",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa",
      city: "Criciuma",
      state: "SC",
      zipcode: "12345-000",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const invoice = await InvoiceModel.create(inputInvoice);

    const inputItems = [
      {
        id: "1",
        name: "Item 1",
        price: 12.95,
        createdAt: new Date(),
        updatedAt: new Date(),
        invoiceId: invoice.id
      },
      {
        id: "2",
        name: "Item 2",
        price: 20.50,
        createdAt: new Date(),
        updatedAt: new Date(),
        invoiceId: invoice.id
      }
    ]

    const items = await InvoiceItemModel.bulkCreate(inputItems);

    const repository = new InvoiceRepository();
    const result = await repository.find(invoice.id);

    expect(result.id.id).toEqual(invoice.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.address.street).toEqual(invoice.street)
    expect(result.address.number).toEqual(invoice.number)
    expect(result.address.complement).toEqual(invoice.complement)
    expect(result.address.city).toEqual(invoice.city)
    expect(result.address.state).toEqual(invoice.state)
    expect(result.address.zipCode).toEqual(invoice.zipcode)
    expect(result.items).toBeDefined()
    expect(result.items.length).toEqual(2)
    expect(result.items[0].id.id).toEqual(items[0].id)
    expect(result.items[0].name).toEqual(items[0].name)
    expect(result.items[0].price).toEqual(items[0].price)
    expect(result.items[1].id.id).toEqual(items[1].id)
    expect(result.items[1].name).toEqual(items[1].name)
    expect(result.items[1].price).toEqual(items[1].price)
  })
})