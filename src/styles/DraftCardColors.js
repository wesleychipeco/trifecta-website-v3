// Fantrax Colors

// Basketball
const BASKETBALL_CENTER = "rgba(54, 211, 153, 0.66)";
const BASKETBALL_POWER_FORWARD = "rgba(192, 132, 252, 0.66)";
const BASKETBALL_SMALL_FORWARD = "rgba(89, 171, 252, 0.66)";
const BASKETBALL_SHOOTING_GUARD = "rgba(244, 105, 125, 0.66)";
const BASKETBALL_POINT_GUARD = "rgba(251, 146, 60, 0.66)";

// Baseball
const BASEBALL_CATCHER = "rgba(45, 212, 191, 0.84)";
const BASEBALL_FIRST_BASE = "rgba(251, 146, 60, 0.5)";
const BASEBALL_SECOND_BASE = "rgba(251, 146, 60, 0.84)";
const BASEBALL_THIRD_BASE = "rgba(244, 105, 125, 0.5)";
const BASEBALL_SHORTSTOP = "rgba(192, 132, 252, 0.84)";
const BASEBALL_OUTFIELD = "rgba(89, 171, 252, 0.84)";
const BASEBALL_STARTING_PITCHER = "rgb(251, 189, 35)";
const BASEBALL_RELIEF_PITCHER = "rgba(251, 189, 35, 0.66)";

// Football
const FOOTBALL_QUARTERBACK = "rgba(251, 146, 60, 0.66)";
const FOOTBALL_RUNNING_BACK = "rgba(244, 105, 125, 0.84)";
const FOOTBALL_WIDE_RECEIVER = "rgba(89, 171, 252, 0.5)";
const FOOTBALL_TIGHT_END = "rgba(192, 132, 252, 0.84)";
const FOOTBALL_KICKER = "rgba(54, 211, 153, 0.84)";
const FOOTBALL_DST = "rgba(244, 105, 125, 0.5)";

export const colorPositionMatcher = (sport, position) => {
  let color = "";
  switch (sport) {
    case "basketball":
      switch (position) {
        case "C":
          color = BASKETBALL_CENTER;
          break;
        case "PF":
          color = BASKETBALL_POWER_FORWARD;
          break;
        case "SF":
          color = BASKETBALL_SMALL_FORWARD;
          break;
        case "SG":
          color = BASKETBALL_SHOOTING_GUARD;
          break;
        case "PG":
          color = BASKETBALL_POINT_GUARD;
          break;
        default:
          color = "";
          break;
      }
      break;
    case "baseball": {
      switch (position) {
        case "C":
          color = BASEBALL_CATCHER;
          break;
        case "1B":
          color = BASEBALL_FIRST_BASE;
          break;
        case "2B":
          color = BASEBALL_SECOND_BASE;
          break;
        case "3B":
          color = BASEBALL_THIRD_BASE;
          break;
        case "SS":
          color = BASEBALL_SHORTSTOP;
          break;
        case "OF":
          color = BASEBALL_OUTFIELD;
          break;
        case "SP":
          color = BASEBALL_STARTING_PITCHER;
          break;
        case "RP":
          color = BASEBALL_RELIEF_PITCHER;
          break;
        default:
          color = "";
          break;
      }
      break;
    }
    case "football": {
      switch (position) {
        case "QB":
          color = FOOTBALL_QUARTERBACK;
          break;
        case "RB":
          color = FOOTBALL_RUNNING_BACK;
          break;
        case "WR":
          color = FOOTBALL_WIDE_RECEIVER;
          break;
        case "TE":
          color = FOOTBALL_TIGHT_END;
          break;
        case "K":
          color = FOOTBALL_KICKER;
          break;
        case "DST":
          color = FOOTBALL_DST;
          break;
        default:
          color = "";
          break;
      }
      break;
    }
    default:
      color = "";
      break;
  }
  return color;
};
