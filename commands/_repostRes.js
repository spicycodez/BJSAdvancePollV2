/*CMD
command: /repostRes
help: Internal — register a re-posted poll message copy
need_reply: false
CMD*/

if (!options || !options.result) { return; }
var bb = options.bb_options || options;
var pollId = bb.pollId;
var poll = Bot.getProp("poll_" + pollId);
if (!poll) { return; }

poll.msgs.push({
  chat_id: options.result.chat.id,
  message_id: options.result.message_id
});
Bot.setProp({ name: "poll_" + pollId, value: poll, type: "json" });
