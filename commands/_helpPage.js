/*CMD
command: /helpPage
aliases: /help
help: How to use the bot
need_reply: false
CMD*/

var t =
  "❓ <b>Help — Advance Poll Bot V2</b>\n\n" +
  "<b>1.</b> Tap 🆕 <b>Create Poll</b> and follow the step-by-step builder: title → description → options (cart-style, one per message) → posting channel → sponsor channels.\n\n" +
  "<b>2.</b> The poll is posted to your channel as a single clean message. Users vote with inline buttons — no messy chat.\n\n" +
  "<b>3.</b> 🔒 <b>Sponsor Gateway:</b> attach up to 2 sponsor channels. Voters must join them before the vote is counted. The bot checks membership automatically.\n\n" +
  "<b>4.</b> 🛡 <b>Join-Left Protection:</b> votes are re-verified when the voter interacts with the poll and in scheduled background sweeps. If a voter leaves a sponsor channel, their vote is removed.\n\n" +
  "<b>5.</b> 📊 <b>My Polls:</b> pause ⏸, resume ▶️, stop ⏹, hide/show vote counts 🙈, re-verify all votes 🛡, re-post 📢 or delete 🗑 — all from one inline dashboard.\n\n" +
  "<b>Requirements:</b>\n" +
  "• Add the bot as an <b>admin</b> in your posting channel (Post Messages).\n" +
  "• Add the bot as an <b>admin</b> in sponsor channels (membership checks).\n" +
  "• Voters should press START on this bot once, so the gateway can DM them.\n\n" +
  "<b>Commands:</b>\n" +
  "/start — main menu\n/newpoll — create a poll\n/mypolls — dashboard\n/npc — cancel the builder";

var kb = [
  [{ title: "🆕 Create Poll", command: "/npMenu" }],
  [
    { title: "🏠 Main Menu", command: "/start" }
  ]
];

Bot.runCommand("/render", { text: t, kb: kb });
