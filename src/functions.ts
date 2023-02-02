import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "./database";
import {
  iAddMovieResponse,
  iMovieRequest,
  iMovieResponse,
  iRequiredUpdate,
} from "./interfaces";

export const addMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const movieDataRequest: iMovieRequest = request.body;
  const queryString: string = format(
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

  const queryResponse: iAddMovieResponse = await client.query(queryString);
  const newMovie: iMovieResponse = queryResponse.rows[0];

  return response.status(201).json(newMovie);
};

export const listMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  let page: number | undefined = Number(request.query.page);
  let perPage: number | undefined = Number(request.query.perPage);

  let sort: string = request.query.sort?.toString().toLowerCase() || "";
  let order: string = request.query.order?.toString().toUpperCase() || "ASC";

  sort === "price" || sort === "duration" ? sort : (sort = "");
  sort === "" ? (order = "") : sort;

  page <= 1 || Number.isNaN(page) ? (page = 1) : page;
  perPage <= 0 || perPage > 5 || Number.isNaN(perPage)
    ? (perPage = 5)
    : perPage;

  let queryString: string =
    order === "" && sort === ""
      ? format(
          `
      SELECT 
        *
      FROM
        movies
      OFFSET %s LIMIT %s;
  `,
          perPage * (page - 1),
          perPage
        )
      : format(
          `
      SELECT 
        *
      FROM
        movies
      ORDER BY %I %s
      OFFSET %s LIMIT %s;
  `,
          sort,
          order,
          perPage * (page - 1),
          perPage
        );

  const moviesQuery: QueryResult<iMovieResponse> = await client.query(
    queryString
  );
  if (moviesQuery.rows.length === 0) {
    return response.status(404).json({ message: "No movies found" });
  }

  const nextPage: number = Number(request.query.page) === 0 ? 1 : page + 1;

  return response.json({
    previousPage:
      perPage * (page - 1) === 0
        ? null
        : `http://localhost:3000/movies?page=${page - 1}&perPage=${perPage}`,
    nextPage:
      moviesQuery.rowCount < perPage
        ? null
        : `http://localhost:3000/movies?page=${nextPage}&perPage=${perPage}`,
    count: moviesQuery.rowCount,
    data: moviesQuery.rows,
  });
};

export const updateMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const updateKeysRequest: string[] = Object.keys(request.body);
  const updateValuesRequest: string[] = Object.values(request.body);
  const id: number = Number(request.params.id);

  const queryTemp: string = `
    UPDATE
      movies
    SET (%I) = ROW(%L)
    WHERE id = $1
    RETURNING *;
`;

  const queryFormat: string = format(
    queryTemp,
    updateKeysRequest,
    updateValuesRequest
  );
  const queryConfig: QueryConfig = { text: queryFormat, values: [id] };

  const queryResponse: QueryResult = await client.query(queryConfig);

  return response.json(queryResponse.rows[0]);
};

export const deleteMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = Number(request.params.id);

  const queryTemp: string = `
  DELETE FROM
    movies
    WHERE
    id = $1
  `;
  const queryConfig: QueryConfig = {
    text: queryTemp,
    values: [id],
  };

  await client.query(queryConfig);
  return response.status(204).json();
};
