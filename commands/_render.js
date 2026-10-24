/*CMD
command: /render
help: Internal — Smart Bubble renderer (options: text, kb, key?)
need_reply: false
CMD*/

if (!options || !options.text) { return; }
var kb = options.kb || [];

// Convert BBS-style button rows {title, command|url} to Telegram reply_markup
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

// Callers running without a user context (scheduled chains) pass an explicit key
var key = options.key || ("u" + (user ? user.id : 0) + "_bubble");

// Prefer the message the user just clicked (it IS the bubble)
var mid = null, cid = null;
try {
  if (request && request.message && request.message.message_id) {
    mid = request.message.message_id;
    cid = request.message.chat ? request.message.chat.id : (chat ? chat.chatid : null);
  }
} catch (e) {}

if (!mid) {
  var b = Bot.getProp(key);
  // Typed trigger? Docs: message updates carry request.message_id;
  // button callbacks carry request.message instead.
  var typedMsg = false;
  try { typedMsg = !!(request && request.message_id && !request.message); } catch (e2) {}
  if (b && b.message_id) {
    if (typedMsg && chat && chat.chatid && b.chat_id !== chat.chatid) {
      // Stale/foreign bubble: editing it would land in another chat and the
      // user here would see nothing. Ignore it and send fresh below.
    } else {
      mid = b.message_id; cid = b.chat_id;
    }
  }
}

if (mid && cid) {
  // Stash the payload so /renderNew can recover even if the runtime drops
  // bb_options on error callbacks (that silent drop is what made /start
  // and other typed menus go completely quiet on stale bubbles).
  try {
    Bot.setProp({
      name: key + "_pend",
      value: { text: options.text, kb: kb, key: key, to: (user ? user.telegramid : cid) },
      type: "json"
    });
  } catch (e3) {}
  Api.editMessageText({
    chat_id: cid,
    message_id: mid,
    text: options.text,
    parse_mode: "HTML",
    reply_markup: toMarkup(kb),
    link_preview_options: { is_disabled: true },
    on_result: "/bubbleKeep",
    on_error: "/renderNew",
    bb_options: { text: options.text, kb: kb, key: key }
  });
} else {
  var sendTo = chat ? chat.chatid : (user ? user.telegramid : null);
  if (!sendTo) { return; }
  Api.sendMessage({
    chat_id: sendTo,
    text: options.text,
    parse_mode: "HTML",
    reply_markup: toMarkup(kb),
    link_preview_options: { is_disabled: true },
    on_result: "/bubbleSave",
    on_error: "/sendPlain",
    bb_options: { text: options.text, kb: kb, key: key }
  });
}
