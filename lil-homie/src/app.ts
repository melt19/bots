import 'dotenv/config'
import { ChatInputCommandInteraction, Client, Events, GatewayIntentBits } from 'discord.js'
import { joinVoice, ping, server } from "./commands.js"
import { deployCommands } from './deploy-commands.js';

const { DISCORD_TOKEN } = process.env

const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages ] })

deployCommands()

client['commands'] = {}
client['commands'][ping.data.name] = ping
client['commands'][server.data.name] = server
client['commands'][joinVoice.data.name] = joinVoice

client.once(Events.ClientReady, ( ) => console.log(`${client.user?.tag} has logged in`))

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand) return

  const chatInteraction = interaction as ChatInputCommandInteraction 
  await client['commands'][chatInteraction.commandName].execute(interaction)
})

client.login(DISCORD_TOKEN)