/*CMD
command: /sendPlain
help: Internal — last-resort plain-text sender when an HTML send fails
need_reply: false
CMD*/

// Runs as on_error of Api.sendMessage renders. If the HTML payload was
// rejected by Telegram, re-send it with NO parse_mode so delivery is
// guaranteed (parse_mode failures were one more way menus stayed silent).
var bb = (options && options.bb_options) ? options.bb_options : options;
var text = (bb && bb.text) ? String(bb.text) : "";
if (!text) { return; }

// Strip any HTML tags — plain text can never fail entity parsing
var plain = text.replace(/<[^>]*>/g, "").replace(/\n{3,}/g, "\n\n").trim();
if (!plain) { plain = "ᴍᴇɴᴜ"; }

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

var sendTo = chat ? chat.chatid : (user ? user.telegramid : null);
if (!sendTo) { return; }

try {
  Api.sendMessage({
    chat_id: sendTo,
    text: plain,
    reply_markup: toMarkup(bb.kb || []),
    link_preview_options: { is_disabled: true },
    on_result: "/bubbleSave",
    on_error: "/ignoreErr",
    bb_options: { key: bb.key }
  });
} catch (e) {
  // Absolute floor — the bare sender cannot be affected by markup or mode
  try { Bot.sendMessage(plain); } catch (e2) {}
}
