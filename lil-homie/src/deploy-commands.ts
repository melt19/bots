import 'dotenv/config'
import { REST, Routes } from 'discord.js'
import { joinVoice, queuePlaylist, trnStats } from "./commands.js";
import { CommandResponse } from './types.js';

const { DISCORD_TOKEN, CLIENT_ID } = process.env
export const deployCommands =() => { 
	const commands = []
	commands.push(joinVoice.data.toJSON())
	commands.push(trnStats.data.toJSON())
	commands.push(queuePlaylist.data.toJSON())

	// Construct and prepare an instance of the REST module
	const rest = new REST().setToken(DISCORD_TOKEN);

	// and deploy your commands!
	(async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`)

			// The put method is used to fully refresh all commands in the guild with the current set
			const data = await rest.put(
				Routes.applicationCommands(CLIENT_ID),
				{ body: commands },
			) as CommandResponse
			
			console.log(`Successfully reloaded application (/) commands. (${data.map(command => command['name'] || 'command_name_not_found')})`)
		} catch (error) {
			// And of course, make sure you catch and log any errors!
			console.error(error)
		}
	})()
}