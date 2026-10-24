/*CMD
command: /npChannel
help: Builder step 4 — target posting channel
need_reply: true
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.title || !np.options || np.options.length < 2) { Bot.runCommand("/npMenu"); return; }

var txt = String(message == null ? "" : message).trim();

function ask() {
  Bot.runCommand("/render", {
    text: "🏗 <b>ᴘᴏʟʟ ʙᴜɪʟᴅᴇʀ</b> — ꜱᴛᴇᴘ 4/5\n\n" +
      "📣 ꜱᴇɴᴅ ᴛʜᴇ <b>ᴄʜᴀɴɴᴇʟ</b> ᴡʜᴇʀᴇ ᴛʜᴇ ᴘᴏʟʟ ꜱʜᴏᴜʟᴅ ʙᴇ ᴘᴏꜱᴛᴇᴅ.\n\n" +
      "ᴀᴄᴄᴇᴘᴛꜱ:\n" +
      "• ᴘᴜʙʟɪᴄ: <code>@ʏᴏᴜʀᴄʜᴀɴɴᴇʟ</code>\n" +
      "• ᴘʀɪᴠᴀᴛᴇ ɪᴅ: <code>-1001234567890</code>\n\n" +
      "⚠️ <b>ɪᴍᴘᴏʀᴛᴀɴᴛ:</b> ᴀᴅᴅ ᴍᴇ ᴀꜱ ᴀɴ <b>ᴀᴅᴍɪɴ</b> ᴏꜰ ᴛʜᴀᴛ ᴄʜᴀɴɴᴇʟ ᴡɪᴛʜ ᴛʜᴇ <b>ᴘᴏꜱᴛ ᴍᴇꜱꜱᴀɢᴇꜱ</b> ᴘᴇʀᴍɪꜱꜱɪᴏɴ, ᴏʀ ᴘᴜʙʟɪꜱʜɪɴɢ ᴡɪʟʟ ꜰᴀɪʟ.",
    kb: [
      [{ title: "🛒 ʙᴀᴄᴋ ᴛᴏ ᴄᴀʀᴛ", command: "/npOpt" }],
      [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]
    ]
  });
}

// First run
if (txt.indexOf("/npChannel") === 0 || txt === "") {
  ask();
  return;
}

if (txt === "/npc") { return; }

// Normalize input: strip https://t.me/, @
var ch = txt.replace("https://t.me/", "").replace("t.me/", "").replace(/^@/, "").trim();

var okPublic = /^[A-Za-z0-9_]{4,64}$/.test(ch);
var okId = /^-100\d{6,}$/.test(ch);

if (!okPublic && !okId) {
  Bot.runCommand("/render", {
    text: "⚠️ ᴛʜᴀᴛ ᴅᴏᴇꜱɴ'ᴛ ʟᴏᴏᴋ ʟɪᴋᴇ ᴀ ᴄʜᴀɴɴᴇʟ.\n\nꜱᴇɴᴅ <code>@ᴄʜᴀɴɴᴇʟɴᴀᴍᴇ</code> ᴏʀ ᴀ ᴘʀɪᴠᴀᴛᴇ ᴄʜᴀɴɴᴇʟ ɪᴅ (<code>-100...</code>):",
    kb: [[{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]]
  });
  return;
}

np.channel = okId ? ch : ("@" + ch);
np.step = "sponsor1";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npSponsor");
