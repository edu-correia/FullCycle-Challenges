import express, { Request, Response } from "express";
import PlaceOrderUseCase from "../../../modules/checkout/usecase/place-order/place-order.usecase";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../../modules/store-catalog/factory/facade.factory";
import CheckoutRepository from "../../../modules/checkout/repository/checkout.repository";
import PaymentFacadeFactory from "../../../modules/payment/factory/payment.facade.factory";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";
import { PlaceOrderInputDto } from "../../../modules/checkout/usecase/place-order/place-order.dto";
import { ProductModel } from "../../../modules/product-adm/repository/product.model";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req: Request, res: Response) => {
  const clientFacade = ClientAdmFacadeFactory.create();
  const productFacade = ProductAdmFacadeFactory.create();
  const catalogFacade = StoreCatalogFacadeFactory.create();

  const checkoutRepository = new CheckoutRepository();
  const paymentFacade = PaymentFacadeFactory.create();
  const invoiceFacade = InvoiceFacadeFactory.create();

  const usecase = new PlaceOrderUseCase(
    clientFacade,
    productFacade,
    catalogFacade,
    checkoutRepository,
    invoiceFacade,
    paymentFacade
  );

  try {
    const checkoutDto: PlaceOrderInputDto = {
      clientId: req.body.clientId,
      products: req.body.products
    };

    const output = await usecase.execute(checkoutDto);

    return res.status(201).json({ message: "Checkout completed succesfully!", result: output });
  } catch (err) {
    console.log(err);
    
    return res.status(500).json({ message: "Oops, something went wrong!", error: err });
  }
});
