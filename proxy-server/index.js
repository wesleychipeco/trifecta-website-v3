import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import flatten from "lodash/flatten.js";
import { returnMongoCollection } from "./utils/Database.js";
import {
  GLOBAL_VARIABLES,
  HIGH_TO_LOW,
  NUMBER_OF_TEAMS,
} from "./APIConstants.js";
import {
  filterForStandings,
  formatScrapedStandings,
  scrapeStandings,
} from "./standings/StandingsHelpers.js";
import { assignRankPoints } from "./utils/StandingsUtils.js";
import { addKeyValueToEachObjectInArray } from "./utils/ArraysUtils.js";
import {
  addDefaultDraftPicks,
  formatPlayers,
  retrieveFaab,
  scrapeRosters,
} from "./rosters/RostersHelper.js";
import { sportYearToSportAndYear } from "./utils/YearsUtils.js";
import {
  formatTransactions,
  scrapeTransactions,
} from "./transactions/TransactionsHelpers.js";
import {
  compileBaseballStats,
  compileBasketballStats,
  compileFootballStats,
  filterPlayers,
  scrapePlayerStats,
  totalPlayerStatsOverAllYears,
} from "./player-stats/PlayerStatsHelper.js";
import { extractBetweenParentheses } from "./utils/StringsUtils.js";

const app = express();
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

// update sport standings for a sport and year
app.get("/api/standings/:sport/:year", async (req, res) => {
  // retrieve sport and year from path params
  const { sport, year } = req.params;
  const sportYear = `${sport}${year}`;

  // retrieve leagueId
  const leagueId = leagueIdFromSportYear(sportYear);

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
  // console.log("Delete, then save to mongodb");
  sportCollection.deleteMany({ year });
  await sportCollection.insertOne({
    year,
    lastScraped: new Date().toISOString(),
    dynastyStandings,
    divisionStandings,
  });
  console.log(`Updated ${year} ${sport}'s standings successfully`);

  // return dynasty and division standings
  res.send({
    dynastyStandings,
    divisionStandings,
  });
});

// update rosters for trade asset dashboard for a specific GM
app.get("/api/rosters/:gmAbbreviation", async (req, res) => {
  // retrieve gm abbreviation from path params
  const { gmAbbreviation } = req.params;

  // retrieve gm data
  const gmCollection = await returnMongoCollection("gms");
  const gmData = await gmCollection.find({ abbreviation: gmAbbreviation });
  const gmObject = gmData?.[0] ?? {};

  // retrieve currentRosterLeagues from initialized global variables
  const { currentRosterLeagues } = app.locals.dynastyGlobalVariables;

  const allAssets = {};
  // loop through season with updated rosters to scrape
  for (let i = 0; i < currentRosterLeagues.length; i++) {
    const sportYear = currentRosterLeagues[i];
    const { sport } = sportYearToSportAndYear(sportYear);

    // retrieve leagueId
    const leagueId = leagueIdFromSportYear(sportYear);
    // retrieve teamId
    const teamId = gmObject.mappings[sportYear];

    // scrape and format roster and faab from Fantrax
    const rawData = await scrapeRosters(leagueId, teamId);
    const formattedPlayers = formatPlayers(rawData);
    const faab = retrieveFaab(rawData);
    allAssets[sport] = {
      players: formattedPlayers,
      faab,
    };

    // copy and paste over existing draft picks
    let draftPicks = gmData?.[0]?.assets?.[sport]?.draftPicks ?? "need";
    if (draftPicks === "need") {
      draftPicks = addDefaultDraftPicks(sport);
    }
    allAssets[sport]["draftPicks"] = draftPicks;
    allAssets[sport]["lastUpdated"] = new Date().toISOString();
  }
  // console.log("allAssets!", allAssets);

  // update MongoDB
  const { modifiedCount } = await gmCollection.updateOne(
    { abbreviation: gmAbbreviation },
    { $set: { assets: allAssets } }
  );
  if (modifiedCount < 1) {
    console.error("Did NOT successfully update assets!");
  } else {
    console.log(`Updated ${gmAbbreviation}'s assets successfully`);
  }

  // return allAssets
  res.send(allAssets);
});

// update transactions history for a sport and year
app.get("/api/transactions/:sport/:year", async (req, res) => {
  // retrieve sport and year from path params
  const { sport, year } = req.params;
  const sportYear = `${sport}${year}`;

  // retrieve leagueId
  const leagueId = leagueIdFromSportYear(sportYear);

  // retrieve gm names to ids mappings from MongoDB
  const gmNamesIdsCollection = await returnMongoCollection("gmNamesIds");
  const gmNamesIds = await gmNamesIdsCollection.find({ leagueId });
  const gmNamesIdsMapping = gmNamesIds?.[0]?.mappings ?? {};

  // scrape and format transactions history
  const apiResponse = await scrapeTransactions(leagueId);
  const tableRows = apiResponse?.data?.responses?.[0]?.data?.table?.rows ?? [];
  const formattedTransactions = formatTransactions(
    tableRows,
    gmNamesIdsMapping
  );
  // console.log("formattedTransactions", formattedTransactions);

  // update MongoDB
  const transactionsHistoryCollection = await returnMongoCollection(
    "transactionsHistory"
  );
  const currentSportYearData = await transactionsHistoryCollection.find({
    sportYear,
  });
  if (currentSportYearData.length === 0) {
    console.log(`No ${year} ${sport} MongoDB document. Creating...`);
    await transactionsHistoryCollection.insertOne({
      sportYear,
      transactions: [],
      lastScraped: "",
    });
  }

  const { modifiedCount } = await transactionsHistoryCollection.updateOne(
    { sportYear },
    {
      $set: {
        transactions: formattedTransactions,
        lastScraped: new Date().toISOString(),
      },
    },
    {
      upsert: true,
    }
  );
  if (modifiedCount < 1) {
    console.error("Did NOT successfully update transactions history!");
  } else {
    console.log(`Updated ${year} ${sport}'s transactions successfully`);
  }

  res.send(formattedTransactions);
});

// update player stats per sport and year
app.get("/api/player-stats/:sport/:year", async (req, res) => {
  // retrieve sport and year from path params
  const { sport, year } = req.params;
  const sportYear = `${sport}${year}`;

  // retrieve leagueId
  const leagueId = leagueIdFromSportYear(sportYear);

  // retrieve all teamIds
  const gmNamesIdsCollection = await returnMongoCollection("gmNamesIds");
  const allTeamIdsData = await gmNamesIdsCollection.find({ leagueId });
  const allTeamIdsMappings = allTeamIdsData?.[0]?.mappings ?? [];
  const allTeamIds = Object.keys(allTeamIdsMappings);

  const allTeamAllPlayerStats = [];
  for (let i = 0; i < allTeamIds.length; i++) {
    const teamId = allTeamIds[i];
    const fullGmName = allTeamIdsMappings[teamId];
    const gmName = extractBetweenParentheses(fullGmName);
    // console.log("teamId", teamId, "gmName", gmName);

    // retrieve player stats from Fantrax
    const apiResponse = await scrapePlayerStats(leagueId, teamId);

    // format stats depending on the sport
    const filteredPlayerStats = filterPlayers(apiResponse, sport);
    const rawPlayerStats = filteredPlayerStats.map((eachRow) => {
      switch (sport) {
        case "basketball":
          return compileBasketballStats(eachRow, gmName, year);
        case "baseball":
          return compileBaseballStats(eachRow, gmName, year);
        case "football":
          return compileFootballStats(eachRow, gmName, year);
        default:
          return [];
      }
    });
    const trimmedPlayerStats = rawPlayerStats.filter(
      (player) => player != null
    );
    allTeamAllPlayerStats.push(trimmedPlayerStats);
  }
  // console.log("allTeamAllPlayerStats", allTeamAllPlayerStats);
  const playerStats = flatten(allTeamAllPlayerStats);

  // Update record in MongoDB
  const statsCollection = await returnMongoCollection("playerStats");
  await statsCollection.deleteOne({ sport, year });
  await statsCollection.insertOne({
    sport,
    year,
    lastScraped: new Date().toLocaleString(),
    playerStats,
  });
  console.log(`Updated ${year} ${sport}'s player stats`);

  res.send(allTeamAllPlayerStats);
});

// update aggregated player stats for a sport
app.get("/api/total-player-stats/:sport", async (req, res) => {
  // retrieve sport and year from path params
  const { sport } = req.params;

  // fetch all records per sport in MongoDB
  const statsCollection = await returnMongoCollection("playerStats");
  const allPlayerStatsData = await statsCollection.find({ sport });
  const allPlayerStatsWithoutTotal = allPlayerStatsData.filter(
    (eachRecord) => eachRecord.year !== "total"
  );

  // create flattened stats array for each player with each fantasy team, each season
  const allPlayerStats = [];
  for (let i = 0; i < allPlayerStatsWithoutTotal.length; i++) {
    const eachYearObject = allPlayerStatsWithoutTotal[i];
    const { playerStats } = eachYearObject;
    allPlayerStats.push(playerStats);
  }
  const flattenAllPlayerStats = flatten(allPlayerStats);

  // create unique total stats record for each player+fantasy team combination
  const totalPlayerStatsArray = totalPlayerStatsOverAllYears(
    sport,
    flattenAllPlayerStats
  );

  // Update record in MongoDB
  await statsCollection.deleteOne({ sport, year: "total" });
  await statsCollection.insertOne({
    sport,
    year: "total",
    lastScraped: new Date().toLocaleString(),
    playerStats: totalPlayerStatsArray,
  });

  res.send(totalPlayerStatsArray);
});

// initialize global variables from MongoDB for backend use
const initializeGlobalVariables = async () => {
  const gvCollection = await returnMongoCollection(GLOBAL_VARIABLES);
  const data = await gvCollection.find({});
  const object = data[0];
  const { trifecta: trifectaObject, dynasty: dynastyObject } = object;
  app.locals.dynastyGlobalVariables = dynastyObject;
};

// retrieve leagueId from sport, year combo from initialized global variables
const leagueIdFromSportYear = (sportYear) => {
  const { leagueIdMappings } = app.locals.dynastyGlobalVariables;
  return leagueIdMappings[sportYear];
};

initializeGlobalVariables().then(() => {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});
