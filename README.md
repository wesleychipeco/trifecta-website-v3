# 3x5 Trifecta Website README

## Architecture

- trifectafantasyleague.com domain maintained by NameCheap
- DNS redirect via CNAME host to AWS Elastic Load Balancer
- Elastic Load Balancer supports https using SSL termination with a generated cert from Amazon Certificate Manager
- ELB routes traffic to AWS instance, where react server is running and handling requests
- Security group settings only allow traffic through the ELB to reach the react server
- All data is stored on a free tier MongoDB instance
- All AWS resources are operated on the free tier and renewed each year to keep infrastruture costs free
- Proxy node server used to bypass CORS security on Fantrax API and fetch data

![Architecture Diagram](src/resources/images/3x5-website-architecture-diagram.png "Architecture Diagram")

## Commissioner Upkeep Actions

- The Commissioner will be responsible for updating certain parameters and variables to allow the website to stay up to date

### Data Updates

##### When a new dynasty season starts

Fantrax Data

- Set all divisions
- Change all Head-to-Head matchups for the reguar season
- Figure out when dynasty playoffs start, and set a phone reminder to set consolation bracket matchups

##### When dynasty playoffs start

- On Fantrax, set consolation bracket matchups each week

##### When a dynasty season ends

- Renew the Fantrax league and complete the record the following variables
  leagueId

- Using inspect on Fantrax website, find the `leagueId`
- Add the `sportYear` with the `leagueId` to the `leagueIdMappings` object
- Add the `leaguedId` to the `globalVariables.globalVariables.dynasty.inSeasonLeagues` array

teamId

- Using inspect on Fantrax website standings page, under payload method "getStandings", responses[0].data.fantasyTeamInfo, find each team's `teamId`
- Add a new record to the `gmNamesIds` collection with `leagueId`, `sportYear`, and `mappings` using `leagueId` and `teamIds`
- In each GM's record in the "gm" collection, add a key-value pair of `sportYear` to `teamId`

- Update carryover FAAB
- Update the "currentRosterLeagues" variable with new sport + year for updated rosters

- Payout the winners of the sport
- Conduct the lottery for the next season's supplementary draft
- In Commissioner Actions, select "Complete Sport with Playoffs" and assign Playoff Points for playoff winners
  ~~- Remove the `sportYear` from the `globalVariables.globalVariables.dynasty.inSeasonLeagues` array~~
  ~~- Add playoff points to season sport standings~~

##### When a trade occurs

- In Commissioner Actions, `Enter Trade History` so the trade appears on the Trade History
- If future draft picks are involved, `Trade Draft Picks` to update future Draft Boards and Trade Asset Dashboards
- Manually execute all available aspects of the trade
- Ping involved GMs to let them know the trade has been processed and if there are any illegal rosters/lineups as a result, that the GM has to fix it before next lineup lock

##### Adding draft results

- From Fantrax, download .csv of the draft results
- Remove all quotation marks from the .csv
- Replace all full team names with GM abbreviations (ie Wesley Chipeco -> CHIP)
- If a pick was traded, at the end of the row, add a comma and the GM who traded away the pick. (The receiving GM is already represented by)
- Add the .csv to the "resources/data" directory with filename `draft-results-<sport>-<year>.csv`

### Website Updates

See: https://tinyurl.com/trifectawebdoc
