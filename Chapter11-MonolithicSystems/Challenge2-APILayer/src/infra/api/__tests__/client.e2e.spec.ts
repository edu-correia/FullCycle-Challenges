import { app } from "../express";
import request from "supertest";

describe("E2E test for client", () => {
  it("should not create a client", async () => {
    const response = await request(app).post("/clients").send({
      name: "john",
    });
    expect(response.status).toBe(500);
  });

  it("should create a client", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        name: "Eduardo",
        email: "eduardo@gmail.com",
        document: "1234-5678",
        address: {
            street: "Rua 123",
            number: "99",
            complement: "Casa verde",
            city: "Criciuma",
            state: "SC",
            zipcode: "12345-000"
        }
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Client registered succesfully!");
    expect(response.body.result.id).toBeDefined();
    expect(response.body.result.name).toBe("Eduardo");
    expect(response.body.result.email).toBe("eduardo@gmail.com");
    expect(response.body.result.document).toBe("1234-5678");
    expect(response.body.result.address._street).toBe("Rua 123");
    expect(response.body.result.address._number).toBe("99");
    expect(response.body.result.address._complement).toBe("Casa verde");
    expect(response.body.result.address._city).toBe("Criciuma");
    expect(response.body.result.address._state).toBe("SC");
    expect(response.body.result.address._zipCode).toBe("12345-000");
  });
});
