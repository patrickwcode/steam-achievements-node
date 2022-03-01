const express = require("express");
const process = require("process");
const steamWebApiKey = process.env.STEAM_WEB_API_KEY;
const SteamAPI = require("steamapi");
const steam = new SteamAPI(steamWebApiKey);
const app = express();
const server = app.listen();
server.setTimeout(10000);
let cachedAppList = {};
let timeoutController = null;

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
    } else if (req.query.name) {
      res.send(await getSteamAchievementsByName(req.query.name));
    } else {
      res
        .status(400)
        .send("Bad Request. Required parameters 'id' or 'name' are missing.");
    }
  } catch (err) {
    res.status(400).send(err);
    console.error(err);
  }
});

app.get("/applist", (req, res) => {
  res.send(cachedAppList[req.query.name]);
});

init = async () => {
  cachedAppList = await getAppList();
  app.listen(10000);
};

init();
