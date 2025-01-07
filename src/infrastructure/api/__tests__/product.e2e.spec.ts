import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product A", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                type: "a",
                name: "Product A",
                price: 10
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Product A");
        expect(response.body.price).toBe(10);
    });

    it("should create a product B", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                type: "b",
                name: "Product B",
                price: 10
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Product B");
        expect(response.body.price).toBe(20);
    });

    it("should not create a product", async () => {
        const response = await request(app).post("/product").send({
            name: "Product C",
        });
        expect(response.status).toBe(500);
    });

    it("should not create a product", async () => {
        const response = await request(app).post("/product").send({
            type: "c",
        });
        expect(response.status).toBe(500);
    });

    it("should list all products", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                type: "a",
                name: "Product A",
                price: 10
            });
        expect(response.status).toBe(200);

        const response2 = await request(app)
            .post("/product")
            .send({
                type: "b",
                name: "Product B",
                price: 10
            });
        expect(response2.status).toBe(200);

        const response3 = await request(app)
            .get("/product");
        expect(response3.status).toBe(200);
        expect(response3.body.products.length).toBe(2);
        expect(response3.body.products[0].name).toBe("Product A");
        expect(response3.body.products[0].price).toBe(10);
        expect(response3.body.products[1].name).toBe("Product B");
        expect(response3.body.products[1].price).toBe(20);

        const responseXml = await request(app)
            .get("/product")
            .set('Accept', 'application/xml')
            .send();

        expect(responseXml.status).toBe(200);
        expect(responseXml.text).toContain("<name>Product A</name>");
        expect(responseXml.text).toContain("<price>10</price>");
        expect(responseXml.text).toContain("<name>Product B</name>");
        expect(responseXml.text).toContain("<price>20</price>");
    });
});