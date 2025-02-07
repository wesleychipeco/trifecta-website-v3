import express from "express";
import cors from "cors";
import axios from "axios";
import bodyParser from "body-parser";
import { returnMongoCollection } from "./utils/Database.js";
import {
  GLOBAL_VARIABLES,
  HIGH_TO_LOW,
  NUMBER_OF_TEAMS,
} from "./NewConstants.js";
import {
  filterForStandings,
  formatScrapedStandings,
  scrapeStandings,
} from "./standings/StandingsHelpers.js";
import { assignRankPoints } from "./utils/StandingsUtils.js";
import { addKeyValueToEachObjectInArray } from "./utils/ArraysUtils.js";

const app = express();
const LEAGUE_ID = "LeagueId";
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

// update sport standings
app.get("/api/standings/:sport/:year", async (req, res) => {
  // retrieve sport and year from path params
  const { sport, year } = req.params;
  const sportYear = `${sport}${year}`;

  // retrieve leagueId from global variables initialized on startup
  const { leagueIdMappings } = app.locals.dynastyGlobalVariables;
  const leagueId = leagueIdMappings[sportYear];

  // retrieve gm names to ids mappings from MongoDB
  const gmNamesIdsCollection = await returnMongoCollection("gmNamesIds");
  const gmNamesIds = await gmNamesIdsCollection.find({ leagueId });
  const gmNamesIdsMapping = gmNamesIds?.[0]?.mappings ?? {};

  // scrape standings from Fantrax
  const apiResponse = await scrapeStandings(leagueId);

  // filter and enrich standings with custom fields
  const tableStandings = await filterForStandings(
    apiResponse.data.responses[0].data.tableList
  );
  const divisionStandings = formatScrapedStandings(
    tableStandings,
    gmNamesIdsMapping,
    sport
  );
  const dynastyStandingsNoPlayoffs = assignRankPoints(
    Object.values(divisionStandings).flat(1),
    "winPer",
    HIGH_TO_LOW,
    "totalDynastyPoints",
    NUMBER_OF_TEAMS,
    1
  );
  const dynastyStandings = addKeyValueToEachObjectInArray(
    dynastyStandingsNoPlayoffs,
    { dynastyPoints: "totalDynastyPoints" },
    { playoffPoints: 0 }
  );

  // delete, then save to mongodb
  const sportCollection = await returnMongoCollection(`${sport}Standings`);
  console.log("Delete, then save to mongodb");
  sportCollection.deleteMany({ year });
  await sportCollection.insertOne({
    year,
    lastScraped: new Date().toISOString(),
    dynastyStandings,
    divisionStandings,
  });

  // return dynasty and division standings back to react client-side
  res.send({
    dynastyStandings,
    divisionStandings,
  });
});

// scrape standings from Fantrax
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

app.post("/player-stats", (req, res) => {
  // use leagueId passed via header
  const leagueId = req.header(LEAGUE_ID);
  const backendUrl = `${URL_STRING}${leagueId}`;

  // return the data without modification
  axios.post(backendUrl, req.body).then((response) => {
    res.send(response.data);
  });
});

// initialize global variables from MongoDB for backend use
const initializeGlobalVariables = async () => {
  const gvCollection = await returnMongoCollection(GLOBAL_VARIABLES);
  const data = await gvCollection.find({});
  const object = data[0];
  const { trifecta: trifectaObject, dynasty: dynastyObject } = object;
  app.locals.dynastyGlobalVariables = dynastyObject;
};

initializeGlobalVariables().then(() => {
  // console text when app is running
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});
