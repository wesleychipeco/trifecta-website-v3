export const insertIntoArray = (array, index, arrayOfNewItems) => [
  ...array.slice(0, index),
  ...arrayOfNewItems,
  ...array.slice(index),
];
