/*CMD
command: /start
aliases: /menu
help: Smart Bubble main menu
need_reply: false
CMD*/

// Only run the menu in private chats
if (chat && chat.chat_type && chat.chat_type !== "private") {
  Bot.sendMessage("👋 Please message me in a private chat to create and manage polls!");
  return;
}

// Seed configuration once
if (!Bot.getProp("cfg")) {
  Bot.setProp({
    name: "cfg",
    value: {
      max_options: 10,
      sweep_interval_min: 60,
      stop_clean_hours: 48,
      max_age_days: 30,
      sweep_chunk: 5
    },
    type: "json"
  });
}

// Bootstrap the auto-clean / re-verify watchdog once
if (!Bot.getProp("watchdog_on")) {
  Bot.setProp("watchdog_on", true);
  Bot.run({ command: "/cleanSweep", run_after: 60, label: "autoclean" });
}

// Greet by Telegram first name
var name = "there";
try {
  if (request && request.from && request.from.first_name) name = request.from.first_name;
} catch (e) {}

var t = "🚀 <b>Advance Poll Bot V2</b>\n\n" +
  "Hey <b>" + esc(name) + "</b>! 👋\n\n" +
  "Create premium polls for your channels with:\n" +
  "🧹 <b>Zero-Spam Smart Bubble</b> — all menus live in one self-updating message\n" +
  "🔒 <b>Sponsor Gateway</b> — require joining up to 2 channels before voting\n" +
  "🛡 <b>Join-Left Protection</b> — votes of leavers are removed automatically\n" +
  "🛒 <b>Step-by-Step Builder</b> — cart-style options, no confusing symbols\n" +
  "📊 <b>History Dashboard</b> — pause, resume, stop, hide votes in one tap\n\n" +
  "👇 <b>Choose an action:</b>";

var kb = [
  [
    { title: "🆕 Create Poll", command: "/npMenu" },
    { title: "📊 My Polls", command: "/myPolls" }
  ],
  [
    { title: "❓ Help", command: "/helpPage" },
    { title: "ℹ️ About", command: "/aboutPage" }
  ]
];

// If a builder session is in progress, offer resume/cancel
var np = Bot.getProp("u" + user.id + "_np");
if (np && np.step && np.step !== "done") {
  kb.unshift([
    { title: "▶️ Resume Builder", command: "/npMenu" },
    { title: "✖ Cancel Builder", command: "/npc" }
  ]);
}

Bot.runCommand("/render", { text: t, kb: kb });

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
