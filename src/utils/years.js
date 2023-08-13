export const SeasonStatus = {
  NOT_STARTED: "notStarted",
  IN_PROGRESS: "inProgress",
  COMPLETED: "completed",
};

export const isYear1BeforeYear2 = (year1, year2) => {
  return Number(year1) < Number(year2);
};

export const isYear1AfterYear2 = (year1, year2) => {
  return Number(year1) > Number(year2);
};

export const determineSeasonStatus = (seasonStarted, inSeason) => {
  if (seasonStarted) {
    if (!inSeason) {
      return SeasonStatus.COMPLETED;
    } else {
      return SeasonStatus.IN_PROGRESS;
    }
  }

  return SeasonStatus.NOT_STARTED;
};

export const sportYearToSportAndYear = (sportYear) => {
  return {
    sport: sportYear.slice(0, sportYear.length - 4),
    year: sportYear.slice(sportYear.length - 4),
  };
};
