import { Request, Response } from "express";
import format from "pg-format";
import { client } from "./database";
import { iAddMovieResponse, iMovieRequest, iMovieRespose } from "./interfaces";

export const addMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const movieDataRequest: iMovieRequest = request.body;
  const queryOrder: string = format(
    `
        INSERT INTO
            movies(%I)
        VALUES
            (%L)
        RETURNING *;
    `,
    Object.keys(movieDataRequest),
    Object.values(movieDataRequest)
  );

  const queryResponse: iAddMovieResponse = await client.query(queryOrder);
  const newMovie: iMovieRespose = queryResponse.rows[0];

  return response.status(201).json(newMovie);
};