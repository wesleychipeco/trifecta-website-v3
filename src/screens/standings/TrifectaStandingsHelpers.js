import sum from "lodash/sum";
import format from "date-fns/format";
import max from "date-fns/max";
import { returnMongoCollection } from "database-management";
import { SeasonStatus } from "utils/years";

export const calculateTrifectaStandings = async (
  year,
  basketballSeasonStatus,
  baseballSeasonStatus,
  footballSeasonStatus
) => {
  const trifectaStandingsArray = [];
  const teamListsCollection = await returnMongoCollection("teamLists");
  const teamListsData = await teamListsCollection.find({ year });
  const ownerIdsPerTeamArray = teamListsData?.[0]?.teams ?? [];
  const ownerIdsCollection = await returnMongoCollection("ownerIds");
  const ownerIdsOwnerNamesArray = await ownerIdsCollection.find({});
  let basketballLastScraped = null;
  let baseballLastScraped = null;
  let footballLastScraped = null;

  if (basketballSeasonStatus !== SeasonStatus.NOT_STARTED) {
    const { standings: basketballStandings, lastScraped } =
      await retrieveSportStandings(year, "basketball");
    basketballLastScraped = lastScraped;
    trifectaStandingsArray.push(basketballStandings);
  } else {
    trifectaStandingsArray.push(null);
  }

  if (baseballSeasonStatus !== SeasonStatus.NOT_STARTED) {
    const { standings: baseballStandings, lastScraped } =
      await retrieveSportStandings(year, "baseball");
    baseballLastScraped = lastScraped;
    trifectaStandingsArray.push(baseballStandings);
  } else {
    trifectaStandingsArray.push(null);
  }

  if (footballSeasonStatus !== SeasonStatus.NOT_STARTED) {
    const { standings: footballStandings, lastScraped } =
      await retrieveSportStandings(year, "football");
    footballLastScraped = lastScraped;
    trifectaStandingsArray.push(footballStandings);
  } else {
    trifectaStandingsArray.push(null);
  }

  if (
    trifectaStandingsArray.length === 3 &&
    ownerIdsPerTeamArray &&
    ownerIdsOwnerNamesArray
  ) {
    const updatedAsOf = max([
      new Date(basketballLastScraped),
      new Date(baseballLastScraped),
      new Date(footballLastScraped),
    ]);

    // use tirfectaStandingsArray to total trifecta points
    return {
      trifectaStandings: sumTrifectaPoints(
        ownerIdsPerTeamArray,
        ownerIdsOwnerNamesArray,
        trifectaStandingsArray
      ),
      updatedAsOf: format(updatedAsOf, "MM/dd/yy hh:mm a"),
    };
  }

  console.log("Error compiling trifectaStandingsSportsArray!");
  return [];
};

const retrieveSportStandings = async (year, sport) => {
  const collectionName = `${sport}Standings`;
  const collection = await returnMongoCollection(collectionName);

  const trifectaPointsKey = "trifectaStandings";

  const projection1 = trifectaPointsKey + ".ownerIds";
  const projection2 = trifectaPointsKey + ".totalTrifectaPoints";
  const projection3 = "lastScraped";

  const sportStandingsResponse = await collection.find(
    { year },
    { projection: { [projection1]: 1, [projection2]: 1, [projection3]: 1 } }
  );

  return {
    standings: sportStandingsResponse?.[0]?.["trifectaStandings"] ?? {},
    lastScraped: sportStandingsResponse?.[0]?.["lastScraped"] ?? null,
  };
};

const atLeastOneInTheOther = (array1, array2) => {
  // for each in 1, check 2
  for (let i1 = 0; i1 < array1.length; i1++) {
    for (let i2 = 0; i2 < array2.length; i2++) {
      if (array1[i1] === array2[i2]) {
        return true;
      }
    }
  }
  return false;
};

const returnSportTrifectaPoints = (sportStandings, ownersPerTeam) => {
  return sportStandings.find((sportsTeam) =>
    atLeastOneInTheOther(sportsTeam.ownerIds, ownersPerTeam)
  ).totalTrifectaPoints;
};

const sumTrifectaPoints = (
  ownerIdsPerTeamArray,
  ownerIdsOwnerNamesArray,
  combinedArray
) => {
  const [basketballStandings, baseballStandings, footballStandings] =
    combinedArray;

  const nullPoints = 0;
  const nullPointsDisplay = "?";
  const trifectaStandings = [];

  ownerIdsPerTeamArray.forEach((ownersPerTeam) => {
    const teamTrifectaStandings = {};
    const totalTrifectaPointsArray = [];

    teamTrifectaStandings.ownerIds = ownersPerTeam;

    const ownerNames = returnOwnerNamesArray(
      ownerIdsOwnerNamesArray,
      ownersPerTeam
    );
    teamTrifectaStandings.ownerNames = ownerNames.join(", ");

    if (basketballStandings) {
      const basketballTrifectaPoints = returnSportTrifectaPoints(
        basketballStandings,
        ownersPerTeam
      );
      teamTrifectaStandings.basketballTrifectaPoints = basketballTrifectaPoints;
      totalTrifectaPointsArray.push(basketballTrifectaPoints);
    } else {
      teamTrifectaStandings.basketballTrifectaPoints = nullPointsDisplay;
      totalTrifectaPointsArray.push(nullPoints);
    }

    if (baseballStandings) {
      const baseballTrifectaPoints = returnSportTrifectaPoints(
        baseballStandings,
        ownersPerTeam
      );
      teamTrifectaStandings.baseballTrifectaPoints = baseballTrifectaPoints;
      totalTrifectaPointsArray.push(baseballTrifectaPoints);
    } else {
      teamTrifectaStandings.baseballTrifectaPoints = nullPointsDisplay;
      totalTrifectaPointsArray.push(nullPoints);
    }

    if (footballStandings) {
      const footballTrifectaPoints = returnSportTrifectaPoints(
        footballStandings,
        ownersPerTeam
      );
      teamTrifectaStandings.footballTrifectaPoints = footballTrifectaPoints;
      totalTrifectaPointsArray.push(footballTrifectaPoints);
    } else {
      teamTrifectaStandings.footballTrifectaPoints = nullPointsDisplay;
      totalTrifectaPointsArray.push(nullPoints);
    }

    teamTrifectaStandings.totalTrifectaPoints = sum(totalTrifectaPointsArray);
    trifectaStandings.push(teamTrifectaStandings);
  });
  console.log("retur", trifectaStandings);

  return trifectaStandings;
};

const returnOwnerNamesArray = (ownerIdsOwnerNamesArray, ownersPerTeam) => {
  const ownerNames = [];
  // for each ownerId per trifecta team
  ownersPerTeam.forEach((ownerId) => {
    // in the array of ownerId/ownerNames, find the object where the ownerIds are the same
    // and return the "ownerName" value from that object and add it to the array
    const ownerNameObject = ownerIdsOwnerNamesArray.find(
      (ownerIdsOwnerNames) => ownerIdsOwnerNames.ownerId === ownerId
    );
    if (ownerNameObject) {
      ownerNames.push(ownerNameObject.ownerName);
    }
  });

  // return the ownerNames array to be joined into string later
  return ownerNames;
};
