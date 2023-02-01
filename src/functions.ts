import { Request, Response } from "express";
import { QueryConfig } from "pg";
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
  let page: number | undefined = Number(request.query.page);
  let perPage: number | undefined = Number(request.query.perPage);

  page <= 1 || Number.isNaN(page) ? (page = 1) : page;
  perPage < 0 || perPage > 5 || Number.isNaN(perPage) ? (perPage = 5) : perPage;

  const queryOrder: string = `
            SELECT
                *
            FROM
                movies
            OFFSET $1 LIMIT $2;
            `;

  const queryConfig: QueryConfig = {
    text: queryOrder,
    values: [perPage * (page - 1), perPage],
  };

  const moviesList: iMovieRespose[] | void = (await client.query(queryConfig))
    .rows;

  if (moviesList.length === 0) {
    return response.status(404).json({ message: "No movies found" });
  }

  return response.json(moviesList);
};
