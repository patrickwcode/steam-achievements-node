const express = require("express");
const port = 3000;
let steamWebApiKey = process.env.STEAM_WEB_API_KEY;

// Read and get Steam Web API key from JSON file.
const fs = require("fs");
const data = fs.readFileSync("steam-web-api-key.json", "utf8");
dataJSON = JSON.parse(data).steamWebApiKey;
steamWebApiKey = dataJSON;

const SteamAPI = require("steamapi");
const steam = new SteamAPI(steamWebApiKey);
const app = express();
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
    } else {
      res.send(await getSteamAchievementsByName(req.query.name));
    }
  } catch (err) {
    console.error(err);
  }
});

app.get("/applist", async (req, res) => {
  res.send(cachedAppList[req.query.name]);
});

init = async () => {
  cachedAppList = await getAppList();
  app.listen(10000);
};

init();
