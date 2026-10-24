/*CMD
command: /setcmdsDone
help: Internal — confirmation for /setcmds
need_reply: false
CMD*/

Bot.runCommand("/render", {
  text: "✅ <b>ᴄᴏᴍᴍᴀɴᴅ ʟɪꜱᴛ ʀᴇɢɪꜱᴛᴇʀᴇᴅ!</b>\n\nᴜꜱᴇʀꜱ ᴡɪʟʟ ɴᴏᴡ ꜱᴇᴇ ᴛʜᴇ ᴍᴇɴᴜ ʙᴜᴛᴛᴏɴ ɪɴ ᴛᴇʟᴇɢʀᴀᴍ:\n/ꜱᴛᴀʀᴛ • /ɴᴇᴡᴘᴏʟʟ • /ᴍʏᴘᴏʟʟꜱ • /ʜᴇʟᴘ",
  kb: [[{ title: "🏠 ᴍᴀɪɴ ᴍᴇɴᴜ", command: "/start" }]]
});
