const express = require("express");
const process = require("process");
const fs = require("node:fs");
const steamWebApiKey = process.env.STEAM_WEB_API_KEY;
const SteamAPI = require("steamapi");
const steam = new SteamAPI(steamWebApiKey);
const app = express();
let cachedAppList = {};
const idRegex = /^[\d]+$/;

const getGameAchievements = async (id) => {
  return await steam.getGameAchievements(id);
};

const getGameSchema = async (id) => {
  let schema = await steam.getGameSchema(id);
  let availableGameStats = schema["availableGameStats"];
  return availableGameStats["achievements"];
};

const getAppList = async () => {
  let appList = await steam.getAppList();
  let appListToLowerCase = {};
  appList.forEach((app) => {
    appListToLowerCase[app.name.toLowerCase()] = {
      appid: app.appid,
      name: app.name,
    };
  });

  return appListToLowerCase;
};

const getSteamAchievementsById = async (id) => {
  const gameAchievements = await getGameAchievements(id);
  const gameSchemaArray = await getGameSchema(id);
  let steamAchievements = [];
  let counter = 0;

  gameSchemaArray.forEach((gameSchema) => {
    const percent = gameAchievements[gameSchema.name];
    const achievement = {
      id: counter + 1,
      name: gameSchema.displayName,
      percent: percent,
      description: gameSchema.description,
      iconUrl: gameSchema.icon,
    };
    steamAchievements.push(achievement);
    counter++;
  });

  return steamAchievements;
};

const getSteamAchievementsByName = async (name) => {
  if (isNullOrEmpty(name)) {
    console.error(`Error: [${name}]`);
    return;
  }
  let cachedName = name.toLowerCase();
  const cachedApp = cachedAppList[cachedName];
  if (isNullOrEmpty(cachedApp)) {
    console.error(`Invalid app name: [${name}]`);
    return;
  }
  let appId = cachedAppList[name].appid;
  return await getSteamAchievementsById(appId);
};

const isNullOrEmpty = (str) => {
  return str === undefined || str === null || str === "";
};

const isIdValid = (id) => {
  return idRegex.test(id) && id > 0;
};

const isNameValid = (name) => {
  if (typeof name === "string") {
    const nameTrim = name.trim();
    return nameTrim !== "" && nameTrim !== " " && nameTrim !== "%20";
  }
  return false;
};

app.get("/achievements", async (req, res) => {
  const id = req.query.id;
  const name = req.query.name;
  if (isNullOrEmpty(id) && isNullOrEmpty(name)) {
    res
      .status(400)
      .send(
        "Bad Request. Either the 'id' or 'name' query parameter must be set."
      );
    return;
  }
  if (!isIdValid(id) && !isNameValid(name)) {
    res
      .status(400)
      .send(
        "Bad Request. Either the 'id' or 'name' query parameter must be set."
      );
    return;
  }
  try {
    if (id) {
      res.send(await getSteamAchievementsById(id));
      return;
    }
    if (name) {
      if (!cachedAppList[name]) {
        res.status(404).send(`Error 404. [${name}] not found.`);
        return;
      }
      res.send(await getSteamAchievementsByName(name));
      return;
    }
  } catch (err) {
    res.status(404).send(err + `. Error 404. Not found.`);
    console.error(err);
  }
  res.status(500).send("Internal Server Error.");
});

app.get("/applist", (req, res) => {
  const name = req.query.name;
  if (isNullOrEmpty(name)) {
    res.status(400).send("Bad Request. 'name' query parameter must be set.");
    return;
  }
  if (!isNameValid(name)) {
    res.status(400).send("Bad Request. 'name' query parameter must be set.");
    return;
  }
  if (!cachedAppList[name]) {
    res.status(404).send(`Error 404. [${name}] app not found.`);
    return;
  } else {
    res.send(cachedAppList[name]);
  }
  res.status(500).send("Server error.");
});

app.get("/applist-filter", async (req, res) => {
  const name = req.query.name;
  if (isNullOrEmpty(name)) {
    res.status(400).send("Bad Request. 'name' query parameter must be set.");
    return;
  }

  if (!isNameValid(name)) {
    res.status(400).send("Bad Request. 'name' query parameter must be set.");
    return;
  }
  let numOfApps = 0;
  // let appsWithAchievements = {};

  const filteredApps = Object.keys(cachedAppList)
    .filter((key) => key.includes(name))
    .reduce((apps, key) => {
      if (numOfApps <= 10 && apps[key].hasAchievements) {
        apps[key] = cachedAppList[key];
        numOfApps++;
      }
      return apps;
    }, {});

  // const checkFilteredAppsForAchievements = async () => {
  //   try {
  //     for (const app in filteredApps) {
  //       await fetch(
  //         `http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${filteredApps[app].appid}&format=json`
  //       )
  //         .then((response) => response.json())
  //         .then((data) => {
  //           if (
  //             Object.keys(data).length > 0 &&
  //             data.achievementpercentages.achievements.length > 0
  //           ) {
  //             appsWithAchievements[app] = filteredApps[app];
  //           }
  //         });
  //     }
  //   } catch (err) {
  //     console.error(err);

  //     throw err;
  //   } finally {
  //     res.send(appsWithAchievements);
  //   }
  // };

  await filteredApps();
});

const checkCachedAppListForAchievements = async () => {
  try {
    console.log("Checking Apps For Achievements...");
    console.log("Apps Checked = ");
    let appCounter = 0;
    for (const app in cachedAppList) {
      await fetch(
        `http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${cachedAppList[app].appid}&format=json`
      )
        .then((response) => response.json())
        .then((data) => {
          appCounter++;
          if (
            Object.keys(data).length > 0 &&
            data.achievementpercentages.achievements.length > 0
          ) {
            cachedAppList[app].hasAchievements = true;
          } else {
            cachedAppList[app].hasAchievements = false;
          }
        });
      if (appCounter % 1000 === 0) {
        console.log(`Apps Checked = ${appCounter}`);
        // process.stdout.write(`${appCounter}...`);
      }
    }
  } catch (err) {
    console.error(err);

    throw err;
  } finally {
    console.log(" ");
    console.log("________________");
    console.log("***** COMPLETED *****");
    console.log("________________");
    writeCachedAppListToFile();
  }
};

const writeCachedAppListToFile = () => {
  console.log("Writing to cachedAppList.json...");
  try {
    fs.writeFileSync("./cachedAppList.json", JSON.stringify(cachedAppList));
  } catch (err) {
    console.error(err);

    throw err;
  }
};

const readCachedAppListFromFile = async () => {
  try {
    console.log("Reading From cachedAppList.json...");
    const appList = fs.readFileSync("./cachedAppList.json", "utf8");
    console.log("*** FILE READ ***");
    JSON.parse(appList);
  } catch (err) {
    console.error("Server error reading App List.");
    console.log("Getting App List from Steam Web API...");
    cachedAppList = await getAppList();
    await checkCachedAppListForAchievements();

    throw err;
  }
};

module.exports = {
  isIdValid,
  isNullOrEmpty,
  isNameValid,
  getSteamAchievementsById,
  getSteamAchievementsByName,
};

const init = async () => {
  console.error("ExpressJS Server Initializing...");
  try {
    cachedAppList = await readCachedAppListFromFile();
  } catch (err) {
    console.error("Server error getting App List.");
  }
  app.listen(10000, "127.0.0.1", function () {
    console.log("... port %d in %s mode", 10000, "127.0.0.1");
  });
  console.log("ExpressJS Server Started.");
};

init();
