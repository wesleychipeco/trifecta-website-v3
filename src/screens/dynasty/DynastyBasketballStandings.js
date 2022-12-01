import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { returnMongoCollection } from "database-management";
import { startCase } from "lodash";
import axios from "axios";
import * as S from "styles/StandardScreen.styles";
import { Table } from "components/table/Table";

export const DynastyBasketballStandings = () => {
  const { era, year } = useParams();
  console.log("era", era, "year", year);

  const [divisionStandings, setDivisionStandings] = useState({
    North: [],
    South: [],
    East: [],
    West: [],
  });

  // const testBasketballLeagueId = "aznbe7wvl8esmlyo";

  useEffect(() => {
    // TODO extract out scrape & calculate dyansty points functions
    const scrape = async () => {
      const leagueId = "aznbe7wvl8esmlyo";

      const data = await axios.post(
        `http://localhost:5000/standings`,
        {
          msgs: [{ method: "getStandings", data: { view: "ALL" } }],
          ng2: true,
          href: `https://www.fantrax.com/fantasy/league/${leagueId}/standings;view=ALL`,
          dt: 0,
          at: 0,
          av: null,
          tz: "America/Los_Angeles",
          v: "73.0.0",
        },
        {
          headers: {
            Accept: "application/json",
            LeagueId: leagueId,
          },
        }
      );
      const tableStandings = data.data.responses[0].data.tableList.filter(
        (row) => row.caption === "Standings"
      );

      const globalDivisionStandings = {};
      for (let i = 0; i < tableStandings.length; i++) {
        const eachDivision = tableStandings[i];
        const divisionName = eachDivision.subCaption;
        const eachDivisionStandings = [];

        for (let j = 0; j < eachDivision.rows.length; j++) {
          const eachTeam = eachDivision.rows[j];
          const divStandingsObj = {
            teamName: eachTeam.fixedCells[1].content,
            wins: eachTeam.cells[0].content,
            losses: eachTeam.cells[1].content,
            ties: eachTeam.cells[2].content,
            winPer: eachTeam.cells[3].content,
            gamesBack: eachTeam.cells[5].content,
            divisionRecord: eachTeam.cells[4].content,
          };
          eachDivisionStandings.push(divStandingsObj);
        }

        globalDivisionStandings[divisionName] = eachDivisionStandings;
      }

      setDivisionStandings(globalDivisionStandings);
    };

    scrape();
  }, []);

  // TODO move to own file
  const columns = [
    {
      Header: "Team Name",
      accessor: "teamName",
      tableHeaderCell: S.StringTableHeaderCell,
      disableSortBy: true,
    },
    {
      Header: "Wins",
      accessor: "wins",
      tableHeaderCell: S.NumbersTableHeaderCell,
      sortDescFirst: true,
    },
    {
      Header: "Losses",
      accessor: "losses",
      tableHeaderCell: S.NumbersTableHeaderCell,
      sortDescFirst: true,
    },
    {
      Header: "Ties",
      accessor: "ties",
      tableHeaderCell: S.NumbersTableHeaderCell,
      sortDescFirst: true,
    },
    {
      Header: "Win%",
      accessor: (data) => Number(data.winPer).toFixed(3),
      tableHeaderCell: S.NumbersTableHeaderCell,
      sortDescFirst: true,
    },
    {
      Header: "Games Back",
      accessor: "gamesBack",
      tableHeaderCell: S.NumbersTableHeaderCell,
      sortDescFirst: false,
    },
    {
      Header: "Division Record",
      accessor: "divisionRecord",
      tableHeaderCell: S.NumbersTableHeaderCell,
      disableSortBy: true, // TODO sortBy function that actually sorts Division Record accurately
    },
  ];

  return (
    <S.FlexColumnCenterContainer>
      <S.Title>{`${year} Basketball Standings for ${era}`}</S.Title>
      <S.TablesContainer>
        <S.SingleTableContainer>
          // TODO Dynasty Points Table to go here
        </S.SingleTableContainer>
        <S.TwoTablesContainer>
          {Object.keys(divisionStandings).map((division) => {
            // TODO sort so order is N, S, E, W
            if (division === "North" || division === "South") {
              return (
                <S.SingleTableContainer key={division}>
                  <S.TableTitle>{division}</S.TableTitle>
                  <Table
                    columns={columns}
                    data={divisionStandings[division]}
                    sortBy={[{ id: "Win%", desc: true }]}
                    top3Styling
                  />
                </S.SingleTableContainer>
              );
            }
          })}
        </S.TwoTablesContainer>
        <S.TwoTablesContainer>
          {Object.keys(divisionStandings).map((division) => {
            if (division === "East" || division === "West") {
              return (
                <S.SingleTableContainer key={division}>
                  <S.TableTitle>{division}</S.TableTitle>
                  <Table
                    columns={columns}
                    data={divisionStandings[division]}
                    sortBy={[{ id: "Win%", desc: true }]}
                    top3Styling
                  />
                </S.SingleTableContainer>
              );
            }
          })}
        </S.TwoTablesContainer>
      </S.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
