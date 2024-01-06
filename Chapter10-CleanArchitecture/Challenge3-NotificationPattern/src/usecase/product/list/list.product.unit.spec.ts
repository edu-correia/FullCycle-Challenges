import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

const productA = new Product("123", "Product A", 19.50);
const productB = new Product("321", "Product B", 11.20);

const MockRepository = () => {
    return {
        create: jest.fn(),
        find: jest.fn(),
        update: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([productA, productB])),
    };
};

describe("Unit test for listing product use case", () => {
    it("should list a product", async () => {
        const productsRepository = MockRepository();
        const listProductsUseCase = new ListProductUseCase(productsRepository);

        const output = await listProductsUseCase.execute();

        expect(output.products.length).toBe(2);

        expect(output.products[0].id).toBe(productA.id);
        expect(output.products[0].name).toBe(productA.name);
        expect(output.products[0].price).toBe(productA.price);

        expect(output.products[1].id).toBe(productB.id);
        expect(output.products[1].name).toBe(productB.name);
        expect(output.products[1].price).toBe(productB.price);
    });
});