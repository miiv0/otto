import { Client, GatewayIntentBits } from "discord.js";

const run = async () => {
  const token = process.env.OTTO_TOKEN;
  const clientId = process.env.OTTO_CLIENT_ID;

  if (!token) throw Error("Environment variable OTTO_TOKEN must be set.");
  if (!clientId) throw Error("Environment variable OTTO_GUILD_ID must be set.");

  const client = new Client({
    intents: [GatewayIntentBits.GuildVoiceStates],
  });

  await client.login(token);
};

run();
