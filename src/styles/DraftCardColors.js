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
const BASEBALL_STARTING_PITCHER = "rgb(255, 209, 220)";
const BASEBALL_RELIEF_PITCHER = "rgb(251, 189, 35)";
const BASEBALL_UTILITY = "rgba(244, 105, 125, 0.84)";

// Football
const FOOTBALL_QUARTERBACK = "rgba(251, 146, 60, 0.66)";
const FOOTBALL_RUNNING_BACK = "rgba(244, 105, 125, 0.84)";
const FOOTBALL_WIDE_RECEIVER = "rgba(89, 171, 252, 0.5)";
const FOOTBALL_TIGHT_END = "rgba(192, 132, 252, 0.84)";
const FOOTBALL_KICKER = "rgba(54, 211, 153, 0.84)";
const FOOTBALL_DST = "rgba(244, 105, 125, 0.5)";

// GM Abbreviations
const CHIP = "CHIP";
const JH = "JH";
const TFLA = "TFLA";
const DAVE = "DAVE";
const LB = "LB";
const MLAM = "MLAM";
const KLIU = "KLIU";
const JAGO = "JAGO";
const ACP = "ACP";
const CLIU = "CLIU";
const TC = "TC";
const WGMO = "WGMO";
const JLIU = "JLIU";
const GMK = "GMK";
const JTTA = "JTTA";
const PAN = "PAN";

export const determineBackgroundColor = ({
  sport,
  position,
  fantasyTeam,
  tradedTo,
}) => {
  if (sport && position) {
    return colorPositionMatcher(sport, position);
  }
  return colorGmMatcher(fantasyTeam, tradedTo);
};

const colorGmMatcher = (fantasyTeam, tradedTo) => {
  let color = "";
  const teamToUse = tradedTo === false ? fantasyTeam : tradedTo;

  switch (teamToUse) {
    case CHIP:
      // color = "#8F8F88";
      color = "rgba(143, 143, 136, 0.9)";
      break;
    case JH:
      // color = "#fff7a0";
      color = "rgb(255, 247, 160)";
      break;
    case TFLA:
      // color = "#ffc3f2";
      color = "rgb(255, 195, 242)";
      break;
    case DAVE:
      // color = "#f98284";
      color = "rgb(249, 130, 132)";
      break;
    case LB:
      // color = "#b0eb93";
      color = "rgb(176, 235, 147)";
      break;
    case MLAM:
      // color = "#accce4";
      color = "rgb(172, 204, 228)";
      break;
    case KLIU:
      // color = "#ffc384";
      color = "rgb(255, 195, 132)";
      break;
    case JAGO:
      // color = "#feaae4";
      color = "rgb(254, 170, 228)";
      break;
    case ACP:
      // color = "#fff7e4";
      color = "rgb(255, 247, 228)";
      break;
    case CLIU:
      // color = "#b0a9e4";
      color = "rgb(176, 169, 228)";
      break;
    case TC:
      // color = "#87a889";
      color = "rgb(135, 168, 137)";
      break;
    case WGMO:
      // color = "#ffe6c6";
      color = "rgb(255, 230, 198)";
      break;
    case JLIU:
      // color = "#dea38b";
      color = "rgb(222, 163, 139)";
      break;
    case GMK:
      // color = "#b3e3da";
      color = "rgb(179, 227, 218)";
      break;
    case JTTA:
      // color = "#873e84";
      color = "rgba(135, 62, 132, 0.6)";
      break;
    case PAN:
      // color = "#eed7a1";
      color = "rgb(238,215,161)";
      break;
    default:
      break;
  }
  return color;
};

const colorPositionMatcher = (sport, position) => {
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
        case "UT":
          color = BASEBALL_UTILITY;
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
