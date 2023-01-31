import express, { Application } from "express";

const app: Application = express();
app.use(express.json());

const portNumber: number = 3000;
const message: string = `Server is running on https://localhost:${portNumber}`;

app.listen(portNumber, () => {
  console.log(message);
});
