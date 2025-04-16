import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import flatten from "lodash/flatten.js";
import axios from "axios";
import cron from "node-cron";
import { returnMongoCollection } from "./utils/Database.js";
import {
  BASEBALL,
  BASKETBALL,
  FOOTBALL,
  GLOBAL_VARIABLES,
  HIGH_TO_LOW,
  NUMBER_OF_TEAMS,
  SPORTS_ARRAY,
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
import Bottleneck from "bottleneck";
import { addDays, addHours, format } from "date-fns";
import { TZDate } from "@date-fns/tz";

const app = express();
const corsOrigin = "*";

app.use(
  cors({
    origin: corsOrigin,
  })
);
app.use(bodyParser.json());
const port = 5000;
const localhostUrl = `http://localhost:${port}`;

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
  const updateDate = new Date().toLocaleString();
  const sportCollection = await returnMongoCollection(`${sport}Standings`);
  // console.log("Delete, then save to mongodb");
  await sportCollection.deleteMany({ year });
  await sportCollection.insertOne({
    year,
    lastScraped: updateDate,
    dynastyStandings,
    divisionStandings,
  });
  console.log(
    `Updated ${year} ${sport}'s standings successfully at ${updateDate}`
  );

  // return dynasty and division standings
  res.send({
    dynastyStandings,
    divisionStandings,
  });
});

// update dynasty standings
app.get("/api/dynasty-standings", async (req, res) => {
  const allGms = {};
  // loop through each sport
  for (let i = 0; i < SPORTS_ARRAY.length; i++) {
    const sport = SPORTS_ARRAY[i];
    const collectionName = `${sport}Standings`;
    const standingsCollection = await returnMongoCollection(collectionName);
    const standingsAllYears = await standingsCollection.find({});
    // filter out any test records
    const standingsAllYearsNoTest = standingsAllYears.filter(
      (record) =>
        !record.year.includes("backup") && !record.year.includes("test")
    );

    // loop through each year of sport
    for (let j = 0; j < standingsAllYearsNoTest.length; j++) {
      const record = standingsAllYearsNoTest[j];
      const { year, dynastyStandings } = record;
      const sportYear = `${sport}${year}`;

      // loop through each GM of year of sport
      for (let k = 0; k < dynastyStandings.length; k++) {
        const dynastyRecord = dynastyStandings[k];

        const { gm, totalDynastyPoints } = dynastyRecord;
        const currentGmObj = allGms[gm];
        if (!currentGmObj) {
          allGms[gm] = { [sportYear]: totalDynastyPoints };
        } else {
          allGms[gm] = { ...currentGmObj, [sportYear]: totalDynastyPoints };
        }
      }
    }
  }

  const { inSeasonLeagues } = app.locals.dynastyGlobalVariables;

  const dyanstyStandingsArray = [];
  // loop through each GM to sum points and re-arrange sports in correct order
  for (const eachGm in allGms) {
    const gmObj = allGms[eachGm];

    const sportYearArray = [];
    for (const sportYear in gmObj) {
      sportYearArray.push(sportYear);
    }

    // sort available sportYears by chronological order
    sportYearArray.sort((a, b) => {
      const { sport: sportA, year: yearA } = sportYearToSportAndYear(a);
      const { sport: sportB, year: yearB } = sportYearToSportAndYear(b);

      // prioritize year, then sport order
      if (yearA < yearB) {
        return -1;
      } else if (yearA > yearB) {
        return 1;
      } else {
        return SPORTS_ARRAY.indexOf(sportA) - SPORTS_ARRAY.indexOf(sportB);
      }
    });

    const newGmObj = {};
    newGmObj["gm"] = eachGm;
    let totalDyanstyPoints = 0;
    let totalDynastyPointsInSeason = 0;
    for (const sortedSportYear of sportYearArray) {
      const points = gmObj[sortedSportYear];
      newGmObj[sortedSportYear] = points;

      totalDynastyPointsInSeason += points;
      // only add to non-InSeason point total if no in-season
      if (!inSeasonLeagues.includes(sortedSportYear)) {
        totalDyanstyPoints += points;
      }
    }

    newGmObj["totalDynastyPoints"] = totalDyanstyPoints;
    newGmObj["totalDynastyPointsInSeason"] = totalDynastyPointsInSeason;

    dyanstyStandingsArray.push(newGmObj);
  }

  // delete, then save to mongodb
  const updateDate = new Date().toLocaleString();
  const sportCollection = await returnMongoCollection("dynastyStandings");
  // console.log("Delete, then save to mongodb");
  await sportCollection.deleteMany({ type: "dynastyStandings" });
  await sportCollection.insertOne({
    lastUpdated: updateDate,
    standings: dyanstyStandingsArray,
    type: "dynastyStandings",
  });
  console.log(
    `Updated Dynasty Standings standings successfully at ${updateDate}`
  );

  // return dynasty and division standings
  res.send(dyanstyStandingsArray);
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

  const updateDate = new Date().toLocaleString();
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
    allAssets[sport]["lastUpdated"] = updateDate;
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
    console.log(
      `Updated ${gmAbbreviation}'s assets successfully at ${updateDate}`
    );
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

  const updateDate = new Date().toLocaleString();
  const { modifiedCount } = await transactionsHistoryCollection.updateOne(
    { sportYear },
    {
      $set: {
        transactions: formattedTransactions,
        lastScraped: updateDate,
      },
    },
    {
      upsert: true,
    }
  );
  if (modifiedCount < 1) {
    console.error("Did NOT successfully update transactions history!");
  } else {
    console.log(
      `Updated ${year} ${sport}'s transactions successfully at ${updateDate}`
    );
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

  // apply throttling to api requests to Fantrax
  const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 10000, // how many milliseconds between each request
  });

  // place all team all player stats into promises to account for throttling
  const allTeamAllPlayerStatsPromises = allTeamIds.map(async (teamId) => {
    const fullGmName = allTeamIdsMappings[teamId];
    const gmName = extractBetweenParentheses(fullGmName);
    // console.log("teamId", teamId, "gmName", gmName);
    const apiResponse = await scrapePlayerStats(limiter, leagueId, teamId);

    // format stats depending on the sport
    const filteredPlayerStats = filterPlayers(apiResponse, sport);
    const rawPlayerStats = filteredPlayerStats.map((eachRow) => {
      switch (sport) {
        case BASKETBALL:
          return compileBasketballStats(eachRow, gmName, year);
        case BASEBALL:
          return compileBaseballStats(eachRow, gmName, year);
        case FOOTBALL:
          return compileFootballStats(eachRow, gmName, year);
        default:
          return [];
      }
    });

    return rawPlayerStats.filter((player) => player != null);
  });

  // resolve promises
  const allTeamAllPlayerStats = await Promise.all(
    allTeamAllPlayerStatsPromises
  );
  // console.log("allTeamAllPlayerStats", allTeamAllPlayerStats);

  const playerStats = flatten(allTeamAllPlayerStats);

  // Update record in MongoDB
  const updateDate = new Date().toLocaleString();
  const statsCollection = await returnMongoCollection("playerStats");
  await statsCollection.deleteOne({ sport, year });
  await statsCollection.insertOne({
    sport,
    year,
    lastScraped: updateDate,
    playerStats,
  });
  console.log(`Updated ${year} ${sport}'s player stats at ${updateDate}`);

  res.send(playerStats);
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
  const updateDate = new Date().toLocaleString();
  await statsCollection.deleteOne({ sport, year: "total" });
  await statsCollection.insertOne({
    sport,
    year: "total",
    lastScraped: updateDate,
    playerStats: totalPlayerStatsArray,
  });
  console.log(`Updated total player stats for ${sport} at ${updateDate}`);

  res.send(totalPlayerStatsArray);
});

// create league event for the calendar
app.post("/api/commissioner/league-event", async (req, res) => {
  const { title, startDate, startHourInMilitary, durationHours, description } =
    req.body;

  // validate required fields for payload
  const missingRequiredFields = [];
  if (!title) {
    missingRequiredFields.push("title");
  }
  if (!startDate) {
    missingRequiredFields.push("startDate");
  }
  if (!startHourInMilitary) {
    missingRequiredFields.push("startHourInMilitary");
  }
  if (!durationHours) {
    missingRequiredFields.push("durationHours");
  }
  if (!description) {
    missingRequiredFields.push("description");
  }
  if (missingRequiredFields.length > 0) {
    return res
      .status(400)
      .send(
        `Required fields missing from payload: ${missingRequiredFields.join(
          ", "
        )}`
      );
  }

  // parse startDate into individual numbers
  const [startMonth, startDay, startYear] = startDate.split("/");
  // validate fields for acceptable inputs
  if (!startMonth || !startDay || !startYear) {
    res
      .status(400)
      .send("startDate field incorrectly formatted. Send in 01/01/2025 format");
  }
  if (startHourInMilitary < 0 || startHourInMilitary > 23) {
    res
      .status(400)
      .send("startHourInMilitary field needs to be between 0 and 23");
  }
  if (isNaN(durationHours)) {
    res.status(400).send("durationHours field needs to be a valid number");
  }

  const timezone = "America/Los_Angeles";
  const startOfDay = new TZDate(
    Number(startYear),
    Number(startMonth) - 1,
    Number(startDay),
    timezone
  );
  const startDateTime = addHours(startOfDay, startHourInMilitary);
  const endDateTime = addHours(startDateTime, durationHours);

  const formatString = "yyyy-MM-dd'T'HH:mm:ssXXX";
  const startDateTimeFormatted = format(startDateTime, formatString);
  const endDateTimeFormatted = format(endDateTime, formatString);

  const leagueEventObj = {
    title,
    description,
    start: startDateTimeFormatted,
    end: endDateTimeFormatted,
  };

  const leagueEventsCollection = await returnMongoCollection("leagueCalendar");
  leagueEventsCollection.insertOne(leagueEventObj);

  res.send(leagueEventObj);
});

// create league announcement (include sending email/push notification?)
app.post("/api/commissioner/league-announcement", async (req, res) => {
  const { title, startDate, durationDays, notify } = req.body;

  // validate required fields for payload
  const missingRequiredFields = [];
  if (!title) {
    missingRequiredFields.push("title");
  }
  if (!startDate) {
    missingRequiredFields.push("startDate");
  }
  if (!durationDays) {
    missingRequiredFields.push("durationDays");
  }
  const notifyBool = notify ? notify : false;

  if (missingRequiredFields.length > 0) {
    return res
      .status(400)
      .send(
        `Required fields missing from payload: ${missingRequiredFields.join(
          ", "
        )}`
      );
  }

  // parse startDate into individual numbers
  const [startMonth, startDay, startYear] = startDate.split("/");
  // validate fields for acceptable inputs
  if (!startMonth || !startDay || !startYear) {
    res
      .status(400)
      .send("startDate field incorrectly formatted. Send in 01/01/2025 format");
  }
  if (isNaN(durationDays)) {
    res.status(400).send("durationDays field needs to be a valid number");
  }

  const timezone = "America/Los_Angeles";
  const startDateTime = new TZDate(
    Number(startYear),
    Number(startMonth) - 1,
    Number(startDay),
    timezone
  );
  const endDateTime = addDays(startDateTime, durationDays + 1); // add 1 day because will expire at midnight

  const formatString = "yyyy-MM-dd'T'HH:mm:ssXXX";
  const startDateTimeFormatted = format(startDateTime, formatString);
  const endDateTimeFormatted = format(endDateTime, formatString);

  const leagueAnnouncementObj = {
    title,
    startDate: startDateTimeFormatted,
    endDate: endDateTimeFormatted,
    notify: notifyBool,
  };

  const leagueEventsCollection = await returnMongoCollection(
    "leagueAnnouncements"
  );
  leagueEventsCollection.insertOne(leagueAnnouncementObj);

  res.send(leagueAnnouncementObj);
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
    console.log(`Server listening at ${localhostUrl}`);

    // start cron jobs
    console.log("Starting cron jobs for data refresh...");
    sportStandingsRefreshCronJob();
    dyanstyStandingsRefreshCronJob();
    playerStatsRefreshCronJob();
    totalPlayerStatsRefreshCronJob();
    rostersRefreshCronJob();
    transactionsRefreshCronJob();
  });
});

const sportStandingsRefreshCronJob = () => {
  const SPORT_STANDINGS_REFRESH_CRON_SCHEDULE = "0 1 * * *"; // 1am every day

  // refresh all in season sport standings
  cron.schedule(SPORT_STANDINGS_REFRESH_CRON_SCHEDULE, async () => {
    const { inSeasonLeagues } = app.locals.dynastyGlobalVariables;
    const cronUpdateDate = new Date().toLocaleString();
    for (let i = 0; i < inSeasonLeagues.length; i++) {
      const sportYear = inSeasonLeagues[i];
      const { sport, year } = sportYearToSportAndYear(sportYear);
      const cronUrl = `${localhostUrl}/api/standings/${sport}/${year}`;
      const response = await axios.get(cronUrl);
      if (response.status === 200) {
        console.log(
          `Successful cron job standings refresh for ${year} ${sport} at ${cronUpdateDate}`
        );
      } else {
        console.error(
          `FAILED cron job standings refresh for ${year} ${sport} at ${cronUpdateDate}`
        );
      }
    }

    console.log("============================================================");
  });
};

const dyanstyStandingsRefreshCronJob = () => {
  const DYNASTY_STANDINGS_REFRESH_CRON_SCHEDULE = "10 1 * * *"; // 1:10am every day
  cron.schedule(DYNASTY_STANDINGS_REFRESH_CRON_SCHEDULE, async () => {
    const cronUpdateDate = new Date().toLocaleString();
    const cronUrl = `${localhostUrl}/api/dynasty-standings`;
    const response = await axios.get(cronUrl);
    if (response.status === 200) {
      console.log(
        `Successful cron job dynasty standings refresh at ${cronUpdateDate}`
      );
    } else {
      console.error(
        `FAILED cron job dynasty standings refresh at ${cronUpdateDate}`
      );
    }
  });
};

const rostersRefreshCronJob = () => {
  const ROSTERS_REFRESH_CRON_SCHEDULE = "0 2 * * *"; // 2:00am every day
  // apply throttling to api requests to Fantrax
  const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 10000, // how many milliseconds between each request
  });

  cron.schedule(ROSTERS_REFRESH_CRON_SCHEDULE, async () => {
    const gmsCollection = await returnMongoCollection("gms");
    const gmsData = await gmsCollection.find({});
    const gmsAbbreviationArray = gmsData.map((gm) => gm?.abbreviation ?? "");

    gmsAbbreviationArray.map((gmAbbreviation) => {
      const cronUpdateDate = new Date().toLocaleString();
      const cronUrl = `${localhostUrl}/api/rosters/${gmAbbreviation}`;
      limiter.schedule(async () => {
        const response = await axios.get(cronUrl);
        if (response.status === 200) {
          console.log(
            `Successful cron job rosters refresh for ${gmAbbreviation} at ${cronUpdateDate}`
          );
        } else {
          console.error(
            `FAILED cron job rosters refresh for ${gmAbbreviation} at ${cronUpdateDate}`
          );
        }
        console.log("------------------------------");
      });
    });

    console.log("============================================================");
  });
};

const transactionsRefreshCronJob = () => {
  const TRANSACTIONS_REFRESH__CRON_SCHEDULE = "10 8 * * *"; // 8:10am every day (to allow for 8am transactions execution)

  cron.schedule(TRANSACTIONS_REFRESH__CRON_SCHEDULE, async () => {
    const { inSeasonLeagues } = app.locals.dynastyGlobalVariables;
    const cronUpdateDate = new Date().toLocaleString();
    for (let i = 0; i < inSeasonLeagues.length; i++) {
      const sportYear = inSeasonLeagues[i];
      const { sport, year } = sportYearToSportAndYear(sportYear);
      const cronUrl = `${localhostUrl}/api/transactions/${sport}/${year}`;
      const response = await axios.get(cronUrl);
      if (response.status === 200) {
        console.log(
          `Successful cron job transactions refresh for ${year} ${sport} at ${cronUpdateDate}`
        );
      } else {
        console.error(
          `FAILED cron job transactions refresh for ${year} ${sport} at ${cronUpdateDate}`
        );
      }
    }

    console.log("============================================================");
  });
};

const playerStatsRefreshCronJob = () => {
  const PLAYER_STATS_REFRESH__CRON_SCHEDULE = "30 1 * * *"; // 1:30am every day

  cron.schedule(PLAYER_STATS_REFRESH__CRON_SCHEDULE, async () => {
    const { inSeasonLeagues } = app.locals.dynastyGlobalVariables;
    const cronUpdateDate = new Date().toLocaleString();
    for (let i = 0; i < inSeasonLeagues.length; i++) {
      const sportYear = inSeasonLeagues[i];
      const { sport, year } = sportYearToSportAndYear(sportYear);
      const cronUrl = `${localhostUrl}/api/player-stats/${sport}/${year}`;
      const response = await axios.get(cronUrl);
      if (response.status === 200) {
        console.log(
          `Successful cron job player stats refresh for ${year} ${sport} at ${cronUpdateDate}`
        );
      } else {
        console.error(
          `FAILED cron job player stats refresh for ${year} ${sport} at ${cronUpdateDate}`
        );
      }
    }

    console.log("============================================================");
  });
};

const totalPlayerStatsRefreshCronJob = () => {
  const TOTAL_PLAYER_STATS_RERESH_CRON_SCHEDULE = "50 1 * * *"; // 1:50am every day

  cron.schedule(TOTAL_PLAYER_STATS_RERESH_CRON_SCHEDULE, async () => {
    const { inSeasonLeagues } = app.locals.dynastyGlobalVariables;
    const cronUpdateDate = new Date().toLocaleString();
    for (let i = 0; i < inSeasonLeagues.length; i++) {
      const sportYear = inSeasonLeagues[i];
      const { sport } = sportYearToSportAndYear(sportYear);
      const cronUrl = `${localhostUrl}/api/total-player-stats/${sport}`;
      const response = await axios.get(cronUrl);
      if (response.status === 200) {
        console.log(
          `Successful cron job total player stats refresh for ${sport} at ${cronUpdateDate}`
        );
      } else {
        console.error(
          `FAILED cron job total player stats refresh for ${sport} at ${cronUpdateDate}`
        );
      }
    }

    console.log("============================================================");
  });
};
