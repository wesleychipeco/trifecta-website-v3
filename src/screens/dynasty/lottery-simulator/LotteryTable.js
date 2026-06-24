import * as S from "styles/LotterySimulator.styles";

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
  names,
  probs,
  isReadyToHighlight,
  setChances,
  setLotteryResults,
  setNames,
  setPresetKey,
}) => {
  const nameId = `name-${i}`;
  const chancesId = `chances-${i}`;

  return (
    <tr>
      <td className="py-0 w-0">
        <S.LotteryTableClearTeamButton
          icon="fa-circle-xmark"
          size="xl"
          color="red"
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
          }}
        />
      </td>
      <td>
        <S.LotteryTableNameInput
          id={nameId}
          type="text"
          value={names[i]}
          onChange={(event) => {
            const newName = event.target.value;
            setNames(names.map((name, j) => (j === i ? newName : name)));
          }}
        />
      </td>
      <td>
        <S.LotteryTableChancesInput
          id={chancesId}
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
        const shouldHighlight =
          lotteryResults &&
          lotteryResults[j] === names[i] &&
          isReadyToHighlight;
        return (
          <S.LotteryTableCell key={j} shouldHighlight={shouldHighlight}>
            {pct ?? "\u00A0"}
          </S.LotteryTableCell>
        );
      })}
    </tr>
  );
};

export const LotteryTable = (props) => {
  return (
    <S.LotteryTableTable>
      <thead>
        <tr>
          <th />
          <S.LotteryTableHeaderText>Team Name</S.LotteryTableHeaderText>
          <S.LotteryTableHeaderText>Chances</S.LotteryTableHeaderText>
          {props.chances.map((_chance, i) => (
            <S.LotteryTableHeaderText key={i}>
              {ordinal(i + 3)}
            </S.LotteryTableHeaderText> // start at 3rd pick
          ))}
        </tr>
      </thead>
      <tbody>
        {props.chances.map((chance, i) => {
          return <Row key={i} i={i} chance={chance} {...props} />;
        })}
      </tbody>
    </S.LotteryTableTable>
  );
};
