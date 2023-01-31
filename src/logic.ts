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

export const listMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const queryOrder: string = `
            SELECT
                *
            FROM
                movies
            `;

  const moviesList: iMovieRespose[] | void = await (
    await client.query(queryOrder)
  ).rows;
  return response.json(moviesList);
};

// UPDATE
//      clientes
// SET
//      (%I) = ROW(%L)
// WHERE id = 1;
