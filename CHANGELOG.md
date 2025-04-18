### PR links (https://github.com/wesleychipeco/trifecta-website-v3/pulls?q=is%3Apr+is%3Aclosed)

### [PR-99] - 2024-04-08

- README and architecture diagram update

### [4.2.0] - 2025-04-05

### [PR-98] - 2025-04-05

- Resolve React warnings

### [PR-97] - 2025-04-05

- New API endpoints for adding league events and league announcements. And clean up display
- Bugfix to prevent infinite re-renders for Tables caused by hiddenColumns check

### [4.1.0] - 2025-04-02

### [PR-96] - 2025-04-02

- Live dynasty standings. Refreshed and displayed daily after sports standings are updated

### [PR-95] - 2025-03-29

- Bugfix. Total player baseball stats adding IP & convert to string

### [4.0.0] - 2025-03-26

### [PR-94] - 2025-03-26

- Added Baseball 2025 Draft Results
- Fixed bug where Supplemental Draft Result Boards were getting snaked

### [PR-93] - 2025-03-03

- New commissioner action: add leagueId and teamIds for a new sport via UI instead of manually through DB

### [PR-92] - 2025-02-20

- Constants for sport name strings
- Update last scrape string console log
- New commissioner action: remove completed draft picks from GM's assets

### [PR-91] - 2025-02-20

- Throttle API requests to Fantrax for /rosters and /player-stats scraping
- Include changes to Google doc about httpd server updates for new endpoints

### Changed

## [PR-90] - 2025-02-14

- Refresh site data via API requests to backend server on cron job schedules

### Added & Changed

### [PR-89] - 2025-02-14

- Covnert proxy server into a backend API server that does the scraping, updating, formatting, and calculating of Fantrax data for 3x5 Trifecta use. Covers: sport standings, rosters (Trade Asset Dashboard), transaction history and player stats (individual seasons and totals)
- Move all the existing scraping logic for these pages from react frontend to backend server

### [PR-88] - 2025-01-16

- Fix football stats scrape

### [PR-87] - 2025-01-16

- Miscellaneous changes
- Complete sport with playoff points and globalVariables commissioner actions
- Fix scrape and display of Football Points For and Points Against in standings
- Now use local time instead of UTC to determine last scraped day

## [3.10.2] - 2024-10-12

### Changed

### [PR-86] - 2024-10-12

- Handle traded supplemental draft picks in draft grid display

## [3.10.1] - 2024-09-14

### Changed

### [PR-85] - 2024-09-14

- Fix trading already set grid draft picks

## [3.10.0] - 2024-09-02

### Added

### [PR-84] - 2024-09-02

- Football startup draft results

### [PR-83] - 2024-09-02

- Added past standings to navbar
- Added Week/Period number to transactions history table
- Fixed pitcher stats bug
- Added football stats

### [PR-82] - 2024-06-16

- Fix redirect to proxy server via HTTPS port 443

## [3.9.1] - 2024-04-08

### Added

#### [PR-81] - 2024-04-08

- OG trifecta redirect fix
- Fix baseball stats scraper
- Enable just display player stats for non-in-season sports
- Add spinner for player stats table
- Fix 3x5 dynasty points page

## [3.9.0] - 2024-03-16

### Added

#### [PR-80] - 2024-03-15

- Add single season baseball stats

### Added

#### [PR-79] - 2024-03-14

- Add preliminary (single season) basketball stats

## [3.8.3] - 2024-01-02

### Updated

#### [PR-78] - 2024-01-02

- Finalize completed OG Trifecta league and site

## [3.8.2] - 2023-11-24

### Added

#### [PR-77] - 2023-11-21

- Display all available assets on trade asset home screen

### Updated

#### [PR-76] - 2023-11-21

- Mobile styling fixes for transactions history & draft boards

### Added

## [3.8.1] - 2023-11-19

### Updated

#### [PR-75] - 2023-11-19

- Hotfix for draft results display bug

### Added

#### [PR-74] - 2023-11-19

- Not Found page

### Updated

#### [PR-73] - 2023-11-19

- Fix all React lint warnings

### Updated

#### [PR-72] - 2023-11-19

- Fix some mobile styling on Trade History and Transactions History

## [3.8.0] - 2023-11-13

### Added

#### [PR-71] - 2023-11-13

- Transactions History! Better than Fantrax
- Implement saving to MongoDB and don't scrape when applicable

### Added

#### [PR-70] - 2023-11-06

- Trade future draft picks
- Transfer draft pick asset
- Add `tradedTo` to draft board

## [3.7.3] - 2023-10-28

### Added

#### [PR-69] - 2023-10-28

- Colors per GM on draft boards

### Added

#### [PR-68] - 2023-10-28

- Assign supplementary draft slots. Create grid and update GM asset draft pick text
- Also better use of global exported CONSTANTS
- Also rename all uses of "supplementary" to "supplemental"

### Added

### Added

#### [PR-67] - 2023-10-25

- Display future non-assigned supplementary pick draft board

### Added

#### [PR-66] - 2023-10-24

- Save initialized supplementary draft picks to drafts collection

## [3.7.2] - 2023-10-22

### Added

#### [PR-65] - 2023-10-22

- Refactor including moving all dynasty screens files into own folders
- Commissioner styles cleanup
- Fix a bug preventing load of Trade Asset Dashboard

### Added

#### [PR-64] - 2023-10-19

- Commissioner action to initialize supplementary draft picks and save to DB

### Added

#### [PR-63] - 2023-10-16

- Commissioner action to assign startup draft picks and save to DB
- Display future draft board grid (also potentially including traded draft picks)

### Added

#### [PR-62] - 2023-10-15

- Commissioner Actions home page
- Commissioner Enter Trade fully working
- Rename trade history player search label to "assets"

## [3.7.1] - 2023-10-14

### Added

#### [PR-61] - 2023-10-14

- Enable Google Analytics

## [3.7.0] - 2023-10-13

### Added

#### [PR-60] - 2023-10-13

- Changelog and website versioning

### Updated

#### [PR-59] - 2023-10-11

- Draft results board display

### Updated

#### [PR-58] - 2023-10-10

- Normalize sport dynasty standings with playoffPoints: 0 for easy modification later

### Updated

#### [PR-57] - 2023-10-05

- README updates for new process

### Updated

#### [PR-56] - 2023-09-23

- Easily run locally & other fixes

### Updated

#### [PR-55] - 2023-09-14

- Transition from demo-era to era1

### Updated

#### [PR-54] - 2023-09-14

- Fix to change field used to pull team names for standings. ESPN API change

### Added

#### [PR-53] - 2023-08-17

- Fixes to work on EC2
- Resolve CORS issues and serving static react files

## [3.6.0] - 2023-08-12

### Added

#### [PR-52] - 2023-08-12

- ULTIMATE DYNASTY MERGE
- Merge all previous dynasty PRs from one branch

### Updated

#### [PR-51] - 2023-08-12

- Fix baseball standings error

### Updated

#### [PR-51] - 2023-08-12

- Fix baseball standings error

### Added

#### [PR-50] - 2023-08-06

- Phone compatibility styling. Lots of styling fixes

### Added

#### [PR-48] - 2023-07-16

- Re-theme using new logos and colors!

### Added

#### [PR-47] - 2023-06-18

- Demo dynasty era

### Updated

#### [PR-46] - 2023-04-08

- Trade asset dashboard access for appropriate signed in user

### Updated

#### [PR-45] - 2023-04-05

- Hotfix: default argument & column sort order

### Added

#### [PR-44] - 2023-03-22

- Sign in working. Auth0 integration

### Added

#### [PR-43] - 2023-01-26

- Compile total matchups page

### Added

#### [PR-42] - 2023-01-12

- Trade block part 1
- Including add and remove from trade block, manual type text entry, and saving

### Added

#### [PR-41] - 2023-01-11

- Add FAAB to trade asset dashboard

### Update

#### [PR-40] - 2023-01-02

- Fix errors in matchups screen

### Added

#### [PR-39] - 2023-01-01

- Trade asset dashboard. Working!

### Added

#### [PR-38] - 2022-12-28

- Static, manually updated 3x5 dynasty standings

### Added

#### [PR-37] - 2022-12-27

- Era indicator banner

### Added

#### [PR-36] - 2022-12-27

- League announcements and league calendar cleanup

### Added

#### [PR-35] - 2022-12-23

- Dynasty trade history

### Added

#### [PR-34] - 2022-12-23

- Expanded Current Standings expansion in navbar

### Added

#### [PR-33] - 2022-12-22

- League calendar (with side panel of upcoming events)

### Added

#### [PR-32] - 2022-12-15

- Sorting standings

### Added

#### [PR-31] - 2022-12-12

- Finish all sport standings

### Added

#### [PR-30] - 2022-12-11

- Create teamId to GM name mapping

### Added

#### [PR-29] - 2022-12-08

- Make new globalVariables collection to use for dynasty

### Added

#### [PR-28] - 2022-12-01

- Dynasty scrape set up
- Scrape standings, namely setting up proxy server to bypass CORS

### Added

#### [PR-27] - 2022-11-14

- Dynasty start
- New database and divergent pathing for dynasty vs trifecta
- Navbar, navigation paths, databases

## [3.5.0] - 2022-11-09

### Added

#### [PR-26] - 2022-11-09

- Compile matchups page

### Update

#### [PR-25] - 2022-11-01

- Fix userdata script & fix react warnings

### Added

#### [PR-24] - 2022-10-31

- Misc fixes
- League doc link
- Fix console warnings & highlighting on dropdowns

### Added

#### [PR-23] - 2022-10-31

- Hall of fame fixed

### Added

#### [PR-22] - 2022-10-30

- Bugfix. Basketball ahead logic

### Added

#### [PR-21] - 2022-10-30

- Absolute paths & consolidate stylesheets

## [3.4.0] - 2022-10-29

### Added

#### [PR-20] - 2022-10-29

- Automatic basketball ahead standings

### Added

#### [PR-19] - 2022-10-29

- Matchups screen

### Added

#### [PR-18] - 2022-10-25

- Owner profiles/records page

### Change

#### [PR-17] - 2022-10-22

- Standings refactor

### Added

#### [PR-16] - 2022-10-22

- Sport hall of fame finish

### Added

#### [PR-15] - 2022-10-19

- Scaffold hall of fame

## [3.3.0] - 2022-10-15

### Added

#### [PR-14] - 2022-10-15

- Top 3 table formatting

### Added

#### [PR-13] - 2022-10-09

- Football and trifecta standings

### Added

#### [PR-12] - 2022-10-01

- Navbar styling

### Added

#### [PR-11] - 2022-10-01

- Football standings with Top5Bottom5 styling

### Added

#### [PR-10] - 2022-02-22

- Baseball standings scrape not tested

### Added

#### [PR-9] - 2022-02-18

- Standings continued, handle case where display only, no scrape
- Modified lastScraped time and logic to live on MongoDB
- Fix pre-2020 standings and decimal rounding and sorting

### Added

#### [PR-8] - 2022-02-18

- Basketball standings (template for all standings)
- Also, splitting redux state into different slices
- Port over standings helper logic for Trifecta points and owner names

## [3.2.0] - 2022-02-12

### Added

#### [PR-7] - 2022-02-12

- Table sorting and filtering, including different implementation for trade history

### Added

#### [PR-6] - 2022-02-09

- Standard table component
- Trade history table

## [3.1.0] - 2022-02-06

### Added

#### [PR-5] - 2022-02-06

- Fix icon and tab name

### Added

#### [PR-4] - 2022-02-06

- Homescreen touchup

### Added

#### [PR-3] - 2022-02-05

- Navbar including sliding animation and styling

## [3.0.0] - 2022-02-04

### Added

#### [PR-2] - 2022-02-04

- AWS userdata script
- react-router-dom navigation
- mongodb realm

### Added

#### [PR-1] - 2022-02-03

- Create react project
