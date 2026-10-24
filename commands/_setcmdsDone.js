/*CMD
command: /setcmdsDone
help: Internal — confirmation for /setcmds
need_reply: false
CMD*/

Bot.runCommand("/render", {
  text: "✅ <b>Command list registered!</b>\n\nUsers will now see the menu button in Telegram:\n/start • /newpoll • /mypolls • /help",
  kb: [[{ title: "🏠 Main Menu", command: "/start" }]]
});
