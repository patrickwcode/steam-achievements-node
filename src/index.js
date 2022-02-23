const express = require('express')
const app = express()
const port = 3000
let steamWebApiKey;

// Read and get Steam Web API key from JSON file.
const fs = require('fs')
try {
    const data = fs.readFileSync("../steam-web-api-key.json", "utf8")
    dataJSON = JSON.parse(data).steamWebApiKey
    steamWebApiKey = dataJSON
} catch (err) {
    console.error(err)
}
const SteamAPI = require('steamapi')
const steam = new SteamAPI(steamWebApiKey)

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
    res.send(await getSteamAchievements(req.query.id))
})

app.listen(10000)