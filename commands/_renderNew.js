/*CMD
command: /renderNew
help: Internal — bulletproof fallback sender when bubble edit fails
need_reply: false
CMD*/

var errText = String((options && options.error) || "");

// Recover the render payload through BOTH channels:
// 1) bb_options (works on current runtimes)
// 2) the pending bot property stashed by /render (works even when the
//    runtime drops bb_options on error callbacks — this silent drop is
//    exactly what used to make typed menus like /start go quiet)
var bb = (options && options.bb_options) ? options.bb_options : null;

var pendNames = [];
try {
  if (bb && bb.key) { pendNames.push(bb.key + "_pend"); }
  if (user && user.id) { pendNames.push("u" + user.id + "_bubble_pend"); }
} catch (e) {}

for (var p = 0; p < pendNames.length; p++) {
  if (bb && bb.text) { break; }
  try {
    var stashed = Bot.getProp(pendNames[p]);
    if (stashed && stashed.text) { bb = stashed; }
  } catch (e2) {}
}

// Always clear the stash so it can never leak into a later render
for (var q = 0; q < pendNames.length; q++) {
  try { Bot.deleteProp(pendNames[q]); } catch (e3) {}
}

// Editing with identical content is not a real error — the bubble already
// shows this exact content, so nothing needs to be sent.
if (errText.indexOf("message is not modified") >= 0) { return; }

if (!bb || !bb.text) { return; }
var kb = bb.kb || [];

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

// Destination: explicit target stashed by /render, else current chat, else user
var sendTo = bb.to || (chat ? chat.chatid : (user ? user.telegramid : null));
if (!sendTo) { return; }

Api.sendMessage({
  chat_id: sendTo,
  text: bb.text,
  parse_mode: "HTML",
  reply_markup: toMarkup(kb),
  link_preview_options: { is_disabled: true },
  on_result: "/bubbleSave",
  on_error: "/sendPlain",
  bb_options: { text: bb.text, kb: kb, key: bb.key }
});
