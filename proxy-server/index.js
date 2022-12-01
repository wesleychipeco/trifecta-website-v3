// packages import
const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
// enable CORS
app.use(cors());
app.use(bodyParser.json());
const port = 5000;

// basic string route to prevent Glitch error
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// the route we're working with
app.post("/basketball-standings", (req, res) => {
  const backendUrl =
    "https://www.fantrax.com/fxpa/req?leagueId=aznbe7wvl8esmlyo";
  // return the data without modification
  axios.post(backendUrl, req.body).then((response) => {
    // console.log("response", response.data);
    res.send(response.data);
  });
});

// console text when app is running
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
