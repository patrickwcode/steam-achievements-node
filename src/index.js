const express = require("express");
const process = require("process");
const steamWebApiKey = process.env.STEAM_WEB_API_KEY;
const SteamAPI = require("steamapi");
const steam = new SteamAPI(steamWebApiKey);
const app = express();
const server = app.listen();
let cachedAppList = {};

getGameAchievements = async (id) => {
  return await steam.getGameAchievements(id);
};

getGameSchema = async (id) => {
  let schema = await steam.getGameSchema(id);
  let availableGameStats = schema["availableGameStats"];
  return availableGameStats["achievements"];
};

getAppList = async () => {
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

getSteamAchievementsById = async (id) => {
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

getSteamAchievementsByName = async (name) => {
  let appId = cachedAppList[name].appid;
  return await getSteamAchievementsById(appId);
};

app.get("/achievements", async (req, res) => {
  try {
    if (req.query.id) {
      res.send(await getSteamAchievementsById(req.query.id));
      return;
    } else if (req.query.name) {
      res.send(await getSteamAchievementsByName(req.query.name));
      return;
    } else if (!req.query.name || !req.query.id) {
      res
        .status(400)
        .send("Bad Request. Required parameters 'id' or 'name' are missing.");
      return;
    } else {
      res.status(500).send("Server error.");
      return;
    }
  } catch (err) {
    res.status(404).send(err + ". Error 404. Not found.");
    console.error(err);
    return;
  }
});

app.get("/applist", (req, res) => {
  if (req.query.name && cachedAppList[req.query.name]) {
    res.send(cachedAppList[req.query.name]);
    return;
  } else if (!req.query.name) {
    res.status(400).send("Bad Request. Required parameter 'name' is missing.");
    return;
  } else if (!cachedAppList[req.query.name]) {
    res.status(404).send("Error 404. App not found.");
    return;
  } else {
    res.status(500).send("Server error.");
    return;
  }
});

app.get("/applist-filter", (req, res) => {
  if (req.query.name) {
    const filteredApps = Object.keys(cachedAppList)
      .filter((key) => key.includes(req.query.name))
      .reduce((apps, key) => {
        apps[key] = cachedAppList[key];
        return apps;
      }, {});
    res.send(filteredApps);
  } else if (!req.query.name) {
    res.status(400).send("Bad Request. Required parameter 'name' is missing.");
    return;
  } else if (!cachedAppList[req.query.name]) {
    res.status(404).send("Error 404. App not found.");
    return;
  } else {
    res.status(500).send("Server error.");
    return;
  }
});

init = async () => {
  try {
    cachedAppList = await getAppList();
  } catch (err) {
    console.log("Server error getting App List.");
  }
  app.listen(10000);
};

init();
