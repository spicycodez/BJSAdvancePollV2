/*CMD
command: !
help: Friendly error fallback — BBS calls this when a command errors in private chat
need_reply: false
CMD*/

// Keep it short and dependable (official BBS pattern).
// Do not re-run the failing action here.
Bot.sendMessage(
  "⚠️ ꜱᴏᴍᴇᴛʜɪɴɢ ᴡᴇɴᴛ ᴡʀᴏɴɢ. ᴘʟᴇᴀꜱᴇ ᴛʀʏ ᴀɢᴀɪɴ.\n\n" +
  "ɪꜰ ɪᴛ ᴋᴇᴇᴘꜱ ʜᴀᴘᴘᴇɴɪɴɢ, ꜱᴇɴᴅ /start ᴛᴏ ʀᴇꜱᴇᴛ ᴛʜᴇ ᴍᴇɴᴜ."
);
