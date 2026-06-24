import { Table } from "components/table/Table";
import { capitalize } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

import * as S from "styles/LotterySimulator.styles";
import * as T from "styles/StandardScreen.styles";
import * as X from "styles/TransactionsHistory.styles";
import * as G from "styles/shared";
import { api } from "utils/api";
import { sportYearToSportAndYear } from "utils/years";
import { LotteryTable } from "./LotteryTable";
import { getProbs } from "./getProbs";
import { simLottery } from "./simLottery";
import { numberToOrdinal } from "utils/strings";

const DEFAULT_CHANCES = [25, 25, 15, 15, 10, 10];
const DEFAULT_NAMES = [
  "Team 1",
  "Team 2",
  "Team 3",
  "Team 4",
  "Team 5",
  "Team 6",
];

export const LotterySimulator = () => {
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const [completedLeaguesArray, setCompletedLeaguesArray] = useState([]);
  const [selectedSportYear, setSelectedSportYear] = useState("");
  const [selectedLeagueStandings, setSelectedLeagueStandings] = useState([]);
  const [chances, setChances] = useState(DEFAULT_CHANCES);
  const [loadingProbs, setLoadingProbs] = useState(true);
  const [lotteryResults, setLotteryResults] = useState(undefined);
  const [names, setNames] = useState(DEFAULT_NAMES);
  const [probs, setProbs] = useState([]);
  const [shouldHighlight, setShouldHighlight] = useState(false);

  const StandingsColumns = [
    {
      Header: "Rank",
      accessor: "rank",
      tableHeaderCell: T.NumberCenteredTableHeaderCell,
      disableSortBy: true,
    },
    {
      Header: "GM(s)",
      accessor: (data) => data.gm.match(/\(([^)]+)\)/)[1],
      tableHeaderCell: T.NumberCenteredTableHeaderCell,
      disableSortBy: true,
    },
    {
      Header: "Record",
      accessor: (data) => `${data.wins}-${data.losses}-${data.ties}`,
      tableHeaderCell: T.NumbersTableHeaderCell,
      disableSortBy: true,
    },
    {
      Header: "Win%",
      accessor: (data) => Number(data.winPer).toFixed(3),
      tableHeaderCell: T.NumbersTableHeaderCell,
      sortDescFirst: false,
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      const globalVaiables = await api.get("/global-variables");
      const { dynasty: dynastyObject } = globalVaiables;
      const { completedLeagues } = dynastyObject;
      setCompletedLeaguesArray(completedLeagues);
    };

    loadData();
  }, [isReady]);

  useEffect(() => {
    const newChances = [...chances, chances[chances.length - 1] ?? 1];
    const newProbs = getProbs(newChances);
    setProbs(newProbs.probs);
    setLoadingProbs(false);
  }, [chances, isReady]);

  useEffect(() => {
    const loadData = async () => {
      if (selectedSportYear) {
        const { sport, year } = sportYearToSportAndYear(selectedSportYear);
        const standingsObject = await api.get(`/standings/${sport}/${year}`);
        const { dynastyStandings } = standingsObject;

        const ranked = [...dynastyStandings]
          .sort((a, b) => Number(b.winPer) - Number(a.winPer))
          .map((team, index, arr) => {
            const isTied =
              (index > 0 && team.winPer === arr[index - 1].winPer) ||
              (index < arr.length - 1 && team.winPer === arr[index + 1].winPer);

            // Find the true rank by counting how many unique win totals are above this one
            const rank =
              arr.filter((t, i) => i < index && t.winPer > team.winPer).length +
              1;

            return {
              ...team,
              rank: isTied ? `${rank}*` : `${rank}`,
            };
          });
        setSelectedLeagueStandings(ranked);
      }
    };

    loadData();
  }, [isReady, selectedSportYear]);

  const options = useMemo(() => {
    if (completedLeaguesArray && completedLeaguesArray.length > 0) {
      return completedLeaguesArray.map((sportYear) => {
        const { sport, year } = sportYearToSportAndYear(sportYear);
        return {
          value: sportYear,
          label: `${year} ${capitalize(sport)}`,
        };
      });
    }
  }, [completedLeaguesArray]);

  const handleSportYearChange = useCallback(
    (event) => {
      setSelectedSportYear(event?.value);
    },
    [setSelectedSportYear],
  );

  const onAddTeam = useCallback(() => {
    setLotteryResults(undefined);
    const newChances = [...chances, chances[chances.length - 1] ?? 1];
    setChances(newChances);
    const newName = `Team ${chances.length + 1}`;
    setNames([...names, newName]);
  }, [chances, names, setLotteryResults, setChances, setNames]);

  const { sport: selectedSport, year: selectedYear } =
    sportYearToSportAndYear(selectedSportYear);

  const simLotteryAction = useCallback(() => {
    const results = simLottery(chances, chances.length);
    const orderedResults = names
      .map((name, i) => ({ name, rank: results[i] }))
      .sort((a, b) => a.rank - b.rank)
      .map(({ name }) => name);

    setLotteryResults(orderedResults);
  }, [chances, setLotteryResults, names]);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>3x5 Trifecta Lottery Simulator</T.Title>

      <S.LotterySimulatorColumns>
        <S.LotterySimulatorColumn>
          <S.LotterySimulatorSimButtons>
            <Select
              placeholder="Load Past Standings"
              defaultValue={""} //last in list of completed sportyears
              onChange={handleSportYearChange}
              options={options} //ilst of completed sports in appropriate select format
              styles={X.TransactionsHistoryDropdownCustomStyles}
              isSearchable={false}
            />
            <S.SimLotteryButton onClick={onAddTeam}>
              Add Team
            </S.SimLotteryButton>
            <S.SimLotteryButton
              onClick={simLotteryAction}
              disabled={chances.length === 0}
              style={{ backgroundColor: "green" }}
            >
              Sim Lottery!
            </S.SimLotteryButton>
          </S.LotterySimulatorSimButtons>
          <LotteryTable
            chances={chances}
            loadingProbs={loadingProbs}
            lotteryResults={lotteryResults}
            names={names}
            probs={probs}
            setChances={setChances}
            setLotteryResults={setLotteryResults}
            setNames={setNames}
            isReadyToHighlight={shouldHighlight}
          />
        </S.LotterySimulatorColumn>
        <S.LotteryResultsColumn
          visible={lotteryResults && lotteryResults.length > 0}
        >
          <T.TableTitle>Lottery Results</T.TableTitle>
          <G.VerticalSpacer factor={2} />
          {lotteryResults &&
            lotteryResults.map((team, i) => (
              <S.LotteryResultsText
                key={team}
                index={i}
                total={lotteryResults.length}
                onAnimationEnd={
                  i === 0 ? () => setShouldHighlight(true) : undefined
                }
              >{`${i + 3}${numberToOrdinal(i + 3)}: ${team}`}</S.LotteryResultsText> // start at 3rd pick
            ))}
        </S.LotteryResultsColumn>
        <S.LotterySimulatorColumn>
          <T.SingleTableContainer>
            {selectedSportYear && (
              <>
                <T.TableTitle>{`${selectedYear} ${capitalize(selectedSport)} Standings`}</T.TableTitle>
                <Table
                  columns={StandingsColumns}
                  data={selectedLeagueStandings}
                  sortBy={[{ id: "Win%", desc: false }]}
                />
              </>
            )}
          </T.SingleTableContainer>
        </S.LotterySimulatorColumn>
      </S.LotterySimulatorColumns>
    </T.FlexColumnCenterContainer>
  );
};
