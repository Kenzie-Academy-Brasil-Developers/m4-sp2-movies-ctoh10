import { NextFunction, Request, Response } from "express";
import { client } from "./database";
import { iMovieRespose, iRequiredMovieKeys } from "./interfaces";

export const validateMovie = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const movieBody: string[] = Object.keys(request.body);
  const requiredMovie: iRequiredMovieKeys[] = ["name", "duration", "price"];

  const matchesRequired: boolean = requiredMovie.every((key: string) => {
    return movieBody.includes(key);
  });

  const joinedKeys = requiredMovie.join(", ");

  if (!matchesRequired) {
    return response
      .status(400)
      .json({ message: `Required keys are: ${joinedKeys}` });
  }

  return next();
};

export const movieExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const queryString = `
            SELECT
                *
            FROM
                movies
            `;

  const allMovies: iMovieRespose[] | void = await (
    await client.query(queryString)
  ).rows;

  const exists = allMovies.find(
    (movieName: iMovieRespose) => movieName.name === request.body.name
  );
  if (exists) {
    return response
      .status(409)
      .json({ message: `${request.body.name} already exists` });
  }

  return next();
};
