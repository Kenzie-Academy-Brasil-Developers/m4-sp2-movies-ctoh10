import { NextFunction, Request, Response } from "express";
import { client } from "./database";
import { iMovieRespose } from "./interfaces";

export const validateMovie = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {};

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

  //   const exists = allMovies.find(
  //     (movieName: string) => movieName.name === request.body.name
  //   );

  return response.status(200).json(allMovies);
};
