import { Client } from "pg";

const client = new Client({
  user: "luism",
  password: "k3nzi3",
  host: "localhost",
  database: "movies",
  port: 5432,
});

client.connect();
console.log("Database successfully connected");

client.end();
console.log("Connection to dabatase ended");
