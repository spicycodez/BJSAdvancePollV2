/*CMD
command: /npChannel
help: Builder step 4 — ask for the target posting channel (renders the prompt)
need_reply: false
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.title || !np.options || np.options.length < 2) { Bot.runCommand("/npMenu"); return; }

np.step = "channel";
Bot.setProp({ name: key, value: np, type: "json" });

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

var cur = np.channel
  ? "\nᴄᴜʀʀᴇɴᴛ: <code>" + esc(np.channel) + "</code> — ꜱᴇɴᴅ ᴀ ɴᴇᴡ ᴏɴᴇ ᴛᴏ ᴄʜᴀɴɢᴇ ɪᴛ.\n"
  : "";

Bot.runCommand("/render", {
  text: "🏗 <b>ᴘᴏʟʟ ʙᴜɪʟᴅᴇʀ</b> — ꜱᴛᴇᴘ 4/5\n\n" +
    "📣 ꜱᴇɴᴅ ᴛʜᴇ <b>ᴄʜᴀɴɴᴇʟ</b> ᴡʜᴇʀᴇ ᴛʜᴇ ᴘᴏʟʟ ꜱʜᴏᴜʟᴅ ʙᴇ ᴘᴏꜱᴛᴇᴅ.\n\n" +
    "ᴀᴄᴄᴇᴘᴛꜱ:\n" +
    "• ᴘᴜʙʟɪᴄ: <code>@ʏᴏᴜʀᴄʜᴀɴɴᴇʟ</code>\n" +
    "• ᴘʀɪᴠᴀᴛᴇ ɪᴅ: <code>-1001234567890</code>\n" + cur +
    "\n⚠️ <b>ɪᴍᴘᴏʀᴛᴀɴᴛ:</b> ᴀᴅᴅ ᴍᴇ ᴀꜱ ᴀɴ <b>ᴀᴅᴍɪɴ</b> ᴏꜰ ᴛʜᴀᴛ ᴄʜᴀɴɴᴇʟ ᴡɪᴛʜ ᴛʜᴇ <b>ᴘᴏꜱᴛ ᴍᴇꜱꜱᴀɢᴇꜱ</b> ᴘᴇʀᴍɪꜱꜱɪᴏɴ, ᴏʀ ᴘᴜʙʟɪꜱʜɪɴɢ ᴡɪʟʟ ꜰᴀɪʟ.",
  kb: [
    [{ title: "🛒 ʙᴀᴄᴋ ᴛᴏ ᴄᴀʀᴛ", command: "/npOpt" }],
    [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]
  ]
});

// Arm the reply listener — its BJS runs after the user's next message
Bot.runCommand("/npChannelWait");
