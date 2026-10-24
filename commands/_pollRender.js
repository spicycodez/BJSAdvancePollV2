/*CMD
command: /pollRender
help: Internal — rebuild and update ALL posted poll messages (options: pollId)
need_reply: false
CMD*/

var pollId = (options && options.pollId) || String(params == null ? "" : params).trim().split(/\s+/)[0];
var poll = Bot.getProp("poll_" + pollId);
if (!poll || poll.status === "draft") { return; }

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildText(p) {
  var icon = p.status === "live" ? "🟢 ʟɪᴠᴇ" : (p.status === "paused" ? "⏸ ᴘᴀᴜꜱᴇᴅ" : "⏹ ᴇɴᴅᴇᴅ");
  var t = "";
  if (p.status === "paused") { t += "⏸ <b>ᴠᴏᴛɪɴɢ ɪꜱ ᴛᴇᴍᴘᴏʀᴀʀɪʟʏ ᴘᴀᴜꜱᴇᴅ</b>\n\n"; }
  if (p.status === "stopped") { t += "⏹ <b>ᴛʜɪꜱ ᴘᴏʟʟ ʜᴀꜱ ᴇɴᴅᴇᴅ</b>\n\n"; }
  t += "📊 <b>" + esc(p.title) + "</b>\n";
  if (p.desc) { t += "<i>" + esc(p.desc) + "</i>\n"; }
  t += "\n";

  var counts = [];
  var total = 0;
  for (var i = 0; i < p.options.length; i++) { counts[i] = 0; }
  for (var tg in p.votes) {
    var v = p.votes[tg];
    if (counts[v] !== undefined) { counts[v]++; total++; }
  }

  for (var i = 0; i < p.options.length; i++) {
    var pct = total ? Math.round(counts[i] * 100 / total) : 0;
    var filled = Math.round(pct / 10);
    var bar = "";
    for (var b = 0; b < 10; b++) { bar += (b < filled) ? "▉" : "▫"; }
    var cnt = p.hide ? "•••" : (counts[i] + " (" + pct + "%)");
    t += bar + " " + (i + 1) + ". <b>" + esc(p.options[i]) + "</b> — " + cnt + "\n";
  }

  t += "\n👥 ᴛᴏᴛᴀʟ ᴠᴏᴛᴇꜱ: " + (p.hide ? "•••" : total) + " • " + icon;
  if (p.sponsors && p.sponsors.length) {
    t += "\n🔒 <i>ꜱᴘᴏɴꜱᴏʀᴇᴅ ᴘᴏʟʟ — ᴊᴏɪɴ ᴛᴏ ᴠᴏᴛᴇ</i>";
  }
  return t;
}

function buildMarkup(p) {
  var rows = [];
  if (p.status === "live") {
    for (var i = 0; i < p.options.length; i++) {
      rows.push([{ text: "🗳 " + p.options[i], callback_data: "/vote " + p.id + " " + i }]);
    }
  }
  rows.push([{ text: "🔄 ʀᴇꜰʀᴇꜱʜ", callback_data: "/refresh " + p.id }]);
  return { inline_keyboard: rows };
}

var body = buildText(poll);
var markup = buildMarkup(poll);

for (var m = 0; m < poll.msgs.length; m++) {
  Api.editMessageText({
    chat_id: poll.msgs[m].chat_id,
    message_id: poll.msgs[m].message_id,
    text: body,
    parse_mode: "HTML",
    reply_markup: markup,
    link_preview_options: { is_disabled: true },
    on_error: "/ignoreErr"
  });
}
