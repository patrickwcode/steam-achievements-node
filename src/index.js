const express = require('express')
const port = 3000
let steamWebApiKey;

// Read and get Steam Web API key from JSON file.
const fs = require('fs')
const data = fs.readFileSync("steam-web-api-key.json", "utf8")
dataJSON = JSON.parse(data).steamWebApiKey
steamWebApiKey = dataJSON

const SteamAPI = require('steamapi')
const steam = new SteamAPI(steamWebApiKey)
const app = express()
let cachedAppList = {}

getGameAchievements = async (id) => {
    let achievements = await steam.getGameAchievements(id)
    return achievements
}

getGameSchema = async (id) => {
    let schema = await steam.getGameSchema(id)
    availableGameStats = schema['availableGameStats']
    achievements = availableGameStats['achievements']
    return achievements
}

getAppList = async () => {
    let appList = await steam.getAppList()
    let appListToLowerCase = {}
    appList.forEach(app => {
        appListToLowerCase[app.name.toLowerCase()] = {
            appid: app.appid,
            name: app.name
        }
    })
    return appListToLowerCase
}

getSteamAchievements = async (id) => {
    let gameAchievements = await getGameAchievements(id)
    let gameSchema = await getGameSchema(id)
    let gameSchemaKeys
    let steamAchievements = []
    let counter = 0;

    Object.entries(gameAchievements).forEach(([key, value]) => {
        gameSchemaKeys = gameSchema[Object.keys(gameSchema)[counter]]
        steamAchievements.push({
            id: counter + 1,
            name: gameSchemaKeys.displayName,
            percent: value.toFixed(1),
            description: gameSchemaKeys.description,
            iconUrl: gameSchemaKeys.icon
        })
        counter++
    })
    return steamAchievements
}

app.get('/achievements', async (req, res) => {
    res.send(await getSteamAchievements(req.query.id));
})

app.get('/applist', async (req, res) => {
    res.send(await getAppList())
})

app.get('/app', (req, res) => {
    res.send(cachedAppList[req.query.name])
})

init = async () => {
    cachedAppList = await getAppList()
    app.listen (10000)
}

init()

