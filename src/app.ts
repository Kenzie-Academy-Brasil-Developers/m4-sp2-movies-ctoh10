import express, { Application } from "express";
import { startDatabase } from "./database";
import { addMovie, listMovies } from "./logic";
import { movieExists, validateMovie } from "./middlewares";

const app: Application = express();
app.use(express.json());

const portNumber: number = 3000;
const message: string = `Server is running on http://localhost:${portNumber}`;

app.get("/movies", listMovies);
app.post("/movies", movieExists, validateMovie, addMovie);

app.listen(portNumber, async () => {
  await startDatabase();
  console.log(message);
});
