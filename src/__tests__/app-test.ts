import request from "supertest";
import { app, prisma } from "../app";

afterAll(async (done) => {
  await prisma.$disconnect();
  done();
});

const now = new Date();
const tomorrow = new Date(now.valueOf() + 60 * 60 * 24 * 1000);
const body = {
  datetime: now.valueOf(),
  temperature: 22.0041086409,
  humidity: 49.1351015079,
  pressure: 1022.50175382,
};

describe("test post", () => {
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

describe("get", () => {
  it("success", () => {
    return request(app)
      .get(
        `/api/temperature?start=${now
          .toISOString()
          .replace(/T.*$/, "")}&end=${tomorrow
          .toISOString()
          .replace(/T.*$/, "")}`,
      )
      .then((response) => {
        const latest = response.body[response.body.length - 1];
        expect(latest.datetime).toBe(now.toISOString());
        expect(latest.temperature).toBeCloseTo(body.temperature);
        expect(latest.humidity).toBeCloseTo(body.humidity);
        expect(latest.pressure).toBeCloseTo(body.pressure);
      });
  });
});

describe("healthcheck", () => {
  it("returns OK", () => {
    return request(app)
      .get("/status")
      .then((response) => expect(response.status).toBe(200));
  });
});
