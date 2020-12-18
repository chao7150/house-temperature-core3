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

/**
 * queryがstringならパースしそれ以外ならデフォルト値にフォールバックする
 * - デフォルト値
 *   - start: 今日の0時0分
 *   - end: 明日の0時0分
 */
const parseStartEnd = ({
  query,
  now,
}: {
  query: express.Request["query"];
  now: Date;
}): { start: Date; end: Date } => {
  const beginningOfToday = new Date(now.setHours(0, 0, 0, 0));
  const start =
    typeof query.start === "string" ? new Date(query.start) : beginningOfToday;
  const end =
    typeof query.end === "string"
      ? new Date(query.end)
      : new Date(beginningOfToday.valueOf() + 60 * 60 * 24 * 1000);
  return { start, end };
};

app.get("/api/temperature", async (req, res) => {
  const now = new Date();
  const { start, end } = parseStartEnd({ query: req.query, now });
  const data = await prisma.weather.findMany({
    where: { datetime: { gte: start, lt: end } },
    orderBy: { datetime: "asc" },
  });
  res.json(data);
});

app.get("/status", (req, res) => {
  res.json({ status: "OK" });
});
