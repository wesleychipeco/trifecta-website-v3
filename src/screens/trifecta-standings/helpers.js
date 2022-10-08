import { returnMongoCollection } from "../../database-management";
import { SeasonStatus } from "../../utils/years";

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

  if (basketballSeasonStatus === SeasonStatus.IN_PROGRESS) {
    const basketballStandings = await retrieveSportStandings(
      year,
      "basketball"
    );
    console.log("a", basketballStandings);
    trifectaStandingsArray.push(basketballStandings);
  } else {
    trifectaStandingsArray.push(null);
  }

  if (baseballSeasonStatus === SeasonStatus.IN_PROGRESS) {
    const baseballStandings = await retrieveSportStandings(year, "baseball");
    trifectaStandingsArray.push(baseballStandings);
    console.log("b", baseballStandings);
  } else {
    trifectaStandingsArray.push(null);
  }

  if (footballSeasonStatus === SeasonStatus.IN_PROGRESS) {
    const footballStandings = await retrieveSportStandings(year, "football");
    trifectaStandingsArray.push(footballStandings);
    console.log("c", footballStandings);
  } else {
    trifectaStandingsArray.push(null);
  }

  if (
    trifectaStandingsArray.length === 3 &&
    ownerIdsPerTeamArray &&
    ownerIdsOwnerNamesArray
  ) {
    // use tirfectaStandingsArray to total trifecta points
    sumTrifectaPoints(
      ownerIdsPerTeamArray,
      ownerIdsOwnerNamesArray,
      trifectaStandingsArray
    );
  } else {
    console.log("Error compiling trifectaStandingsSportsArray!");
  }
};

const retrieveSportStandings = async (year, sport) => {
  const collectionName = `${sport}Standings`;
  const collection = await returnMongoCollection(collectionName);

  const trifectaPointsKey = "trifectaStandings";

  const projection1 = trifectaPointsKey + ".ownerIds";
  const projection2 = trifectaPointsKey + ".totalTrifectaPoints";

  const sportStandingsResponse = await collection.find(
    { year },
    { projection: { [projection1]: 1, [projection2]: 1 } }
  );
  return sportStandingsResponse?.[0] ?? {};
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

  console.log("ownerids", ownerIdsPerTeamArray);
  ownerIdsPerTeamArray.forEach((ownersPerTeam) => {
    const teamTrifectaStandings = {};
    const totalTrifectaPointsArray = [];

    teamTrifectaStandings.ownerIds = ownersPerTeam;

    const ownerNames = returnOwnerNamesArray(
      ownerIdsOwnerNamesArray,
      ownersPerTeam
    );

    console.log("ownernames", ownerNames);
    /////////////////////////////// TODO CONTINUE HERE ///////////////////////
  });
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
