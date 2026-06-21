import { useState } from "react";

const ordinal = (x) => {
  let suffix;

  if (x % 100 >= 11 && x % 100 <= 13) {
    suffix = "th";
  } else if (x % 10 === 1) {
    suffix = "st";
  } else if (x % 10 === 2) {
    suffix = "nd";
  } else if (x % 10 === 3) {
    suffix = "rd";
  } else {
    suffix = "th";
  }

  return x.toString() + suffix;
};

const formatPercent = (num) => {
  if (num === undefined) {
    return num;
  }

  if (num === 1) {
    return "100%";
  }

  return `${(num * 100).toFixed(1)}%`;
};

const getDefaultNames = (numTeams) => {
  const names = [];
  for (let i = 0; i < numTeams; i++) {
    names.push(`Team ${i + 1}`);
  }
  return names;
};

const checkNamesAreAllDefault = (names) => {
  const defaultNames = getDefaultNames(names.length);
  for (let i = 0; i < names.length; i++) {
    if (names[i] !== defaultNames[i]) {
      return false;
    }
  }

  return true;
};

const Row = ({
  chance,
  i,
  chances,
  lotteryResults,
  loadingProbs,
  names,
  probs,
  setChances,
  setLotteryResults,
  setNames,
  setPresetKey,
}) => {
  const [highlight, setHighlight] = useState(false);

  const nameId = `name-${i}`;
  const chancesId = `chances-${i}`;

  return (
    <tr
      className={`border-b ${
        highlight
          ? "odd:bg-yellow-200 even:bg-yellow-100 hover:bg-[#f6edaa]"
          : "odd:bg-gray-100 hover:bg-gray-200"
      }`}
      onClick={(event) => {
        const ignoredElements = ["BUTTON", "INPUT"];
        if (ignoredElements.includes(event.target.nodeName)) {
          return;
        }
        setHighlight((value) => !value);
      }}
    >
      <td className="py-0 w-0">
        <button
          className="text-red-600 text-xl"
          type="button"
          onClick={() => {
            setLotteryResults(undefined);
            setChances(chances.filter((_chance, j) => j !== i));
            setPresetKey("custom");
            const namesAreAllDefault = checkNamesAreAllDefault(names);
            if (namesAreAllDefault) {
              setNames(getDefaultNames(chances.length - 1));
            } else {
              setNames(names.filter((_name, j) => j !== i));
            }
            setHighlight(false);
          }}
          title="Remove team"
        >
          ✕
        </button>
      </td>
      <td className="py-0">
        <input
          id={nameId}
          className="form-control py-1 px-2 text-sm w-[100px]"
          type="text"
          value={names[i]}
          onChange={(event) => {
            const newName = event.target.value;
            setNames(names.map((name, j) => (j === i ? newName : name)));
          }}
        />
      </td>
      <td className="py-0 w-0">
        <input
          id={chancesId}
          className="form-control py-1 px-2 text-sm"
          type="text"
          value={chance}
          onChange={(event) => {
            const number = parseFloat(event.target.value);
            if (!Number.isNaN(number)) {
              setLotteryResults(undefined);
              setPresetKey("custom");
              setChances(
                chances.map((chance, j) => (i === j ? number : chance)),
              );
            }
          }}
        />
      </td>
      {chances.map((_chance, j) => {
        const pct = formatPercent(probs[i]?.[j]);
        return (
          <td
            key={j}
            className={`${
              lotteryResults && lotteryResults[j] === i ? "bg-green-200" : ""
            }${loadingProbs ? " text-gray-500" : ""}`}
          >
            {pct ?? "\u00A0"}
          </td>
        );
      })}
    </tr>
  );
};

export const LotteryTable = (props) => {
  return (
    <table
      className="table-auto"
      style={{
        width: "unset",
      }}
    >
      <thead className="text-center">
        <tr className="border-b-2 border-gray-500">
          <th />
          <th>Team Name</th>
          <th>Chances</th>
          {props.chances.map((_chance, i) => (
            <th key={i}>{ordinal(i + 3)}</th> // start at 3rd pick
          ))}
        </tr>
      </thead>
      <tbody className="text-end">
        {props.chances.map((chance, i) => {
          return <Row key={i} i={i} chance={chance} {...props} />;
        })}
      </tbody>
    </table>
  );
};
