import Address from "../../@shared/domain/value-object/address"
import InvoiceItem from "../domain/invoice_item.entity"

export interface GenerateInvoiceFacadeInputDto {
  id?: string
  name: string
  document: string
  address: Address
  items: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface FindInvoiceFacadeInputDto {
  id: string
}

export interface FindInvoiceFacadeOutputDto {
  id: string
  name: string
  document: string
  address: Address
  createdAt: Date
  updatedAt: Date
  items: {
    id: string;
    name: string;
    price: number;
  }[];
}

export default interface InvoiceFacadeInterface {
  generate(input: GenerateInvoiceFacadeInputDto): Promise<void>;
  find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto>;
}
