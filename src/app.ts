import express from "express";
import { PrismaClient, Weather } from "@prisma/client";

export const prisma = new PrismaClient();
export const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const isBodyValid = (
  body: unknown,
): body is Omit<Weather, "datetime"> & { datetime: number } => {
  if (typeof body !== "object") {
    return false;
  }
  if (body === null) {
    return false;
  }
  return (
    "datetime" in body &&
    "temperature" in body &&
    "humidity" in body &&
    "pressure" in body
  );
};

app.post("/api/temperature", async (req, res) => {
  const body = req.body;
  if (!isBodyValid(body)) {
    res.status(400).json({
      title: "request body is invalid",
      detail:
        "Request body must contain datetime, temperature, humidity and pressure.",
    });
    return;
  }
  if (req.get("X-Temppost-Password") !== process.env.TEMPPOST_PASSWORD) {
    res
      .status(401)
      .json({ title: "incorrect password", detail: "Psssword is incorrect." });
    return;
  }
  const result = await prisma.weather.create({
    data: { ...body, datetime: new Date(body.datetime) },
  });
  res.status(200).json(result);
});

app.get("/status", (req, res) => {
  res.json({ status: "OK" });
});
