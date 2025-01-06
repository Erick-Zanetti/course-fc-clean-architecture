import { InputCreateProductDto } from "./create.product.dto";
import CreateProductUseCase from "./create.product.usecase";

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

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
}

describe("Unit test create product use case", () => {

  it("should create a product type A", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output = await productCreateUseCase.execute(inputA);

    expect(output).toEqual({
      id: expect.any(String),
      name: inputA.name,
      price: inputA.price,
    });

  });

  it("should create a product type B", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output = await productCreateUseCase.execute(inputB);

    expect(output).toEqual({
      id: expect.any(String),
      name: inputB.name,
      price: inputB.price * 2,
    });

  });

  it("should thrown an error when name is missing", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const input: InputCreateProductDto = {
      name: '',
      price: 100,
      type: 'a'
    };

    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "Name is required"
    );
  });

  it("should thrown an error when price is missing", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const input: InputCreateProductDto = {
      name: 'Product',
      price: -10,
      type: 'a'
    };

    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "Price must be greater than zero"
    );
  });

  it("should thrown an error when type is missing", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const input: InputCreateProductDto = {
      name: 'Product',
      price: 0,
      type: 'c'
    };

    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "Product type not supported"
    );
  });
});