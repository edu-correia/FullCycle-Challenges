import express, { Request, Response } from "express";
import { AddClientFacadeInputDto } from "../../../modules/client-adm/facade/client-adm.facade.interface";
import Address from "../../../modules/@shared/domain/value-object/address";
import AddClientUseCase from "../../../modules/client-adm/usecase/add-client/add-client.usecase";
import ClientRepository from "../../../modules/client-adm/repository/client.repository";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  const usecase = new AddClientUseCase(new ClientRepository());

  try {
    const clientDto: AddClientFacadeInputDto = {
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: new Address(
        req.body.address.street,
        req.body.address.number,
        req.body.address.complement,
        req.body.address.city,
        req.body.address.state,
        req.body.address.zipcode,
      )
    };

    const output = await usecase.execute(clientDto);

    return res.status(201).json({ message: "Client registered succesfully!", result: output });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Oops, something went wrong!", error: err });
  }
});
