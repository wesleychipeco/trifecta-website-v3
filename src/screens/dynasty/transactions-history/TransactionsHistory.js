import React, { useEffect, useMemo, useState } from "react";
import { returnMongoCollection } from "database-management";
import { capitalize, upperCase } from "lodash";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select, { components } from "react-select";
import { useAuth0 } from "@auth0/auth0-react";
import { retrieveTransactions } from "./TransactionsHistoryHelper";
import * as S from "styles/TransactionsHistory.styles";
import * as T from "styles/StandardScreen.styles";
import { TransactionsHistoryTable } from "components/table/TransactionsHistoryTable";

export const TransactionsHistory = () => {
  const { era, sport, year } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const dynastyCurrentVariables = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.dynasty
  );
  const [transactions, setTransactions] = useState([]);
  const [gmsArray, setGmsArray] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (isReady && dynastyCurrentVariables !== null) {
        const { leagueIdMappings } = dynastyCurrentVariables;
        const sportYear = `${sport}${year}`;
        const leagueId = leagueIdMappings[sportYear];
        if (leagueId) {
          // get teamIds to gms mappings
          const gmNamesIdsCollection = await returnMongoCollection(
            "gmNamesIds",
            era
          );
          const gmNamesIds = await gmNamesIdsCollection.find({ leagueId });
          const mappings = gmNamesIds?.[0]?.mappings ?? {};

          // get list of gm abbreviations
          const gmCollection = await returnMongoCollection("gms", era);
          const gmData = await gmCollection.find(
            {},
            { projection: { abbreviation: 1, name: 1 } }
          );
          const gmNamesArray = gmData.map(
            (gm) => `${gm.name} (${gm.abbreviation})`
          );
          console.log("gmdata", gmNamesArray);
          setGmsArray(gmNamesArray);

          // retrieve transactions
          const allTransactions = await retrieveTransactions(
            leagueId,
            mappings
          );
          setTransactions(allTransactions);
        }
      }
    };

    loadData();
  }, [isReady, dynastyCurrentVariables]);

  const transactionsColumns = useMemo(() => {
    return [
      {
        Header: "Date",
        accessor: "date",
        tableHeaderCell: T.StringTableHeaderCell,
      },
      {
        Header: "Transaction Type",
        accessor: "transactionType",
        tableHeaderCell: T.NumbersTableHeaderCell,
      },
      {
        Header: "GM",
        accessor: "gm",
        tableHeaderCell: T.NumbersTableHeaderCell,
        disableSortBy: true,
      },
      {
        Header: "Player(s)",
        accessor: "playerDisplay",
        tableHeaderCell: S.PlayerTableHeaderCell,
        disableSortBy: true,
      },
      {
        Header: "Bid Amount",
        accessor: "bidOffer",
        tableHeaderCell: T.StringTableHeaderCell,
        sortDescFirst: true,
      },
      {
        Header: "FAAB Tiebreakers",
        accessor: "faabTiebreakers",
        tableHeaderCell: T.StringTableHeaderCell,
        disableSortBy: true,
      },
    ];
  }, []);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>{`${year} ${capitalize(sport)} Transactions History`}</T.Title>
      {/* Dropdown to filter by GM */}
      {/* Dropdown to filter by Add, Drop, or All (transactionType) */}
      <TransactionsHistoryTable
        columns={transactionsColumns}
        data={transactions}
        sortBy={[{ id: "date", desc: false }]}
        hiddenColumns={["transactionType"]}
        gmsArray={gmsArray}
      />
    </T.FlexColumnCenterContainer>
  );
};
