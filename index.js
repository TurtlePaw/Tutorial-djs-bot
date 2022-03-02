const jsh = require("discordjsh"); //Require discordjsh
const Discord = require("discord.js"); //Require discord.js
const config = require("./config.json"); //Get bot config

//Create a discordjsh client
const ClientBuilder = new jsh.Client({
    token: config.token,
    clientID: config.clientID,
    testGuildID: "948668505757220864"
})
.setCommandsDir("./commands") //Set commands directory
.setContextDir("./menus"); //Set context menus directory

//Create discord client
const client = ClientBuilder.create({
    intents: [
        "GUILDS"
    ],
    //...
});

//No need to do `client.login()`