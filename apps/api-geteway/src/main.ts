import express, { Request, Response, Application } from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import * as path from "path";

const app: Application = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
const cookieMiddleware = cookieParser();
app.use(cookieMiddleware as any);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => req.ip,
});
app.use(limiter as any);

app.get("/api-getway", (req: Request, res: Response) => {
  res.send({ message: "Welcome to api-gateway! jiban" });
});

app.use(
  "/",
  proxy("http://localhost:3000") as unknown as express.RequestHandler
);

app.use("/assets", express.static(path.join(__dirname, "assets")));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

server.on("error", console.error);
