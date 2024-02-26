import ClientModel from "../../../modules/checkout/repository/client.model";
import OrderModel from "../../../modules/checkout/repository/order.model";
import ProductModel from "../../../modules/checkout/repository/product.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for invoice", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should retrieve a invoice", async () => {
    const invoice = {
      id: "I-1",
      name: "Eduardo",
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
          id: "IT-1",
          name: "Item 1",
          price: 12.95,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "IT-2",
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

    const response = await request(app).get(`/invoice/${invoice.id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Invoice retrieved succesfully!");
    expect(response.body.result.id).toBeDefined();
    expect(response.body.result.name).toBe("Eduardo");
    expect(response.body.result.document).toBe("1234-5678");
    expect(response.body.result.total).toBe(33.45);
    expect(response.body.result.address._street).toBe("Rua 123");
    expect(response.body.result.items[0].id).toBe("IT-1");
  });
});
