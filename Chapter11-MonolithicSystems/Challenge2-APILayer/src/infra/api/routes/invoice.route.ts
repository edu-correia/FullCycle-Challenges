import express, { Request, Response } from "express";
import FindInvoiceUseCase from "../../../modules/invoice/usecase/find-invoice/find-invoice.usecase";
import InvoiceRepository from "../../../modules/invoice/repository/invoice.repository";

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) return res.status(500).json({ message: "Missing ID parameter!"});

  const invoiceRepository = new InvoiceRepository();

  const usecase = new FindInvoiceUseCase(invoiceRepository);

  try {
    const output = await usecase.execute({ id });

    return res.status(200).json({ message: "Invoice retrieved succesfully!", result: output });
  } catch (err) {
    console.log(err);
    
    return res.status(500).json({ message: "Oops, something went wrong!", error: err });
  }
});
