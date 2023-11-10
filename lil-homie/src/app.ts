import 'dotenv/config'
import { ChatInputCommandInteraction, Client, Events, GatewayIntentBits } from 'discord.js'
import { joinVoice, queuePlaylist, trnStats } from "./commands.js"
import { deployCommands } from './deploy-commands.js';

const { DISCORD_TOKEN } = process.env

const client = new Client({ intents: [ 
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.MessageContent, 
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildVoiceStates,
] })

deployCommands()

client['commands'] = {}
client['commands'][joinVoice.data.name] = joinVoice
client['commands'][trnStats.data.name] = trnStats
client['commands'][queuePlaylist.data.name] = queuePlaylist

client.once(Events.ClientReady, ( ) => console.log(`${client.user?.tag} has logged in`))

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand) return

  const chatInteraction = interaction as ChatInputCommandInteraction 
  await client['commands'][chatInteraction.commandName].execute(interaction)
})

client.login(DISCORD_TOKEN)