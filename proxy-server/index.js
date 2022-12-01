const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
const port = 5000;

// basic string route to prevent Glitch error
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/standings", (req, res) => {
  // use leagueId passed via header
  const leagueId = req.header("LeagueId");
  const backendUrl = `https://www.fantrax.com/fxpa/req?leagueId=${leagueId}`;

  // return the data without modification
  axios.post(backendUrl, req.body).then((response) => {
    res.send(response.data);
  });
});

// console text when app is running
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
