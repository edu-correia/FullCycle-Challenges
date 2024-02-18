import { Sequelize } from "sequelize-typescript"
import InvoiceFacade from "./invoice.facade"
import Address from "../../@shared/domain/value-object/address"
import { InvoiceItemModel } from "../repository/invoice_item.model"
import { InvoiceModel } from "../repository/invoice.model"
import InvoiceRepository from "../repository/invoice.repository"
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase"
import { GenerateInvoiceFacadeInputDto } from "./invoice.facade.interface"
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase"
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
      id: "1",
      name: "Invoice 1",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888",
      ),
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
      ]
    }

    await facade.generate(input)

    const invoice = await InvoiceModel.findOne({ where: { id: "1" } })

    expect(invoice).toBeDefined()
    expect(invoice.id).toBe(input.id)
    expect(invoice.name).toBe(input.name)
    expect(invoice.document).toBe(input.document)
    expect(invoice.street).toBe(input.address.street)
    expect(invoice.number).toBe(input.address.number)
    expect(invoice.complement).toBe(input.address.complement)
    expect(invoice.city).toBe(input.address.city)
    expect(invoice.state).toBe(input.address.state)
    expect(invoice.zipcode).toBe(input.address.zipCode)

    const itemsDb = await InvoiceItemModel.findAll({ where: { invoiceId: invoice.id } });

    expect(itemsDb).toBeDefined()
    expect(itemsDb.length).toEqual(2)
    expect(itemsDb[0].id).toEqual(input.items[0].id)
    expect(itemsDb[0].name).toEqual(input.items[0].name)
    expect(itemsDb[0].price).toEqual(input.items[0].price)
    expect(itemsDb[1].id).toEqual(input.items[1].id)
    expect(itemsDb[1].name).toEqual(input.items[1].name)
    expect(itemsDb[1].price).toEqual(input.items[1].price)
  })

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create()

    const input: GenerateInvoiceFacadeInputDto = {
      id: "1",
      name: "Invoice 1",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa verde",
        "Criciuma",
        "SC",
        "12345-000"
      ),
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
      ]
    }

    await facade.generate(input);

    const result = await facade.find({ id: "1" });

    expect(result).toBeDefined()
    expect(result.id).toBe(input.id)
    expect(result.name).toBe(input.name)
    expect(result.document).toBe(input.document)
    expect(result.address.street).toBe(input.address.street)
    expect(result.address.number).toBe(input.address.number)
    expect(result.address.complement).toBe(input.address.complement)
    expect(result.address.city).toBe(input.address.city)
    expect(result.address.state).toBe(input.address.state)
    expect(result.address.zipCode).toBe(input.address.zipCode)
    expect(result.items).toBeDefined()
    expect(result.items.length).toEqual(2)
    expect(result.items[0].id).toEqual(input.items[0].id)
    expect(result.items[0].name).toEqual(input.items[0].name)
    expect(result.items[0].price).toEqual(input.items[0].price)
    expect(result.items[1].id).toEqual(input.items[1].id)
    expect(result.items[1].name).toEqual(input.items[1].name)
    expect(result.items[1].price).toEqual(input.items[1].price)
  })
})