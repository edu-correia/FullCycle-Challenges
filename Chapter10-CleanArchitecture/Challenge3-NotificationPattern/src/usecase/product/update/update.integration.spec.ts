import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import UpdateProductUseCase from "./update.product.usecase";

const createProductInput = {
	name: 'Product A',
	price: 19.50,
};

describe("Integration test for product update use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

	it("should update a product", async () => {
		const productRepository = new ProductRepository();

		const createProductUseCase = new CreateProductUseCase(productRepository);
		const product = await createProductUseCase.execute(createProductInput);

		product.name = "Product A(updated)";
		product.price = 20;

		const updateProductUseCase = new UpdateProductUseCase(productRepository);
		const updatedProduct = await updateProductUseCase.execute(product);

		expect(updatedProduct).toEqual({
			id: product.id,
			name: "Product A(updated)",
			price: 20,
		});
	});

	it("should throw an error when product name is missing", async () => {
		const productRepository = new ProductRepository();

		// create a product to be updated
		const createProductUseCase = new CreateProductUseCase(productRepository);
		const product = await createProductUseCase.execute(createProductInput);

		product.name = "";

		// update the product
		const updateProductUseCase = new UpdateProductUseCase(productRepository);
		await expect(() => {
			return updateProductUseCase.execute(product);
		}).rejects.toThrow("Name is required");
	});

	it("should throw an error when product price is zero", async () => {
		const productRepository = new ProductRepository();

		// create a product to be updated
		const createProductUseCase = new CreateProductUseCase(productRepository);
		const product = await createProductUseCase.execute(createProductInput);

		product.price = -1;

		// update the product
		const updateProductUseCase = new UpdateProductUseCase(productRepository);
		await expect(() => {
			return updateProductUseCase.execute(product);
		}).rejects.toThrow("Price must be greater than zero");
	});

});