import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Invoice from "../../domain/invoice.entity"
import InvoiceItem from "../../domain/invoice_item.entity"
import GenerateInvoiceUseCase from "./generate-invoice.usecase"

const items: InvoiceItem[] = [
  new InvoiceItem({ id: new Id("1"), name: "Item 1", price: 12.95 }),
  new InvoiceItem({ id: new Id("2"), name: "Item 2", price: 20.50 })
]

const invoice = new Invoice({
  id: new Id("1"),
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
  items
})

const MockRepository = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    find: jest.fn()
  }
}

describe("Generate Invoice use case unit test", () => {

  it("should generate an invoice", async () => {
    const repository = MockRepository()
    const usecase = new GenerateInvoiceUseCase(repository)

    const input = {
      name: "Invoice 1",
      document: "1234-5678",
      address: {
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipCode: "88888-888",
      },
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
    
    const result = await usecase.execute(input)
    
    const total = input.items[0].price + input.items[1].price;

    expect(repository.save).toHaveBeenCalled()
    expect(result.id).toBeDefined
    expect(result.name).toEqual(input.name)
    expect(result.document).toEqual(input.document)
    expect(result.street).toEqual(input.address.street)
    expect(result.number).toEqual(input.address.number)
    expect(result.complement).toEqual(input.address.complement)
    expect(result.state).toEqual(input.address.state)
    expect(result.city).toEqual(input.address.city)
    expect(result.zipCode).toEqual(input.address.zipCode)
    expect(result.total).toEqual(total)
    expect(result.items).toBeDefined()
    expect(result.items.length).toEqual(2)
    expect(result.items[0].id).toEqual(items[0].id.id)
    expect(result.items[0].name).toEqual(items[0].name)
    expect(result.items[0].price).toEqual(items[0].price)
    expect(result.items[1].id).toEqual(items[1].id.id)
    expect(result.items[1].name).toEqual(items[1].name)
    expect(result.items[1].price).toEqual(items[1].price)
  })
})