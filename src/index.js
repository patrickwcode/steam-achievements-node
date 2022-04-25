const express = require("express");
const process = require("process");
const steamWebApiKey = process.env.STEAM_WEB_API_KEY;
const SteamAPI = require("steamapi");
const steam = new SteamAPI(steamWebApiKey);
const app = express();
const server = app.listen();
let cachedAppList = {};
const emojiRegex =
    /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu;
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

// Add test for this function for steamAchievementsById
// use id = 440 for test suite
// expect(getSteamAchievementsById(440)).to.equal({
// name: "Team Fortress 2",
// id: 440,
// });

// Check other functions for testing

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
    if (typeof name === 'string') {
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

app.get("/applist-filter", (req, res) => {
    let counter = 0;
    const name = req.query.name;
    if (isNullOrEmpty(name)) {
        res.status(400).send("Bad Request. 'name' query parameter must be set.");
        return;
    }
    if (!isNameValid(name)) {
        res.status(400).send("Bad Request. 'name' query parameter must be set.");
        return;
    }
    const filteredApps = Object.keys(cachedAppList)
        .filter((key) => key.includes(name))
        .reduce((apps, key) => {
            if (counter <= 60) {
                apps[key] = cachedAppList[key];
                counter++;
            }
            return apps;
        }, {});
    // res.send(Object.keys(filteredApps).splice(1, 30));
    res.send(filteredApps);
    res.status(500).send("Server error.");
});

module.exports = {
    isIdValid,
    isNameValid,
};

init = async () => {
    try {
        cachedAppList = await getAppList();
    } catch (err) {
        console.error("Server error getting App List.");
    }
    app.listen(10000);
};

init();
