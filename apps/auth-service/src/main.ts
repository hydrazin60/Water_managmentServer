import express from "express";

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 6000;

const app = express();

app.get("/", (req, res) => {
  res.send({ message: "Hello API from auth-service" });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
