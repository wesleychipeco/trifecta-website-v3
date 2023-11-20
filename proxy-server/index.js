const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");

const LEAGUE_ID = "LeagueId";
const URL_STRING = "https://www.fantrax.com/fxpa/req?leagueId=";

const corsOrigin = "*";

app.use(
  cors({
    origin: corsOrigin,
  })
);
app.use(bodyParser.json());
const port = 5000;

// basic string route to prevent Glitch error
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/standings", (req, res) => {
  // use leagueId passed via header
  const leagueId = req.header(LEAGUE_ID);
  const backendUrl = `${URL_STRING}${leagueId}`;

  // return the data without modification
  axios.post(backendUrl, req.body).then((response) => {
    res.send(response.data);
  });
});

app.post("/rosters", (req, res) => {
  // use leagueId passed via header
  const leagueId = req.header(LEAGUE_ID);
  const backendUrl = `${URL_STRING}${leagueId}`;

  // return the data without modification
  axios.post(backendUrl, req.body).then((response) => {
    res.send(response.data);
  });
});

app.post("/transactions", (req, res) => {
  // use leagueId passed via header
  const leagueId = req.header(LEAGUE_ID);
  const backendUrl = `${URL_STRING}${leagueId}`;

  // return the data without modification
  axios.post(backendUrl, req.body).then((response) => {
    res.send(response.data);
  });
});

// console text when app is running
app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening at http://localhost:${port}`);
});
