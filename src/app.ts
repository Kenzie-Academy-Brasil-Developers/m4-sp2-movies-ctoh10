import express, { Application } from "express";
import { startDatabase } from "./database";
import { addMovie } from "./logic";
import { movieExists } from "./middlewares";

const app: Application = express();
app.use(express.json());

const portNumber: number = 3000;
const message: string = `Server is running on http://localhost:${portNumber}`;

app.get("/movies", movieExists);
app.post("/movies", addMovie);

app.listen(portNumber, async () => {
  await startDatabase();
  console.log(message);
});
