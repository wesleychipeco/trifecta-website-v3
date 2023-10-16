import { invert } from "lodash";

const BASKETBALL_STARTUP_DRAFT_ROUNDS = 15;
const BASEBALL_STARTUP_DRAFT_ROUNDS = 30;
const FOOTBALL_STARTUP_DRAFT_ROUNDS = 18;

const BASKETBALL_SUPPLEMENTAL_DRAFT_ROUNDS = 4;
const BASEBALL_SUPPLEMENTAL_DRAFT_ROUNDS = 7;
const FOOTBALL_SUPPLEMENTAL_DRAFT_ROUNDS = 5;

const ROUND_REVERSAL = 5;
const NUMBER_OF_TEAMS = 16;

const assignDraftSlots = (sport, draftSlotAssignments, isStartup = false) => {
  const byPickNumbersDraftSlotAssignments = invert(draftSlotAssignments);
  const orderedDraftSlotNumbers = Object.keys(
    byPickNumbersDraftSlotAssignments
  ).sort((a, b) => a - b);
  const orderedAbbreviations = orderedDraftSlotNumbers.map(
    (pickNumber) => byPickNumbersDraftSlotAssignments[pickNumber]
  );

  let startupRounds;
  switch (sport) {
    case "basketball":
      startupRounds = BASKETBALL_STARTUP_DRAFT_ROUNDS;
      break;
    case "baseball":
      startupRounds = BASEBALL_STARTUP_DRAFT_ROUNDS;
      break;
    case "football":
      startupRounds = FOOTBALL_STARTUP_DRAFT_ROUNDS;
      break;
    default:
      startupRounds = 0;
      break;
  }

  const arrayOfRounds = [];
  for (let round = 1; round <= startupRounds; round++) {
    let isEvenRound = round % 2 === 0;

    // reverse even & odd after round 5 for startup drafts
    if (round >= ROUND_REVERSAL && isStartup) {
      isEvenRound = !isEvenRound;
    }

    const arrayOfPicks = [];
    for (let pickNumber = 1; pickNumber <= NUMBER_OF_TEAMS; pickNumber++) {
      const arrayIndex = pickNumber - 1;
      const abbreviation = orderedAbbreviations[arrayIndex];

      const pickInRound = isEvenRound
        ? NUMBER_OF_TEAMS - pickNumber + 1
        : pickNumber;

      const overallPick = isEvenRound
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
  return assignDraftSlots(sport, draftSlotAssignments, true);
};

export const assignSupplementaryDraftSlots = (sport, draftSlotAssignments) => {
  return assignDraftSlots(sport, draftSlotAssignments, false);
};
