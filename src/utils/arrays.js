export const insertIntoArray = (array, index, arrayOfNewItems) => [
  ...array.slice(0, index),
  ...arrayOfNewItems,
  ...array.slice(index),
];

export const splitInto2Arrays = (array) => {
  const halfwayIndex = Math.ceil(array.length / 2);
  const array1 = array.slice(0, halfwayIndex);
  const array2 = array.slice(halfwayIndex);
  return [array1, array2];
};

export const splitIntoArraysOfLengthX = (array, length) => {
  const arrayOfArrays = [];
  for (let i = 0; i < array.length; i += length) {
    arrayOfArrays.push(array.slice(i, i + length));
  }
  return arrayOfArrays;
};
