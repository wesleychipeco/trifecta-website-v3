import axios from "axios";
import { add, parse } from "date-fns";
import { orderBy } from "lodash";
import { extractBetweenParentheses } from "utils/strings";

export const retrieveTransactions = async (leagueId, gmNamesIdsMappings) => {
  const url =
    process.env.REACT_APP_IS_LOCAL === "true"
      ? `http://localhost:5000/transactions`
      : `https://www.trifectafantasyleague.com:443/transactions`;

  const data = await axios.post(
    url,
    {
      msgs: [
        {
          method: "getTransactionDetailsHistory",
          data: {
            leagueId,
            executedOnly: false,
            maxResultsPerPage: "999",
            view: "CLAIM_DROP",
          },
        },
      ],
      refUrl: `https://www.fantrax.com/fantasy/league/${leagueId}/transactions/history;view=CLAIM_DROP;executedOnly=false`,
      at: 0,
      dt: 0,
      tz: "America/Los_Angeles",
      v: "109.0.1",
    },
    {
      headers: {
        Accept: "application/json",
        LeagueId: leagueId,
      },
    }
  );

  const rawData = data?.data?.responses?.[0]?.data ?? {};
  const rawTableRows = rawData?.table?.rows ?? [];
  // console.log("rawTableRows", rawTableRows);
  return formatTransactions(rawTableRows, gmNamesIdsMappings);
};

const formatTransactions = (tableRows, gmNamesIdsMappings) => {
  const cleanedUpTransactions = [];
  let shouldSkip = false;
  let transactionObjectHoldover = {};
  // loop through all transactions
  for (let i = 0; i < tableRows.length; i++) {
    const eachRow = tableRows[i];
    // if is an associated drop, add dropped player, add now completed transaction to list and reset
    if (shouldSkip) {
      const droppedPlayerName = eachRow.scorer.name;
      const droppedPlayerPos = eachRow.scorer.posShortNames.substr(
        0,
        eachRow.scorer.posShortNames.indexOf(",")
      );
      const droppedPlayerPosAndTeam = `${droppedPlayerPos} - ${eachRow.scorer.teamShortName}`;
      transactionObjectHoldover["droppedPlayerName"] = droppedPlayerName;
      transactionObjectHoldover["droppedPlayerPosAndTeam"] =
        droppedPlayerPosAndTeam;

      const droppedPlayerDisplay = `${droppedPlayerName} - ${droppedPlayerPosAndTeam}`;
      const previousPlayerDisplay = transactionObjectHoldover.playerDisplay;
      transactionObjectHoldover.playerDisplay = `${previousPlayerDisplay}#${droppedPlayerDisplay}`;
      cleanedUpTransactions.push(transactionObjectHoldover);
      shouldSkip = false;
      transactionObjectHoldover = {};
      continue;
    }

    const teamId = eachRow?.cells?.[0]?.teamId;
    const fullGm = gmNamesIdsMappings[teamId];
    const gm = extractBetweenParentheses(fullGm);
    const isThereMore = eachRow.cells?.[0]?.rowspan > 1;
    const addedPlayerName = eachRow.scorer.name;
    const addedPlayerPos = eachRow.scorer.posShortNames.substr(
      0,
      eachRow.scorer.posShortNames.indexOf(",")
    );
    const addedPlayerPosAndTeam = `${addedPlayerPos} - ${eachRow.scorer.teamShortName}`;
    const playerDisplay = `${addedPlayerName} - ${addedPlayerPosAndTeam}`;
    const bidOffer = isNaN(parseFloat(eachRow.cells?.[1]?.content))
      ? 0
      : parseFloat(eachRow.cells?.[1]?.content);
    const isSuccessful = eachRow.executed;
    const isSuccessfulReason = formatFailedTransactionMessage(
      eachRow.result?.toolTip
    );
    const period = eachRow.cells?.[5]?.content ?? eachRow.cells?.[3]?.content; // football has fewer elements in array
    const dateString = eachRow.cells?.[4]?.content ?? eachRow.cells[2]?.content; // football has fewer elements in array
    const transactionType = eachRow.transactionType;
    const newDate = add(
      parse(dateString, "EEE MMM d, yyyy, h:mma", new Date()),
      { hours: -3 } // convert from default Eastern time zone
    );

    const transactionObject = {
      gm,
      playerDisplay,
      addedPlayerName,
      addedPlayerPosAndTeam,
      bidOffer,
      isSuccessful,
      isSuccessfulReason,
      period,
      dateString,
      date: newDate,
      transactionType,
    };

    // if there is more, ie. rowspan > 1, ie there is an associated drop with this add, save transaction object and handle drop in next iteration
    if (isThereMore) {
      shouldSkip = true;
      transactionObjectHoldover = transactionObject;
    } else {
      cleanedUpTransactions.push(transactionObject);
    }
  }
  // console.log("cleaned up", cleanedUpTransactions);

  const executedTransactions = cleanedUpTransactions.filter(
    (eachTransaction) => eachTransaction.isSuccessful
  );
  const notExecutedTransactions = cleanedUpTransactions.filter(
    (eachTransaction) => !eachTransaction.isSuccessful
  );

  // loop through each executed transaction and see if there are any nonExecuted transactions for that addedPlayerName and make list of FAAB tiebreakers
  for (let j = 0; j < executedTransactions.length; j++) {
    const transaction = executedTransactions[j];
    const addedPlayerAndDateInQuestion = `${transaction.addedPlayerName}_${transaction.dateString}`;

    for (let k = 0; k < notExecutedTransactions.length; k++) {
      const failedTransaction = notExecutedTransactions[k];
      const playerAndDateToCheck = `${failedTransaction.addedPlayerName}_${failedTransaction.dateString}`;

      if (addedPlayerAndDateInQuestion === playerAndDateToCheck) {
        const listOfFaabTiebreakers = transaction.faabTiebreakers;
        const { gm, bidOffer } = failedTransaction;

        // if the array already exists in transaction, add to it
        if (listOfFaabTiebreakers && Array.isArray(listOfFaabTiebreakers)) {
          transaction.faabTiebreakers.push({
            gm,
            bidOffer,
          });
        }
        // if the array does not exist, initialize
        else {
          transaction.faabTiebreakers = [
            {
              gm,
              bidOffer,
            },
          ];
        }
      }

      // before ending loop, sort faabTiebreakers by bidOffer
      if (k === notExecutedTransactions.length - 1) {
        transaction.faabTiebreakers = orderBy(
          transaction.faabTiebreakers,
          ["bidOffer"],
          ["desc"]
        );
      }
    }
  }

  const allTransactions = [...executedTransactions, ...notExecutedTransactions];
  // sort executed transations by 1) date,, 2) isSuccessful = true, 3) transactionType === Claim, 4) bidOffer
  const sortedExecuted = orderBy(
    allTransactions,
    ["date", "isSuccessful", "transactionType", "bidOffer"],
    ["desc", "desc", "asc", "desc"]
  );
  // console.log("sortedEnrichedExecuted", sortedExecuted);

  return sortedExecuted;
};

const formatFailedTransactionMessage = (tooltipText) => {
  if (!tooltipText) {
    return "";
  }

  if (tooltipText.includes("Click")) {
    return "Roster limit would be exceeeded.";
  } else if (
    tooltipText.includes("tiebreaker") ||
    tooltipText.includes("higher")
  ) {
    return removeBoldHtml(tooltipText);
  } else if (tooltipText.includes("already")) {
    const newText = removeBoldHtml(tooltipText);
    return changeFormatOfPlayerName(newText);
  } else if (tooltipText.includes("another")) {
    return changeFormatOfPlayerName(tooltipText);
  } else {
    return "";
  }
};

const removeBoldHtml = (stringWithBoldHtml) => {
  return stringWithBoldHtml.replace("<b>", "").replace("</b>", "");
};

// for tooltip, fantrax gives player name as <b>last, first</b>. Change to first last.
const changeFormatOfPlayerName = (fullString) => {
  const name = fullString.substring(
    fullString.indexOf("<b>") + 3,
    fullString.indexOf("</b>")
  );
  const nameArray = name.split(", ");
  const [last, first] = nameArray;
  return fullString.replace(`<b>${last}, ${first}</b>`, `${first} ${last}`);
};
