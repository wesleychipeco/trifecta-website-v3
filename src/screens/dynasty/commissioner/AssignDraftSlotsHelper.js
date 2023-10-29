import { invert } from "lodash";
import { returnMongoCollection } from "database-management";
import { NUMBER_OF_TEAMS } from "Constants";

export const BASKETBALL_STARTUP_DRAFT_ROUNDS = 15;
export const BASEBALL_STARTUP_DRAFT_ROUNDS = 30;
export const FOOTBALL_STARTUP_DRAFT_ROUNDS = 18;

export const BASKETBALL_SUPPLEMENTAL_DRAFT_ROUNDS = 4;
export const BASEBALL_SUPPLEMENTAL_DRAFT_ROUNDS = 7;
export const FOOTBALL_SUPPLEMENTAL_DRAFT_ROUNDS = 5;

export const SPORTS_ARRAY = ["basketball", "baseball", "football"];
export const ROUND_REVERSAL = 5;

export const createDraftGrid = (
  sport,
  draftSlotAssignments,
  isStartup = false
) => {
  const byPickNumbersDraftSlotAssignments = invert(draftSlotAssignments);
  const orderedDraftSlotNumbers = Object.keys(
    byPickNumbersDraftSlotAssignments
  ).sort((a, b) => a - b);
  const orderedAbbreviations = orderedDraftSlotNumbers.map(
    (pickNumber) => byPickNumbersDraftSlotAssignments[pickNumber]
  );

  let numberOfRounds;
  switch (sport) {
    case "basketball":
      numberOfRounds = isStartup
        ? BASKETBALL_STARTUP_DRAFT_ROUNDS
        : BASKETBALL_SUPPLEMENTAL_DRAFT_ROUNDS;
      break;
    case "baseball":
      numberOfRounds = isStartup
        ? BASEBALL_STARTUP_DRAFT_ROUNDS
        : BASEBALL_SUPPLEMENTAL_DRAFT_ROUNDS;
      break;
    case "football":
      numberOfRounds = isStartup
        ? FOOTBALL_STARTUP_DRAFT_ROUNDS
        : FOOTBALL_SUPPLEMENTAL_DRAFT_ROUNDS;
      break;
    default:
      numberOfRounds = 0;
      break;
  }

  const arrayOfRounds = [];
  for (let round = 1; round <= numberOfRounds; round++) {
    let isEvenRound = round % 2 === 0;

    // reverse even & odd after round 5 for startup drafts
    if (round >= ROUND_REVERSAL && isStartup) {
      isEvenRound = !isEvenRound;
    }

    const arrayOfPicks = [];
    for (let pickNumber = 1; pickNumber <= NUMBER_OF_TEAMS; pickNumber++) {
      const arrayIndex = pickNumber - 1;
      const abbreviation = orderedAbbreviations[arrayIndex];

      const pickInRound =
        isEvenRound && isStartup
          ? NUMBER_OF_TEAMS - pickNumber + 1
          : pickNumber;

      const overallPick =
        isEvenRound && isStartup
          ? round * NUMBER_OF_TEAMS - pickNumber + 1
          : (round - 1) * NUMBER_OF_TEAMS + pickNumber;

      // console.log(
      //   `(${abbreviation}) Slot #${pickNumber}: ${round}-${pickInRound} (${overallPick})`
      // );
      const pickObject = {
        fantasyTeam: abbreviation,
        overallPick: overallPick,
        round,
        pick: pickInRound,
      };

      arrayOfPicks.push(pickObject);
    }
    // console.log("====================================");
    arrayOfRounds.push(arrayOfPicks);
  }

  // console.log("GRID!", arrayOfRounds);
  return arrayOfRounds;
};

export const assignStartupDraftSlots = (sport, draftSlotAssignments) => {
  return createDraftGrid(sport, draftSlotAssignments, true);
};

export const assignSupplementalDraftSlots = async (
  era,
  sport,
  year,
  draftSlotAssignments
) => {
  const draftGrid = createDraftGrid(sport, draftSlotAssignments, false);

  const draftsCollection = await returnMongoCollection("drafts", era);
  const draft = await draftsCollection.find({ type: `${sport}-${year}` });
  const draftPicks = draft?.[0]?.picks ?? [];

  // create list of draft picks that are are traded
  const tradedDraftPicksArray = [];
  for (let i = 0; i < draftPicks.length; i++) {
    const gmPicks = draftPicks[i];
    for (let j = 0; j < gmPicks.length; j++) {
      const eachPick = gmPicks[j];
      if (eachPick.tradedTo) {
        tradedDraftPicksArray.push({
          fantasyTeam: eachPick.fantasyTeam,
          tradedTo: eachPick.tradedTo,
          round: eachPick.pick.charAt(0),
        });
      }
    }
  }
  // console.log("tradedDraftPicksArray", tradedDraftPicksArray);

  for (let x = 0; x < tradedDraftPicksArray.length; x++) {
    const tradedPickObject = tradedDraftPicksArray[x];

    const tradedPickRound = Number(tradedPickObject.round);
    const roundIndex = tradedPickRound - 1;

    const originatingTeamPickIndex =
      draftSlotAssignments[tradedPickObject.fantasyTeam] - 1;

    // console.log(
    //   "pick in question",
    //   startingDraftGrid[roundIndex][originatingTeamPickIndex]
    // );

    draftGrid[roundIndex][originatingTeamPickIndex]["tradedTo"] =
      tradedPickObject.tradedTo;
  }

  return draftGrid;
};
