/*CMD
command: /voteGate
help: Internal — getChatMember error path (bot lacks admin rights / API hiccup)
need_reply: false
CMD*/

var bb = (options && options.bb_options) ? options.bb_options : (options || {});

function pop(text, alert) {
  try {
    if (request && request.id) {
      Api.answerCallbackQuery( {
        callback_query_id: request.id,
        text: String(text).slice(0, 190),
        show_alert: !!alert,
        on_error: "/ignoreErr"
      });
    }
  } catch (e) {}
}

if (bb.mode === "sweep") {
  // API error during sweep — never punish the voter, just skip
  Bot.runCommand("/sweepNext", { pollId: bb.pollId, k: bb.k });
  return;
}

if (bb.mode === "refresh") {
  pop("⚠️ ᴄᴏᴜʟᴅɴ'ᴛ ᴠᴇʀɪꜰʏ ᴍᴇᴍʙᴇʀꜱʜɪᴘ ʀɪɢʜᴛ ɴᴏᴡ — ʏᴏᴜʀ ᴠᴏᴛᴇ ꜱᴛᴀʏꜱ ꜰᴏʀ ɴᴏᴡ.", true);
  return;
}

// mode "vote": verification unavailable — do not count, explain
pop("⚠️ ᴠᴇʀɪꜰɪᴄᴀᴛɪᴏɴ ɪꜱ ᴛᴇᴍᴘᴏʀᴀʀɪʟʏ ᴜɴᴀᴠᴀɪʟᴀʙʟᴇ. ᴘʟᴇᴀꜱᴇ ᴛʀʏ ᴀɢᴀɪɴ ɪɴ ᴀ ᴍɪɴᴜᴛᴇ.", true);
