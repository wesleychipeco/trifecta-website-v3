# 3x5 Trifecta Website README

## Architecture Diagram

![Architecture Diagram](src/resources/images/3x5-website-architecture-diagram.png "Architecture Diagram")

- All cloud infrastructure is hosted on Free Tier services
- SSL certification running on Apache Web Server
- All data is stored on a free tier MongoDB instance
- Frontend React Web Server & Backend API are running on EC2 instance
- Daily cron jobs refresh data from Fantrax API

## Commissioner Upkeep Actions

## Metadata Updates

#### When a new sport season starts

In Fantrax...

- Set updated Divisions
- Change all Head-to-Head matchups for the reguar season. See [Divisions and Scheduling](https://docs.google.com/spreadsheets/d/1eckZIAViprHT3ywjrOVDSXUnI_b-HgGwOSL8KCH7EnM/edit?usp=sharing)
- Set Playoff Bracket to be manual Commissioner assignment each week to manually account for potential seeding tiebreakers
- Set Consolation Bracket to Commissioner initially set and then proceeding on own
- Set Trade Deadline to be 2 weeks to the Monday before the end of the regular season
- Set phone reminders to set Playoff Bracket matchups each Sunday night

In DB...

- Add sportYear to `inSeasonLeagues` in globalVariables collection

#### When a sport's fantasy playoffs start

- On Fantrax, set Playoff Bracket matchups each week including 3rd place game

#### When a sport's fantasy season ends

- Using the **"Complete Sport with Playoffs"** Commissioner Action, assign Playoff Dynasty Points (which also removes sportYear from `inSeasonLeagues` global variable)
- Payout the winners of the sport
- Conduct the lottery for the next season's supplementary draft
- Renew the Fantrax League for next season
- Update carryover FAAB
- Update the `currentRosterLeagues` global variable with new sportYear in DB
- Using the **"Start New Sport with New IDs"** Commissioner Action, assign the new sport and year's leagueId and individual teamIds. Find the leagueId and teamIds using the Network tab of the Chrome Inspector

#### When a trade occurs

- In Commissioner Actions, **"Enter Trade History"** so the trade appears on the Trade History
- If future draft picks are involved, **"Trade Draft Picks"** to update future Draft Boards and Trade Asset Dashboards
- Manually execute all available aspects of the trade
- Ping involved GMs to let them know the trade has been processed and if there are any illegal rosters/lineups as a result, that the GM has to fix it before next lineup lock

#### Adding draft results

- From Fantrax, download .csv of the draft results
- Remove all quotation marks from the .csv
- Replace all full team names with GM abbreviations (ie Wesley Chipeco -> CHIP)
- If a pick was traded, at the end of the row, add a comma and the GM abbreviation who traded away the pick. (The receiving GM is already represented by the downloaded csv)
- Add the .csv to the "resources/data" directory with filename `draft-results-<sport>-<year>.csv`
- In DraftBoard.js, add to conditional about which csv to use given sport and year "loadCompletedDraft"
- In "drafts" collection in DB, move the sportYear of completed draft from `futureDrafts` array to `completedDrafts` array

## Website Updates

See: https://tinyurl.com/trifectawebdoc
