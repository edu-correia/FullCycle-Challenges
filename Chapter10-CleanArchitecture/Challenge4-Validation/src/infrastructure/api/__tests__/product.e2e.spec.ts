import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should list all products", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product A",
        price: 19.50
      });
    expect(response.status).toBe(200);

    const response2 = await request(app)
      .post("/product")
      .send({
        name: "Product B",
        price: 10.20
      });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);

    const product1 = listResponse.body.products[0];
    expect(product1.name).toBe("Product A");
    expect(product1.price).toBe(19.50);

    const product2 = listResponse.body.products[1];
    expect(product2.name).toBe("Product B");
    expect(product2.price).toBe(10.20);

    const listResponseXML = await request(app)
    .get("/product")
    .set("Accept", "application/xml")
    .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(listResponseXML.text).toContain(`<products>`);
    expect(listResponseXML.text).toContain(`<product>`);
    expect(listResponseXML.text).toContain(`<name>Product A</name>`);
    expect(listResponseXML.text).toContain(`<price>19.5</price>`);
    expect(listResponseXML.text).toContain(`</product>`);
    expect(listResponseXML.text).toContain(`<name>Product B</name>`);
    expect(listResponseXML.text).toContain(`<price>10.2</price>`);
    expect(listResponseXML.text).toContain(`</products>`);
  });
});