import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
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

  if (typeof request.body.name !== "string" || request.body.name.length > 50) {
    return response
      .status(400)
      .json({ message: `Name should be a string with 50 characters maximum` });
  }

  if (typeof request.body.duration !== "number") {
    return response
      .status(400)
      .json({ message: `Duration should be a number` });
  }

  if (typeof request.body.price !== "number") {
    return response.status(400).json({ message: `Price should be a number` });
  }

  return next();
};

export const movieExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const queryString: string = `
            SELECT
                *
            FROM
                movies
            WHERE
              name = $1;
            `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [request.body.name],
  };
  const allMovies: iMovieRespose[] | void = await (
    await client.query(queryConfig)
  ).rows;

  const exists: iMovieRespose | undefined = allMovies.find(
    (movieName: iMovieRespose) => movieName.name === request.body.name
  );
  if (exists) {
    return response
      .status(409)
      .json({ message: `${request.body.name} already exists` });
  }

  return next();
};
