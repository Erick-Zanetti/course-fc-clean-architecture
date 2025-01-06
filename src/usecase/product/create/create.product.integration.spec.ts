import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase";
import { InputCreateProductDto } from "./create.product.dto";
import { FindProductUseCase } from "../find/find.product.usecase";

const inputA: InputCreateProductDto = {
  name: 'Product A',
  price: 100,
  type: 'a'
}

const inputB: InputCreateProductDto = {
  name: 'Product B',
  price: 100,
  type: 'b'
}

describe("Test create product use case", () => {
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

    it("should create a product type A", async () => {
      const productRepository = new ProductRepository();
      const useCase = new CreateProductUseCase(productRepository);
      const findProductUseCase = new FindProductUseCase(productRepository);
  
      const output = await useCase.execute(inputA);
  
      expect(output).toEqual({
        id: expect.any(String),
        name: inputA.name,
        price: inputA.price,
      });
  
      expect(await findProductUseCase.execute({ id: output.id })).toEqual({
        id: output.id,
        name: inputA.name,
        price: inputA.price,
      });
    });
  
    it("should create a product type B", async () => {
      const productRepository = new ProductRepository();
      const useCase = new CreateProductUseCase(productRepository);
      const findProductUseCase = new FindProductUseCase(productRepository);
  
      const output = await useCase.execute(inputB);
  
      expect(output).toEqual({
        id: expect.any(String),
        name: inputB.name,
        price: inputB.price * 2,
      });
  
      expect(await findProductUseCase.execute({ id: output.id })).toEqual({
        id: output.id,
        name: inputB.name,
        price: inputB.price * 2,
      });
    });
  
});