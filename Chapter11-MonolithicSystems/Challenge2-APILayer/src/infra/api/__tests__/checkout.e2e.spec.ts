import ClientModel from "../../../modules/checkout/repository/client.model";
import ProductModel from "../../../modules/checkout/repository/product.model";
import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for checkout", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it("should create a order", async () => {
    await ClientModel.create({
      id: "C-1",
      name: "Eduardo",
      email: "eduardo@gmail.com",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa verde",
      city: "Criciuma",
      state: "SC",
      zipCode: "12345-000",
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await ProductModel.bulkCreate([
      {
        id: "P-1",
        name: "Prod1",
        description: "Prod1 Description",
        salesPrice: 150,
        stock: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
        orderId: null
      }
    ]);

    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: "C-1",
        products: [
          { productId: "P-1" }
        ]
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Checkout completed succesfully!");
    expect(response.body.result.id).toBeDefined();
    expect(response.body.result.invoiceId).toBeDefined();
    expect(response.body.result.status).toBe("approved");
    expect(response.body.result.total).toBe(150);
    expect(response.body.result.products).toStrictEqual([{ productId: "P-1" }]);
  });
});
