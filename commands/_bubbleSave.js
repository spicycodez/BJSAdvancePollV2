/*CMD
command: /bubbleSave
help: Internal — remember the new Smart Bubble message id
need_reply: false
CMD*/

if (!options || !options.result) { return; }
var bb = options.bb_options || options;
var key = bb.key || ("u" + (user ? user.id : 0) + "_bubble");

try {
  Bot.setProp({
    name: key,
    value: {
      chat_id: options.result.chat.id,
      message_id: options.result.message_id
    },
    type: "json"
  });
} catch (e) {}
