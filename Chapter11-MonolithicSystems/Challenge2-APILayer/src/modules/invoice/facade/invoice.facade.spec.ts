import { Sequelize } from "sequelize-typescript"
import { InvoiceItemModel } from "../repository/invoice_item.model"
import { InvoiceModel } from "../repository/invoice.model"
import { GenerateInvoiceFacadeInputDto } from "./invoice.facade.interface"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"

describe("Invoice Facade test", () => {

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

  it("should generate an invoice", async () => {
    const facade = InvoiceFacadeFactory.create()

    const input: GenerateInvoiceFacadeInputDto = {
      name: "Invoice 1",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 12.95
        },
        {
          id: "2",
          name: "Item 2",
          price: 20.50
        }
      ],
    }

    const { id: generatedId } = await facade.generate(input);

    const invoice = await InvoiceModel.findOne({ where: { id: generatedId }, include: [InvoiceModel.associations.invoiceItems] })

    expect(invoice).toBeDefined()
    expect(invoice.id).toBe(generatedId)
    expect(invoice.name).toBe(input.name)
    expect(invoice.document).toBe(input.document)
    expect(invoice.street).toBe(input.street)
    expect(invoice.number).toBe(input.number)
    expect(invoice.complement).toBe(input.complement)
    expect(invoice.city).toBe(input.city)
    expect(invoice.state).toBe(input.state)
    expect(invoice.zipcode).toBe(input.zipCode)
    expect(invoice.invoiceItems).toBeDefined()
    expect(invoice.invoiceItems.length).toEqual(2)
    expect(invoice.invoiceItems[0].id).toEqual(input.items[0].id)
    expect(invoice.invoiceItems[0].name).toEqual(input.items[0].name)
    expect(invoice.invoiceItems[0].price).toEqual(input.items[0].price)
    expect(invoice.invoiceItems[1].id).toEqual(input.items[1].id)
    expect(invoice.invoiceItems[1].name).toEqual(input.items[1].name)
    expect(invoice.invoiceItems[1].price).toEqual(input.items[1].price)
  })

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create()

    const invoice = {
      id: "123",
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
      invoiceItems: [
        {
          id: "1",
          name: "Item 1",
          price: 12.95,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          name: "Item 2",
          price: 20.50,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    };

    await InvoiceModel.create(
      invoice,
      {include: [InvoiceModel.associations.invoiceItems]}
    );

    const result = await facade.find({ id: invoice.id });

    expect(result).toBeDefined()
    expect(result.id).toBe(invoice.id)
    expect(result.name).toBe(invoice.name)
    expect(result.document).toBe(invoice.document)
    expect(result.address.street).toBe(invoice.street)
    expect(result.address.number).toBe(invoice.number)
    expect(result.address.complement).toBe(invoice.complement)
    expect(result.address.city).toBe(invoice.city)
    expect(result.address.state).toBe(invoice.state)
    expect(result.address.zipCode).toBe(invoice.zipcode)
    expect(result.items).toBeDefined()
    expect(result.items.length).toEqual(2)
    expect(result.items[0].id).toEqual(invoice.invoiceItems[0].id)
    expect(result.items[0].name).toEqual(invoice.invoiceItems[0].name)
    expect(result.items[0].price).toEqual(invoice.invoiceItems[0].price)
    expect(result.items[1].id).toEqual(invoice.invoiceItems[1].id)
    expect(result.items[1].name).toEqual(invoice.invoiceItems[1].name)
    expect(result.items[1].price).toEqual(invoice.invoiceItems[1].price)
  })
})