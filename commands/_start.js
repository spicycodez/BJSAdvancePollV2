/*CMD
command: /start
aliases: /menu
help: Smart Bubble main menu
need_reply: false
CMD*/

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Group/channel execution: /start is also typed inside groups.
// Some triggers (channel posts, anonymous admins) have NO user record —
// the old code read user.id unguarded and crashed silently here.
if (chat && chat.chat_type && chat.chat_type !== "private") {
  Bot.sendMessage("👋 ᴘʟᴇᴀꜱᴇ ᴍᴇꜱꜱᴀɢᴇ ᴍᴇ ɪɴ ᴀ ᴘʀɪᴠᴀᴛᴇ ᴄʜᴀᴛ ᴛᴏ ᴄʀᴇᴀᴛᴇ ᴀɴᴅ ᴍᴀɴᴀɢᴇ ᴘᴏʟʟꜱ!");
  return;
}

if (!user) {
  Bot.sendMessage("👋 ᴘʟᴇᴀꜱᴇ ᴏᴘᴇɴ ᴀ ᴘʀɪᴠᴀᴛᴇ ᴄʜᴀᴛ ᴡɪᴛʜ ᴍᴇ ᴀɴᴅ ꜱᴇɴᴅ /start ᴀɢᴀɪɴ!");
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

var t = "🚀 <b>ᴀᴅᴠᴀɴᴄᴇ ᴘᴏʟʟ ʙᴏᴛ ᴠ2</b>\n\n" +
  "ʜᴇʏ <b>" + esc(name) + "</b>! 👋\n\n" +
  "ᴄʀᴇᴀᴛᴇ ᴘʀᴇᴍɪᴜᴍ ᴘᴏʟʟꜱ ꜰᴏʀ ʏᴏᴜʀ ᴄʜᴀɴɴᴇʟꜱ ᴡɪᴛʜ:\n" +
  "🧹 <b>ᴢᴇʀᴏ-ꜱᴘᴀᴍ ꜱᴍᴀʀᴛ ʙᴜʙʙʟᴇ</b> — ᴀʟʟ ᴍᴇɴᴜꜱ ʟɪᴠᴇ ɪɴ ᴏɴᴇ ꜱᴇʟꜰ-ᴜᴘᴅᴀᴛɪɴɢ ᴍᴇꜱꜱᴀɢᴇ\n" +
  "🔒 <b>ꜱᴘᴏɴꜱᴏʀ ɢᴀᴛᴇᴡᴀʏ</b> — ʀᴇǫᴜɪʀᴇ ᴊᴏɪɴɪɴɢ ᴜᴘ ᴛᴏ 2 ᴄʜᴀɴɴᴇʟꜱ ʙᴇꜰᴏʀᴇ ᴠᴏᴛɪɴɢ\n" +
  "🛡 <b>ᴊᴏɪɴ-ʟᴇꜰᴛ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ</b> — ᴠᴏᴛᴇꜱ ᴏꜰ ʟᴇᴀᴠᴇʀꜱ ᴀʀᴇ ʀᴇᴍᴏᴠᴇᴅ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ\n" +
  "🛒 <b>ꜱᴛᴇᴘ-ʙʏ-ꜱᴛᴇᴘ ʙᴜɪʟᴅᴇʀ</b> — ᴄᴀʀᴛ-ꜱᴛʏʟᴇ ᴏᴘᴛɪᴏɴꜱ, ɴᴏ ᴄᴏɴꜰᴜꜱɪɴɢ ꜱʏᴍʙᴏʟꜱ\n" +
  "📊 <b>ʜɪꜱᴛᴏʀʏ ᴅᴀꜱʜʙᴏᴀʀᴅ</b> — ᴘᴀᴜꜱᴇ, ʀᴇꜱᴜᴍᴇ, ꜱᴛᴏᴘ, ʜɪᴅᴇ ᴠᴏᴛᴇꜱ ɪɴ ᴏɴᴇ ᴛᴀᴘ\n\n" +
  "👇 <b>ᴄʜᴏᴏꜱᴇ ᴀɴ ᴀᴄᴛɪᴏɴ:</b>";

var kb = [
  [
    { title: "🆕 ᴄʀᴇᴀᴛᴇ ᴘᴏʟʟ", command: "/npMenu" },
    { title: "📊 ᴍʏ ᴘᴏʟʟꜱ", command: "/myPolls" }
  ],
  [
    { title: "❓ ʜᴇʟᴘ", command: "/helpPage" },
    { title: "ℹ️ ᴀʙᴏᴜᴛ", command: "/aboutPage" }
  ]
];

// If a builder session is in progress, offer resume/cancel
var np = Bot.getProp("u" + user.id + "_np");
if (np && np.step && np.step !== "done") {
  kb.unshift([
    { title: "▶️ ʀᴇꜱᴜᴍᴇ ʙᴜɪʟᴅᴇʀ", command: "/npMenu" },
    { title: "✖ ᴄᴀɴᴄᴇʟ ʙᴜɪʟᴅᴇʀ", command: "/npc" }
  ]);
}

// ── BULLETPROOF DELIVERY ─────────────────────────────────────────────
// /start is the entry point: it must NEVER depend on the Smart Bubble
// machinery. The old flow (/render -> edit stored bubble) died silently
// whenever the stored bubble id went stale AND the /renderNew fallback
// could not recover its payload. /start now sends a fresh menu directly,
// then re-anchors the bubble on the new message via /bubbleSave.
function toMarkup(rows) {
  var out = [];
  for (var i = 0; i < rows.length; i++) {
    var row = [];
    for (var j = 0; j < rows[i].length; j++) {
      var b = rows[i][j];
      var btn = { text: b.title };
      if (b.url) { btn.url = b.url; }
      else { btn.callback_data = b.command || "/noop"; }
      row.push(btn);
    }
    out.push(row);
  }
  return { inline_keyboard: out };
}

var sent = false;
try {
  Api.sendMessage({
    chat_id: user.telegramid,
    text: t,
    parse_mode: "HTML",
    reply_markup: toMarkup(kb),
    link_preview_options: { is_disabled: true },
    on_result: "/bubbleSave",
    on_error: "/sendPlain",
    bb_options: { text: t, kb: kb, key: "u" + user.id + "_bubble" }
  });
  sent = true;
} catch (e) { sent = false; }

if (!sent) {
  // Synchronous BJS-level failure — fall back to the simple sender
  try {
    Bot.sendMessage(t, {
      parse_mode: "HTML",
      reply_markup: toMarkup(kb),
      link_preview_options: { is_disabled: true }
    });
  } catch (e2) {
    Bot.sendMessage(t);
  }
}
