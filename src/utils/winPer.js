export const calculateWinPer = ({ wins, losses, ties }) => {
  const winPer = (wins + ties / 2) / (wins + losses + ties);
  return Number(winPer.toFixed(3));
};
