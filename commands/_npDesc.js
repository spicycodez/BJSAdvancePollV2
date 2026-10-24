/*CMD
command: /npDesc
help: Builder step 2 — ask for the optional description (renders the prompt)
need_reply: false
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.title) { Bot.runCommand("/npMenu"); return; }

np.step = "desc";
Bot.setProp({ name: key, value: np, type: "json" });

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

Bot.runCommand("/render", {
  text: "🏗 <b>ᴘᴏʟʟ ʙᴜɪʟᴅᴇʀ</b> — ꜱᴛᴇᴘ 2/5\n\n" +
    "🗒 ꜱᴇɴᴅ ᴀɴ ᴏᴘᴛɪᴏɴᴀʟ <b>ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ</b> ꜰᴏʀ ʏᴏᴜʀ ᴘᴏʟʟ,\n" +
    "ᴏʀ ᴛᴀᴘ <b>ꜱᴋɪᴘ</b>.\n\n" +
    "ᴄᴜʀʀᴇɴᴛ ᴛɪᴛʟᴇ: <b>" + esc(np.title) + "</b>\n\n" +
    "ᴍᴀx ʟᴇɴɢᴛʜ: 200 ᴄʜᴀʀᴀᴄᴛᴇʀꜱ.",
  kb: [
    [{ title: "⏭ ꜱᴋɪᴘ", command: "/npDescSkip" }],
    [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]
  ]
});

// Arm the reply listener — its BJS runs after the user's next message
Bot.runCommand("/npDescWait");
