/*CMD
command: /setcmds
help: Register the bot's command list in Telegram (run once after setup)
need_reply: false
CMD*/

Api.call("setMyCommands", {
  commands: [
    { command: "start", description: "🏠 Main menu" },
    { command: "newpoll", description: "🆕 Create a new poll" },
    { command: "mypolls", description: "📊 History dashboard" },
    { command: "help", description: "❓ How to use the bot" }
  ],
  on_result: "/setcmdsDone",
  on_error: "/ignoreErr"
});

Bot.runCommand("/render", {
  text: "⏳ Registering the command list in Telegram…",
  kb: [[{ title: "🏠 Main Menu", command: "/start" }]]
});
