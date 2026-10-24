/*CMD
command: /npSponsor2
help: Builder step 5 — ask for sponsor channel 2 of 2 (renders the prompt)
need_reply: false
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.channel) { Bot.runCommand("/npMenu"); return; }
if (!np.sponsors) { np.sponsors = []; }

np.step = "sponsor2";
Bot.setProp({ name: key, value: np, type: "json" });

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

var attached = np.sponsors.length
  ? "ᴀᴛᴛᴀᴄʜᴇᴅ ꜱᴏ ꜰᴀʀ: <b>@" + esc(np.sponsors[0].user) + "</b>\n\n"
  : "ɴᴏ ꜱᴘᴏɴꜱᴏʀ ᴀᴛᴛᴀᴄʜᴇᴅ ʏᴇᴛ.\n\n";

Bot.runCommand("/render", {
  text: "🏗 <b>ᴘᴏʟʟ ʙᴜɪʟᴅᴇʀ</b> — ꜱᴛᴇᴘ 5/5\n🔒 <b>ꜱᴘᴏɴꜱᴏʀ ɢᴀᴛᴇᴡᴀʏ</b> (2 ᴏꜰ 2)\n\n" +
    attached +
    "ᴏᴘᴛɪᴏɴᴀʟʟʏ ᴀᴛᴛᴀᴄʜ ᴀ <b>ꜱᴇᴄᴏɴᴅ ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟ</b>\n(<code>@ᴄʜᴀɴɴᴇʟɴᴀᴍᴇ</code>), ᴏʀ ᴛᴀᴘ ꜱᴋɪᴘ ᴛᴏ ꜰɪɴɪꜱʜ.",
  kb: [
    [{ title: "⏭ ꜱᴋɪᴘ", command: "/npSponsor2Skip" }],
    [{ title: "🔒 ʙᴀᴄᴋ", command: "/npSponsor" }],
    [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]
  ]
});

// Arm the reply listener — its BJS runs after the user's next message
Bot.runCommand("/npSponsor2Wait");
