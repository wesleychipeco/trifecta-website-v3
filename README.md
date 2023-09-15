### Manual Commissioner To-do Actions

## Fantasy League Commissioner Upkeep

- Set draft date and owner selection slot via reverse regular season standings of 2 sports ago
- After draft, organize division into Evens and Odds
- Create schedule based off of Trifecta Schedules Google sheet (Rank teams in each division E1 to E5 and O1 to O5 via last same sport season's standings)
- Manually edit each team's H2H schedule
- During playoffs, change initial consolation bracket matchup to be 7 vs 10 and 8 vs 9 instead of ESPN's ladder setup

## Website Related

- Each season's rule changes, update Trifecta League Manual accordingly
- Enter MongoDB data (see **Data that needs to be updated in MongoDB manually** below)

## START/END NEW SPORT

To start a sport, set its "seasonStarted" and "inSeason" of that sport to `true`  
If "seasonStarted" is `false`, standings will not be displayed at all  
To end a sport, set its "seasonStarted" to `true` and "inSeason" to `false` --- equivalent to "seasonEnded" = `true`  
Then immediately manually add `playoffPoints` and `totalTrifectaPoints` to sports's `trifectaStandings` for each owner, putting ? for playoff points and same total while playoffs are happening until playoffs finish
Code looks for "seasonStarted" = `true` and "inSeason" = `false` to decide to look for `playoffPoints` and `totalTrifectaPoints`
~~Also for each owner, go to the that owner's current year's matchups and scrape the just completed season~~

## START NEW TRIFECTA SEASON

Update `seasonVariables` collection with new "currentYear", each sport's variables (set "basketball": "seasonStarted" and "inSeason" to true, set everything else to false)
Set `basektballAhead` to true, which will allow basketball of next trifecta season plus football of previous season to be updated
Update `teamNumbersPerSport` collection for new Trifecta Season (per Trifecta season, maps "teamNumber" to "ownerNames") - used in Matchups  
Update `teamLists` collection for new Trifecta Season (per Trifecta Season, array of participating "ownerIds") - used in Trifecta Standings
Then to update "ALL" matchups to include the just completed Trifecta season, ~~go to the commissioner page and scrape~~ have to do manually as of now

## ADD NEW TRIFECTA OWNER

Add new owner to `allTimeTeams` collection in Mongo (matchups dropdown will auto populate with current season) - used in Matchups  
If not already updated, update `teamNumbersPerSport` collection (per Trifecta season, maps "teamNumber" to "ownerNames") - used in Matchups  
If not already updated, update `teamLists` collection (per Trifecta Season, array of participating "ownerIds") - used in Trifecta Standings  
`ownerIds` and `ownerTeamNumbersList` are not used, but rather both just refernce collections for visual check via the UI

## Each time a new collection is created in MongoDB, to be able to interact with it, need to first add rules in Stitch

- Go to MongoDB Realm tab
- Click on correct, registered application
- Go to "Rules" tab on sidebar and add rules for Read/Write to collection

## Data that needs to be updated in MongoDB manually

- After sport's playoffs are complete, playoff points and total trifecta points
- Trade History
- Hall of Fame (at end of Trifecta season)
- Owner Profiles (at end of Trifecta season)
- Owner Matchups (at end of Trifecta season) [Need to make script that will do this automatically]

## Pages that pull live data from API

- Individual standings of sports that are in-season (only regular season standings)
- Trifecta standings of completely finished (regular season and playoffs) sports

### Website Development and AWS Stuff

## AWS Architecture

- NameCheap Domain -> ELB with SSL termination -> EC2 instance running yarn server (in AutoScaling Group)

## Deployment Instructions

- Log into AWS console
- SSH into EC2 instance
- While in EC2 instance...
  - Attach to react screen `screen -x react`
  - Kill screen
  - Create new build folder with date `mkdir build-9-14`
- While on local machine...
  - To save previous build, rename build folder to something for a "previous version" `build-8-17`
  - Build and package the code at the root directory `yarn build`
  - While in Downloads folder, "scp" the build directory to the directory in the EC2 instance `scp -ri "<keypair>.pem" ..\Documents\trifecta-website-v3\build\* ec2-user@<ec2-instance-ip>:build-9-14/.`
- Back on EC2 instance...

  - Serve the packaged server `serve -s build-9-14/`
  - Detach from screen `ctrl + a + d`

- If server changes are needed, "scp" the proxy-server directory to the EC2 instance and run `yarn start`

## Each year reboot

- Each trifecta season, create new gmail account `trifectacommissioner<year>@gmail.com`
- Sign up for free AWS tier
- In November, renew trifectafantasyleague domain
- Create SSL certificate in Amazon Certificate Manager (ACM)
  - In ACM, request a certificate for \*.trifectafantasyleague.com
  - Login to DNS validation (NameCheap) and add CNAME host and target from ACM in order to validate
- Create Load Balancer Security Group
  - Allow inbound traffic rules
    - HTTP on Port 80 from all sources (0.0.0.0/0)
    - HTTPS on Port 443 from all sources (0.0.0.0/0)
  - Modify outbound traffic rule
    - All traffic, all protocol, all port range, destination is EC2 Security Group (go back and fill in after creating EC2 security group)
- Create EC2 Security Group
  - Allow inbound traffic rules
    - SSH on Port 22
    - Custom TCP on Port 3000 from all traffic
    - Custom TCP on Port 3000 from Load Balancer Security Group
- Create Launch Template
  - Specify AMI, instance type, create new key pair, desired capacity
  - Select EC2 security group to use
- Create Auto Scaling Group
  - After creating Launch Template, under "Actions" button, "Create Auto Scaling group"
  - Choose availability zones, subnets, and desired capacities
- Launch Instances from Template (from EC2 instance page)
- Check that webserver is up and reachable from "Public IPv4 DNS" port 3000
- Create Application Load Balancer
  - Internet-facing
  - ipv4
  - Webserver Target Group receiving HTTP traffic on port 3000
  - 2 Listeners: 1) HTTP on Port 80 and 2) HTTPS on Port 443 (SSL termination with ACM cert)
  - Make available in all AZs
  - Select Load Balancer security group
  - Create Target Group for routing traffic target
    - Register Target EC2 instance to the Target Group
- Register Load Balancer domain to DNS targets (NameCheap)
- Check that website is reachable via trifectafantasyleague.com domain
  -------------- OLD INSTRUCTIONS ---------------
- Create SSL termination in Amazon Certificate Manager (ACM)
  - Request a certificate for: \*.trifectafantasyleague.com
  - Use DNS validation to validate ownership of domain (login via NameCheap)
- Create Application Load Balancer
  - Internet-facing
  - ipv4
  - 2 Listeners: 1) HTTP on Port 80 and 2) HTTPS on Port 443
  - Make available in all AZs
  - Attach ACM SSL termination certificate to ELB
  - Create new Security Group
    - Allow all traffic into ELB only on ports 80 and 443
  - Create Target Group for routing traffic target
    - Webserver Target Group receiving only HTTP traffic on port 3000
    - Register Target EC2 instance to the Target Group (After create EC2 instance)
- Create Auto Scaling Group
  - First create Launch Template
    - Specify AMI, instance type, key pair, desired capacity, minimum and maximum capacity
    - Create new EC2-specific security group, only allowing SSH access and TCP connections on Port 3000 from ELB SG
    - Under "Advanced Details" copy and paste in `user-data.sh` bash script in this repo
  - Next create Auto Scaling Group
    - Configure settings, scaling policies, and namely, attaching to an existing load balancer
  - EC2 instance should be launched
  - Check that user data script is run and webserver is active and reachable at localhost:3000
  - Check that website is reachable via load balancer public IP DNS name
- Register public DNS name of ELB to trifectafantasyleague.com DNS resolution (on NameCheap)
