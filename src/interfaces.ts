import { QueryResult } from "pg";

export interface iMovieRequest {
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export interface iMovieRespose extends iMovieRequest {
  id: number;
}

export type iAddMovieResponse = QueryResult<iMovieRespose>;

export type iRequiredMovieKeys = "name" | "duration" | "price";

export type iRequiredUpdate = iRequiredMovieKeys | "description";
