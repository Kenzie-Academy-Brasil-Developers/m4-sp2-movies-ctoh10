import express, { Application } from "express";
import { startDatabase } from "./database";
import { listMovies, addMovie, updateMovie, deleteMovie } from "./functions";
import {
  checkMovieID,
  movieNameExists,
  updateValidation,
  validateMovie,
} from "./middlewares";

const app: Application = express();
app.use(express.json());

const portNumber: number = 3000;
const message: string = `Server is running on http://localhost:${portNumber}`;

app.get("/movies", listMovies);
app.post("/movies", movieNameExists, validateMovie, addMovie);
app.patch(
  "/movies/:id",
  checkMovieID,
  updateValidation,
  movieNameExists,
  updateMovie
);
app.delete("/movies/:id", checkMovieID, deleteMovie);

app.listen(portNumber, async () => {
  await startDatabase();
  console.log(message);
});
