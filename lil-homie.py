#!/usr/bin/python3
# melt 2023

import os
import string
from discord.ext import commands
from pyyoutube import Api
from keep_alive import keep_alive

BOT_TOKEN = 'MTEwNjc5MTg1NzY1NDA3NTQwMg.GilT8I.R5nKVhdISwvaIaIa0R1aJ9MlnZ1j7qPB1AGG-s'
# yt_api = Api(api_key='my_api_key') # or maybe access token


lil_homie = commands.Bot(command_prefix='~')

# helpers

async def check_valid_vc(vc_name: string):
  # TODO do check
  return True

@lil_homie.event
async def handle_join_vc(ctx):
  current_vc = 'general' if True else None
  target_vc = 'general'
  valid = check_valid_vc(target_vc)
  if target_vc is not valid:
    # TODO throw error
    print('error')
  elif current_vc is not target_vc:
    # TODO go into vc
    print('changing to new vc')

# on error
@lil_homie.event
async def on_command_error(ctx, error):
  if isinstance(error, commands.errors.CheckFailure):
    await ctx.send(f'Error: {str(error)}')

# play song with query
@lil_homie.command(name='p', help='Lil Homie plays music from YouTube (( usage: ~p song ))')
async def handle_music_request(ctx, request: string):
  result = yt_api.search_by_keywords(q=request, search_type=['video', 'playlist'], count=1, limit=1)
  if len(result.items) > 0:
    if result.items[0].type is 'video':
      print('adding song', result.items[0])
      add_song_to_queue(ctx, songID=result.items[0])
    if result.items[0].type is 'playlist':
      print('adding playlist', result.items[0])
      add_playlist_to_queue(ctx, playlistID=result.items[0])
  await ctx.send(f'playing {str(request)} now')

async def add_song_to_queue(ctx, songID: string):
  print(f'Playing song {songID}')
  # todo add song to queue
  handle_join_vc(ctx)

async def add_playlist_to_queue(ctx, playlistID: string):
  print(f'Added playlist {playlistID}')
  # todo add playlist to queue
  handle_join_vc(ctx)
  

# play main playlist?
@lil_homie.command(name='iay', help='It\'s all you little homie! (( lil homie plays random playlist ))')
async def play_lil_homie(ctx):
  await ctx.send(f'It\'s all me big homie')

keep_alive()
lil_homie.run(BOT_TOKEN)