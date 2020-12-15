import request from "supertest";
import { app, prisma } from "../app";

afterAll(async (done) => {
  await prisma.$disconnect();
  done();
});

describe("test post", () => {
  const now = new Date();
  const body = {
    datetime: now.valueOf(),
    temperature: 22.0041086409,
    humidity: 49.1351015079,
    pressure: 1022.50175382,
  };
  it("success", () => {
    return request(app)
      .post("/api/temperature")
      .set({
        "Content-Type": "application/json",
        "X-Temppost-Password": "test",
      })
      .send(body)
      .then((response) => {
        expect(response.body.datetime).toBe(now.toISOString());
        expect(response.body.temperature).toBeCloseTo(body.temperature);
        expect(response.body.humidity).toBeCloseTo(body.humidity);
        expect(response.body.pressure).toBeCloseTo(body.pressure);
      });
  });
  it("wrong password", () => {
    return request(app)
      .post("/api/temperature")
      .set({
        "Content-Type": "application/json",
        "X-Temppost-Password": "hoge",
      })
      .send(body)
      .then((response) => expect(response.status).toBe(401));
  });
});

describe("healthcheck", () => {
  it("returns OK", () => {
    return request(app)
      .get("/status")
      .then((response) => expect(response.status).toBe(200));
  });
});
