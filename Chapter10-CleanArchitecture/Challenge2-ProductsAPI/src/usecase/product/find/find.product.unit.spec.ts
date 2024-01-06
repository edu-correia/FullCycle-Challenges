import Product from "../../../domain/product/entity/product";
import { InputFindProductDto } from "./find.product.dto";
import FindProductUseCase from "./find.product.usecase";

const product = new Product("123", "Product A", 19.50);

const MockRepository = () => {
    return {
      find: jest.fn().mockReturnValue(Promise.resolve(product)),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
  };

describe("Unit test for finding product use case", () => {
    it("should find a product", async () => {
        const productRepository = MockRepository();
        const findProductUseCase = new FindProductUseCase(productRepository);

        const input: InputFindProductDto = {
            id: "123"
        };

        const result = await findProductUseCase.execute(input);

        expect(result).toEqual({
            id: product.id,
            name: product.name,
            price: product.price
        });
    });

    it("should not find a product", async () => {
        const productRepository = MockRepository();
        productRepository.find.mockImplementation(() => {
            throw new Error("Product not found");
        });

        const findProductUseCase = new FindProductUseCase(productRepository);

        const input: InputFindProductDto = {
            id: "124"
        };

        await expect(findProductUseCase.execute(input)).rejects.toThrow(
            "Product not found"
        );
    });
});