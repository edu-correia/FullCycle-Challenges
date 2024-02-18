import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Invoice from "../../domain/invoice.entity"
import InvoiceItem from "../../domain/invoice_item.entity"
import FindInvoiceUseCase from "./find-invoice.usecase"

const items: InvoiceItem[] = [
  new InvoiceItem({ id: new Id("1"), name: "Item 1", price: 12.95 }),
  new InvoiceItem({ id: new Id("2"), name: "Item 2", price: 20.30 })
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
    save: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice))
  }
}

describe("Find Invoice use case unit test", () => {

  it("should find an invoice", async () => {
    const repository = MockRepository()
    const usecase = new FindInvoiceUseCase(repository)

    const input = {
      id: "1"
    };

    const total = items[0].price + items[1].price;

    const result = await usecase.execute(input)

    expect(repository.find).toHaveBeenCalled()
    expect(result.id).toEqual(input.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.address).toEqual(invoice.address)
    expect(result.createdAt).toEqual(invoice.createdAt)
    expect(result.updatedAt).toEqual(invoice.updatedAt)
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