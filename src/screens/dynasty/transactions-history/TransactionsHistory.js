import React, { useCallback, useEffect, useMemo, useState } from "react";
import { returnMongoCollection } from "database-management";
import { capitalize } from "lodash";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as S from "styles/TransactionsHistory.styles";
import * as T from "styles/StandardScreen.styles";
import { TransactionsHistoryTable } from "components/table/TransactionsHistoryTable";

export const TransactionsHistory = () => {
  const { era, sport, year } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const [transactions, setTransactions] = useState([]);
  const [gmsArray, setGmsArray] = useState([]);

  const getAndSetGmsArray = useCallback(async () => {
    // get list of gm abbreviations
    const gmCollection = await returnMongoCollection("gms", era);
    const gmData = await gmCollection.find(
      {},
      { projection: { abbreviation: 1, name: 1 } }
    );
    const gmNamesArray = gmData.map((gm) => `${gm.name} (${gm.abbreviation})`);
    setGmsArray(gmNamesArray);
  }, [setGmsArray, era]);

  useEffect(() => {
    const display = async () => {
      if (isReady) {
        const sportYear = `${sport}${year}`;
        const transactionsHistoryCollection = await returnMongoCollection(
          "transactionsHistory",
          era
        );
        const data = await transactionsHistoryCollection.find({ sportYear });
        const object = data?.[0] ?? {};
        const { lastScraped: lastScrapedString, transactions } = object;
        console.log("Last scraped (Local): ", lastScrapedString);
        getAndSetGmsArray();
        setTransactions(transactions);
      }
    };

    display();
  }, [isReady, era, sport, year, getAndSetGmsArray]);

  const transactionsColumns = useMemo(() => {
    return [
      {
        Header: "Date",
        accessor: "date",
        tableHeaderCell: T.StringTableHeaderCell,
      },
      {
        Header: sport === "football" ? "Week" : "Period",
        accessor: "period",
        tableHeaderCell: T.NumbersTableHeaderCell,
      },
      {
        Header: "Transaction Type",
        accessor: "transactionType",
        tableHeaderCell: T.NumbersTableHeaderCell,
      },
      {
        Header: "Successful?",
        accessor: "isSuccessful",
        tableHeaderCell: T.NumbersTableHeaderCell,
      },
      {
        Header: "Is Successful Reason",
        accessor: "isSuccessfulReason",
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
  }, [sport]);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>{`${year} ${capitalize(sport)} Transactions History`}</T.Title>
      <TransactionsHistoryTable
        columns={transactionsColumns}
        data={transactions}
        sortBy={[{ id: "date", desc: false }]}
        hiddenColumns={["transactionType", "isSuccessfulReason"]}
        gmsArray={gmsArray}
      />
    </T.FlexColumnCenterContainer>
  );
};
