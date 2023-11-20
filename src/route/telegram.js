"use strict";
const { Telegraf } = require("telegraf");
const { Nlpbot } = require("../service/nlpSvc");
require('dotenv').config()

const BOTTOKEN = process.env.TG_TOKEN;
const WEBDOMAIN = process.env.WEBDOMAIN;
const PATH = "/telegram/" + BOTTOKEN;

const bot = new Telegraf(BOTTOKEN);

const telegramRoute = async (fastify, options, done) => {
  fastify.get("/test", (req, reply) => {
    reply.send({ result: "successful" });
  });

  // use createWebHook to set wekhook url for the first time
  // https://api.telegram.org/bot<token>/getWebhookInfo check if webhook is set
  // if set correctly, then use webhookCallback instead of recreating webhook
  // const webhook = await bot.createWebhook({ domain: WEBDOMAIN, path: PATH });
  const webhook = bot.webhookCallback(PATH);

  fastify.post("/" + BOTTOKEN, webhook);

  bot.start(async (ctx) => await ctx.reply("Hello"));
  bot.help(async (ctx) => await ctx.reply("this is help"));
  bot.command(
    "chatid",
    async (ctx) => await ctx.reply(`${ctx.message.chat.id}`)
  );
  bot.hears(/.+/, async (ctx) => {
    if (ctx.message.text.length > 10) {
      try {
        const response = await Nlpbot(ctx.message.text);
        if (response.score > 0.65 && response.answer){
          await ctx.reply(`${response.answer}`,{parse_mode:"HTML"});
        }
        else{
          await ctx.reply(`score is too low`,{parse_mode:"HTML"});
        }
      } catch (error) {
        fastify.log.error(error);
        await ctx.reply("error in nlpbot");
      }
    } 
    else {
      await ctx.reply(`${ctx.message.text}`);
    }
  });

  done();
};

module.exports = { telegramRoute };
