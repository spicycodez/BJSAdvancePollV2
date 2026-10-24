/*CMD
command: /setcmds
help: Register the bot's command list in Telegram (run once after setup)
need_reply: false
CMD*/

Api.call("setMyCommands", {
  commands: [
    { command: "start", description: "🏠 ᴍᴀɪɴ ᴍᴇɴᴜ" },
    { command: "newpoll", description: "🆕 ᴄʀᴇᴀᴛᴇ ᴀ ɴᴇᴡ ᴘᴏʟʟ" },
    { command: "mypolls", description: "📊 ʜɪꜱᴛᴏʀʏ ᴅᴀꜱʜʙᴏᴀʀᴅ" },
    { command: "help", description: "❓ ʜᴏᴡ ᴛᴏ ᴜꜱᴇ ᴛʜᴇ ʙᴏᴛ" }
  ],
  on_result: "/setcmdsDone",
  on_error: "/ignoreErr"
});

Bot.runCommand("/render", {
  text: "⏳ ʀᴇɢɪꜱᴛᴇʀɪɴɢ ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅ ʟɪꜱᴛ ɪɴ ᴛᴇʟᴇɢʀᴀᴍ…",
  kb: [[{ title: "🏠 ᴍᴀɪɴ ᴍᴇɴᴜ", command: "/start" }]]
});
