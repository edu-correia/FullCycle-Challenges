import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import OrderFactory, { OrderFactoryProps } from "../../../../domain/checkout/factory/order.factory";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should find a order", async () => {
    const orderRepository = new OrderRepository();

    const productRepository = new ProductRepository();
    const product1 = new Product("P1", "Product 1", 100);
    const product2 = new Product("P2", "Product 2", 28);

    await productRepository.create(product1);
    await productRepository.create(product2);

    const customerRepository = new CustomerRepository();
    const customer = new Customer("C1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.Address = address;
    await customerRepository.create(customer);

    const item1 = new OrderItem("I1", "Item A", 20, "P1", 5);
    const item2 = new OrderItem("I2", "Item B", 30, "P2", 1);

    const items = [item1, item2];

    const orderFactoryProps: OrderFactoryProps = {
      id: "O1",
      customerId: "C1",
      items
    }

    const order = OrderFactory.create(orderFactoryProps);

    await orderRepository.create(order);

    const orderResult = await orderRepository.find("O1");

    expect(order).toStrictEqual(orderResult);
  })

  it("should find all orders", async () => {
    const orderRepository = new OrderRepository();

    const productRepository = new ProductRepository();
    const product1 = new Product("P1", "Product 1", 100);
    const product2 = new Product("P2", "Product 2", 28);

    await productRepository.create(product1);
    await productRepository.create(product2);

    const customerRepository = new CustomerRepository();
    const customer = new Customer("C1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.Address = address;
    await customerRepository.create(customer);

    const item1ForOrder1 = new OrderItem("I1", "Item A", 20, "P1", 5);
    const item2ForOrder1 = new OrderItem("I2", "Item B", 30, "P2", 1);
    const item1ForOrder2 = new OrderItem("I3", "Item C", 10, "P2", 15);
    const item2ForOrder2 = new OrderItem("I4", "Item D", 30, "P1", 2);

    const itemsForOrder1 = [item1ForOrder1, item2ForOrder1];
    const itemsForOrder2 = [item1ForOrder2, item2ForOrder2];

    const order1FactoryProps: OrderFactoryProps = {
      id: "O1",
      customerId: "C1",
      items: itemsForOrder1
    }

    const order2FactoryProps: OrderFactoryProps = {
      id: "O2",
      customerId: "C1",
      items: itemsForOrder2
    }

    const order1 = OrderFactory.create(order1FactoryProps);
    const order2 = OrderFactory.create(order2FactoryProps);

    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const ordersResult = await orderRepository.findAll();

    expect([order1, order2]).toStrictEqual(ordersResult);
  });

  it("should update a order", async () => {
    const orderRepository = new OrderRepository();

    const productRepository = new ProductRepository();
    const product1 = new Product("P1", "Product 1", 100);
    const product2 = new Product("P2", "Product 2", 28);

    await productRepository.create(product1);
    await productRepository.create(product2);

    const customerRepository = new CustomerRepository();
    const customer = new Customer("C1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.Address = address;
    await customerRepository.create(customer);

    const item1 = new OrderItem("I1", "Item A", 20, "P1", 5);
    const item2 = new OrderItem("I2", "Item B", 30, "P2", 1);

    const items = [item1, item2];

    const orderFactoryProps: OrderFactoryProps = {
      id: "O1",
      customerId: "C1",
      items
    }

    const order = OrderFactory.create(orderFactoryProps);

    await orderRepository.create(order);

    const newItem1 = new OrderItem("I3", "Item C", 10, "P2", 1);
    const newItem2 = new OrderItem("I4", "Item D", 12, "P1", 12);

    const newItems = [newItem1, newItem2];

    const orderFactoryPropsUpdated: OrderFactoryProps = {
      id: "O1",
      customerId: "C1",
      items: newItems
    }

    const orderUpdated = OrderFactory.create(orderFactoryPropsUpdated);

    await orderRepository.update(orderUpdated);

    const orderResult = await OrderModel.findOne({where: { id: "O1" }, include: ["items"]});

    expect(orderResult.toJSON()).toStrictEqual({
      id: "O1",
      customer_id: orderUpdated.customerId,
      total: orderUpdated.total(),
      items: orderUpdated.items.map(item => ({
        id: item.id,
        product_id: item.productId,
        order_id: "O1",
        quantity: item.quantity,
        name: item.name,
        price: item.price
      }))
    });
  });
});
