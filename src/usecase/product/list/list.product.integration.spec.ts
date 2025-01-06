import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ListProductUsecase from "./list.product.usecase";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

const productA = ProductFactory.create("a", "Product A", 100);
const productB = ProductFactory.create("b", "Product B", 100);
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
  
  it("should list a product", async () => {
    const productRepository = new ProductRepository();
    const useCase = new ListProductUsecase(productRepository);

    await productRepository.create(productA);
    await productRepository.create(productB);

    const output = await useCase.execute({});
    
    expect(output.products.length).toBe(2);
    expect(output.products[0].id).toBe(productA.id);
    expect(output.products[0].name).toBe(productA.name);
    expect(output.products[0].price).toBe(productA.price);
    expect(output.products[1].id).toBe(productB.id);
    expect(output.products[1].name).toBe(productB.name);
    expect(output.products[1].price).toBe(productB.price);
  });
});