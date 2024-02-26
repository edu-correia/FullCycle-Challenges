import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutRepository from "./checkout.repository";
import ClientModel from "./client.model";
import OrderModel from "./order.model";
import ProductModel from "./product.model";

describe("CheckoutRepository test", () => {
  let sequelize: Sequelize;

  beforeAll(() => {
    jest.useFakeTimers("modern");
  });

  afterAll(() => {
    jest.useRealTimers;
  });

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([OrderModel, ClientModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should add an order", async () => {
    const client = new Client({
      id: new Id("C-1"),
      name: "client name",
      email: "test@domain.com",
      document: "0000000",
      street: "16 avenus",
      number: "123",
      complement: "Ap 400",
      city: "My city",
      state: "State",
      zipCode: "89777310",
    });

    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: client.document,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    })

    const products = [
      new Product({
        id: new Id("P-1"),
        name: "first product",
        description: "first product description",
        salesPrice: 10,
      }),
      new Product({
        id: new Id("P-2"),
        name: "second product",
        description: "second product description",
        salesPrice: 20,
      })
    ];

    const orderProps = {
      id: new Id("O-1"),
      client: client,
      products: products,
      status: "status 1",
    };

    await ProductModel.bulkCreate(
      products.map(product => ({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
        stock: 10,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        orderId: null
      }))
    );

    const order = new Order(orderProps);
    const checkoutRepository = new CheckoutRepository();
    await checkoutRepository.addOrder(order);

    const checkoutDb = await OrderModel.findOne({
      where: { id: orderProps.id.id },
      include: [OrderModel.associations.products, OrderModel.associations.client],
    })

    expect(orderProps.id.id).toEqual(checkoutDb.id);
    expect(orderProps.client.id.id).toEqual(checkoutDb.client.id);
    expect(orderProps.client.name).toEqual(checkoutDb.client.name);
    expect(orderProps.client.email).toEqual(checkoutDb.client.email);
    expect(orderProps.client.document).toEqual(checkoutDb.client.document);
    expect(orderProps.client.street).toEqual(checkoutDb.client.street);
    expect(orderProps.client.number).toEqual(checkoutDb.client.number);
    expect(orderProps.client.complement).toEqual(checkoutDb.client.complement);
    expect(orderProps.client.city).toEqual(checkoutDb.client.city);
    expect(orderProps.client.state).toEqual(checkoutDb.client.state);
    expect(orderProps.client.zipCode).toEqual(checkoutDb.client.zipCode);
    expect(orderProps.products).toStrictEqual([
      new Product({
        id: new Id(checkoutDb.products[0].id),
        name: checkoutDb.products[0].name,
        description: checkoutDb.products[0].description,
        salesPrice: checkoutDb.products[0].salesPrice,
      }),
      new Product({
        id: new Id(checkoutDb.products[1].id),
        name: checkoutDb.products[1].name,
        description: checkoutDb.products[1].description,
        salesPrice: checkoutDb.products[1].salesPrice,
      }),
    ]);
    expect(orderProps.status).toEqual(checkoutDb.status);
  });

  it("should find an order", async () => {
    const checkoutRepository = new CheckoutRepository();

    const client = new Client({
      id: new Id("C-1"),
      name: "client name",
      email: "test@domain.com",
      document: "0000000",
      street: "16 avenus",
      number: "123",
      complement: "Ap 400",
      city: "My city",
      state: "State",
      zipCode: "89777310",
    });

    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: client.document,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    })

    const products = [
      new Product({
        id: new Id("P-1"),
        name: "first product",
        description: "first product description",
        salesPrice: 10,
      }),
      new Product({
        id: new Id("P-2"),
        name: "second product",
        description: "second product description",
        salesPrice: 20,
      })
    ];

    const orderProps = {
      id: new Id("O-1"),
      client: client,
      products: products,
      status: "status 1",
    };
    const order = new Order(orderProps);

    await OrderModel.create(
      {
        id: order.id.id,
        clientId: order.client.id.id,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      }
    );

    await ProductModel.bulkCreate(
      products.map(product => ({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
        stock: 10,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        orderId: order.id.id
      }))
    );

    const checkout = await checkoutRepository.findOrder("O-1");

    expect(checkout.id.id).toEqual("O-1");
    expect(checkout.client.id.id).toEqual("C-1");
    expect(checkout.client.name).toEqual("client name");
    expect(checkout.client.email).toEqual("test@domain.com");
    expect(checkout.client.document).toEqual("0000000");
    expect(checkout.client.street).toEqual("16 avenus");
    expect(checkout.client.number).toEqual("123");
    expect(checkout.client.complement).toEqual("Ap 400");
    expect(checkout.client.city).toEqual("My city");
    expect(checkout.client.state).toEqual("State");
    expect(checkout.client.zipCode).toEqual("89777310");
    expect(checkout.products).toStrictEqual([
      new Product({
        id: new Id("P-1"),
        name: "first product",
        description: "first product description",
        salesPrice: 10,
      }),
      new Product({
        id: new Id("P-2"),
        name: "second product",
        description: "second product description",
        salesPrice: 20,
      }),
    ]);
    expect(checkout.status).toEqual("status 1");
  });
});
