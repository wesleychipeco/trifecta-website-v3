export const numberToOrdinal = (number) => {
  // caveat only works for numbers less than or equal to 10
  switch (number) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};
