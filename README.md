# steam-achievements-node
A Node.js Express server that gets Steam Achievements from the Steam Web API using the <a href="https://github.com/xDimGG/node-steamapi">node-steamapi</a> wrapper.  This feeds JSON data to my front end <a href="https://github.com/patrickwcode/SteamAchievementsReactJS/tree/master">React app</a>, which graphs all of the achievements accordingly.

When the user searches for an app, the server will do a new GET request to ensure a current list is used from Steam. I used Chai for testing queries to avoid possible response errors.
