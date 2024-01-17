const express = require("express");
const process = require("process");
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
    res.status(400).send("Bad Request. Either the 'id' or 'name' query parameter must be set.");
    return;
  }
  if (!isIdValid(id) && !isNameValid(name)) {
    res.status(400).send("Bad Request. Either the 'id' or 'name' query parameter must be set.");
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

  const filteredApps = Object.keys(cachedAppList)
    .filter((key) => key.includes(name))
    .reduce((apps, key) => {
      if (numOfApps < 50) {
        apps[key] = cachedAppList[key];
        numOfApps++;
      }
      return apps;
    }, {});

  res.send(filteredApps);
  res.status(500).send("Server error.");
});

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
    cachedAppList = await getAppList();
  } catch (err) {
    console.error("Server error getting App List.");
  }
  app.listen(10000, '127.0.0.1', function () {
    console.log("... port %d in %s mode", 10000, '127.0.0.1');
  });
  console.log("ExpressJS Server Started.");
};

init();
// setInterval(init, 86400000);  // reset connection in 24 hours