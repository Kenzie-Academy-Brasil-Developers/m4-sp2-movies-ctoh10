import express from "express";

const app = express();
app.use(express.json());

const portNumber: number = 3000;
const message: string = `Server is running on port ${portNumber}
https://localhost:${portNumber}`;

app.listen(portNumber, () => {
  console.log(message);
});
