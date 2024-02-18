import 'dotenv/config'
import { Channel, ChatInputCommandInteraction, Client, Events, GatewayIntentBits, Message } from 'discord.js'
import { joinVoice, queuePlaylist, trnStats } from "./commands.js"
import { deployCommands } from './deploy-commands.js';

const { DISCORD_TOKEN, MUSIC_CHANNEL_ID } = process.env

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

client.on(Events.MessageCreate, async interaction => {
  if (interaction.channelId !== MUSIC_CHANNEL_ID) return
  
  console.log(interaction)
  const { content, author: { bot, id } } = interaction
  if (bot) return
  const channel = await client.channels.fetch(MUSIC_CHANNEL_ID)
  if (channel.isTextBased()) channel.send({ content: `p! play ${content}`})
  

})

client.login(DISCORD_TOKEN)