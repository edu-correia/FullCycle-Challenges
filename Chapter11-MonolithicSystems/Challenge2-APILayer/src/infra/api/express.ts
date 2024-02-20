import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";

// API Routes
import { productRoute } from "./routes/product.route";
import { clientRoute } from "./routes/client.route";
import { checkoutRoute } from "./routes/checkout.route";

// Sequelize models
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../../modules/invoice/repository/invoice_item.model";
import { TransactionModel } from "../../modules/payment/repository/transaction.model";
import { ProductModel as ProductAdmModel } from "../../modules/product-adm/repository/product.model";
import { ProductModel as StoreProductModel } from "../../modules/store-catalog/repository/product.model";
import { OrderModel } from "../../modules/checkout/repository/order.model";
import { ProductModel } from "../../modules/checkout/repository/product.model";
import { ClientModel as OrderClientModel } from "../../modules/checkout/repository/client.model";

export const app: Express = express();
app.use(express.json());
app.use("/products", productRoute);
app.use("/clients", clientRoute);
app.use("/checkout", checkoutRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  await sequelize.addModels([
    OrderModel,
    ClientModel,
    OrderClientModel,
    TransactionModel,
    StoreProductModel,
    InvoiceItemModel,
    InvoiceModel,
    ProductModel,
    ProductAdmModel,
  ]);
  await sequelize.sync();
}
(async () => {
  await setupDb();
})()
