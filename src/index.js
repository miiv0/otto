import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const loadCommands = async (dir = "./commands") => {
  const dirpath = resolve(__dirname, dir);
  const entries = await readdir(dirpath, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
    .map((file) => resolve(file.parentPath, file.name));

  const commands = new Collection();

  for (const file of files) {
    const command = (await import(file)).default;

    commands.set(command.info.name, command);
  }

  return commands;
};

const registerCommands = async (commands, token, clientId, guildId = null) => {
  const rest = new REST().setToken(token);

  try {
    await rest.put(
      guildId
        ? Routes.applicationGuildCommands(clientId, guildId)
        : Routes.applicationCommands(clientId),
      { body: commands.map((command) => command.info.toJSON()) },
    );
  } catch (error) {
    console.error(error);
  }
};

const run = async () => {
  const token = process.env.OTTO_TOKEN;
  const clientId = process.env.OTTO_CLIENT_ID;
  const guildId = process.env.OTTO_GUILD_ID;

  if (!token) throw Error("Environment variable OTTO_TOKEN must be set.");
  if (!clientId)
    throw Error("Environment variable OTTO_CLIENT_ID must be set.");

  const client = new Client({
    intents: [GatewayIntentBits.GuildVoiceStates],
  });

  const commands = await loadCommands();
  await registerCommands(commands, token, clientId, guildId);

  await client.login(token);
};

run();
