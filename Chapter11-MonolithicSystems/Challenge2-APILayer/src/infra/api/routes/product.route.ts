import express, { Request, Response } from "express";
import { AddProductFacadeInputDto } from "../../../modules/product-adm/facade/product-adm.facade.interface";
import AddProductUseCase from "../../../modules/product-adm/usecase/add-product/add-product.usecase";
import ProductRepository from "../../../modules/product-adm/repository/product.repository";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
  const usecase = new AddProductUseCase(new ProductRepository());

  try {
    const productDto: AddProductFacadeInputDto = {
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
    };

    const output = await usecase.execute(productDto);

    return res.status(201).json({ message: "Product created succesfully!", result: output });
  } catch (err) {
    return res.status(500).json({ message: "Oops, something went wrong!", error: err });
  }
});
