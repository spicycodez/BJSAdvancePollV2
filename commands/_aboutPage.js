/*CMD
command: /aboutPage
help: About this bot
need_reply: false
CMD*/

var t =
  "ℹ️ <b>About</b>\n\n" +
  "🚀 <b>Advance Poll Bot V2</b>\n" +
  "A premium, app-like poll experience inside Telegram.\n\n" +
  "✨ <b>Features</b>\n" +
  "• 🧹 Zero-Spam Smart Bubble UI\n" +
  "• 🔒 Multi-channel sponsor gateway (up to 2 channels)\n" +
  "• 🛡 Join-Left protection with automatic re-verification\n" +
  "• 🛒 Step-by-step cart-style poll builder\n" +
  "• 📊 Advanced history dashboard\n" +
  "• 🧹 Auto-cleaning database\n\n" +
  "Built with Bots.Business (BJS).";

var kb = [
  [
    { title: "❓ Help", command: "/helpPage" },
    { title: "🏠 Main Menu", command: "/start" }
  ]
];

Bot.runCommand("/render", { text: t, kb: kb });
