import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        name: "Prod1",
        description: "Prod1 Description",
        purchasePrice: 150,
        stock: 20
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Product created succesfully!");
    expect(response.body.result.id).toBeDefined();
    expect(response.body.result.name).toBe("Prod1");
    expect(response.body.result.description).toBe("Prod1 Description");
    expect(response.body.result.purchasePrice).toBe(150);
    expect(response.body.result.stock).toBe(20);
  });
});
