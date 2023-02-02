import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import {
  iMovieResponse,
  iRequiredMovieKeys,
  iRequiredUpdate,
} from "./interfaces";

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

export const updateValidation = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const updateMovie: string[] = Object.keys(request.body);
  const permittedUpdate: iRequiredUpdate[] = [
    "name",
    "duration",
    "price",
    "description",
  ];

  if (updateMovie.length === 0) {
    return response
      .status(404)
      .json({ message: "At least one key is required for updating" });
  }

  const matchesPermitted: boolean = updateMovie.every((key: string) => {
    return permittedUpdate.includes(key as iRequiredUpdate);
  });

  const joinedKeys = permittedUpdate.join(", ");

  if (!matchesPermitted) {
    return response
      .status(400)
      .json({ message: `Permitted keys are: ${joinedKeys}` });
  }

  if (
    (typeof request.body.name !== "string" || request.body.name.length > 50) &&
    request.body.name
  ) {
    return response
      .status(400)
      .json({ message: `Name should be a string with 50 characters maximum` });
  }

  if (
    typeof request.body.description !== "string" &&
    request.body.description
  ) {
    return response
      .status(400)
      .json({ message: `Description should be a string ` });
  }

  if (typeof request.body.duration !== "number" && request.body.duration) {
    return response
      .status(400)
      .json({ message: `Duration should be a number` });
  }

  if (typeof request.body.price !== "number" && request.body.price) {
    return response.status(400).json({ message: `Price should be a number` });
  }

  return next();
};

export const movieNameExists = async (
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
  const allMovies: iMovieResponse[] | void = await (
    await client.query(queryConfig)
  ).rows;

  const exists: iMovieResponse | undefined = allMovies.find(
    (movieName: iMovieResponse) => movieName.name === request.body.name
  );

  if (exists) {
    return response
      .status(409)
      .json({ message: `${request.body.name} already exists` });
  }

  return next();
};

export const checkMovieID = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = Number(request.params.id);

  if (Number.isNaN(id)) {
    return response
      .status(400)
      .json({ message: "ID parameter must be a number" });
  }

  const queryString: string = `
            SELECT
                *
            FROM
                movies
            WHERE
              id = $1;
            `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [request.params.id],
  };
  const allMovies: iMovieResponse[] | void = await (
    await client.query(queryConfig)
  ).rows;

  const exists: iMovieResponse | undefined = allMovies.find(
    (movieName: iMovieResponse) => Number(movieName.id) === id
  );

  if (exists) {
    return next();
  }

  return response.status(404).json({ message: `ID ${id} was not found` });
};
