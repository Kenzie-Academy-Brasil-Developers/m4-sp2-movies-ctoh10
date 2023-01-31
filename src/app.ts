import express, { Application } from "express";
import { startDatabase } from "./database";

const app: Application = express();
app.use(express.json());

const portNumber: number = 3000;
const message: string = `Server is running on https://localhost:${portNumber}`;

app.listen(portNumber, async () => {
  await startDatabase();
  console.log(message);
});
