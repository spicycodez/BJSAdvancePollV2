/*CMD
command: /renderNew
help: Internal — fallback sender when bubble edit fails
need_reply: false
CMD*/

if (!options || !options.error) { return; }
var errText = String(options.error);

// Editing with identical content is not a real error — just keep the bubble
if (errText.indexOf("message is not modified") >= 0) { return; }

var bb = options.bb_options || options;
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

var sendTo = chat ? chat.chatid : (user ? user.telegramid : null);
if (!sendTo || !bb.text) { return; }

Api.sendMessage({
  chat_id: sendTo,
  text: bb.text,
  parse_mode: "HTML",
  reply_markup: toMarkup(kb),
  link_preview_options: { is_disabled: true },
  on_result: "/bubbleSave",
  on_error: "/ignoreErr",
  bb_options: { key: bb.key }
});
