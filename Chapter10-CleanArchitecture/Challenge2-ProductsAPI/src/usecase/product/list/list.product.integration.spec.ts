import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import { Sequelize } from "sequelize-typescript";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import CreateProductUseCase from "../create/create.product.usecase";

const createProductAInput = {
	name: 'Product A',
	price: 19.50,
};

const createProductBInput = {
	name: 'Product B',
	price: 10.20,
};

const output = {
	products:
		[
			{
				id: expect.any(String),
				name: createProductAInput.name,
				price: createProductAInput.price,
			},
			{
				id: expect.any(String),
				name: createProductBInput.name,
				price: createProductBInput.price,
			}
		]
}

describe("Integration test for listing product use case", () => {
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

	it("should list all products", async () => {
		const productRepository = new ProductRepository();

		const createProductUseCase = new CreateProductUseCase(productRepository);
		await createProductUseCase.execute(createProductAInput);
		await createProductUseCase.execute(createProductBInput);

		const listProductUseCase = new ListProductUseCase(productRepository);
		const response = await listProductUseCase.execute();

		expect(response).toEqual(output);
	});
});