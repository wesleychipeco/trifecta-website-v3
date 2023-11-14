import React, { useEffect, useMemo, useState } from "react";
import { returnMongoCollection } from "database-management";
import { capitalize } from "lodash";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { isSameDay } from "date-fns";
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
        const sportYear = `${sport}${year}`;
        const transactionsHistoryCollection = await returnMongoCollection(
          "transactionsHistory",
          era
        );
        const data = await transactionsHistoryCollection.find({ sportYear });
        const object = data?.[0] ?? {};
        const { lastScraped: lastScrapedString, transactions } = object;
        if (
          (lastScrapedString !== null || lastScrapedString !== undefined) &&
          isSameDay(new Date(), new Date(lastScrapedString))
        ) {
          // just display if lastScrapedString is same as today
          setTransactions(transactions);
        } else {
          // otherwise scrape logic
          const { leagueIdMappings } = dynastyCurrentVariables;
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
            setGmsArray(gmNamesArray);

            // retrieve transactions
            const allTransactions = await retrieveTransactions(
              leagueId,
              mappings
            );
            setTransactions(allTransactions);

            const { modifiedCount } =
              await transactionsHistoryCollection.updateOne(
                { sportYear },
                {
                  $set: {
                    transactions: allTransactions,
                    lastScraped: new Date().toISOString(),
                  },
                },
                {
                  upsert: true,
                }
              );

            if (modifiedCount !== 1) {
              console.warn("Transactions not saved to MongoDB!!!");
            }
          } else {
            console.error("No leagueId to get transactions from Fantrax!!!");
          }
        }
      }
    };

    loadData();
  }, [isReady, dynastyCurrentVariables, era, sport, year]);

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
  }, []);

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
