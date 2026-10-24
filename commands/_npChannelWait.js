/*CMD
command: /npChannelWait
help: Internal — receives the posting channel reply (need_reply)
need_reply: true
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.title || !np.options || np.options.length < 2) { return; }

var txt = String(message == null ? "" : message).trim();

if (!txt || txt.charAt(0) === "/") { Bot.runCommand("/npChannel"); return; }

// Normalize input: strip https://t.me/, @
var ch = txt.replace("https://t.me/", "").replace("t.me/", "").replace(/^@/, "").trim();

var okPublic = /^[A-Za-z0-9_]{4,64}$/.test(ch);
var okId = /^-100\d{6,}$/.test(ch);

if (!okPublic && !okId) {
  Bot.runCommand("/render", {
    text: "⚠️ ᴛʜᴀᴛ ᴅᴏᴇꜱɴ'ᴛ ʟᴏᴏᴋ ʟɪᴋᴇ ᴀ ᴄʜᴀɴɴᴇʟ.\n\nꜱᴇɴᴅ <code>@ᴄʜᴀɴɴᴇʟɴᴀᴍᴇ</code> ᴏʀ ᴀ ᴘʀɪᴠᴀᴛᴇ ᴄʜᴀɴɴᴇʟ ɪᴅ (<code>-100...</code>):",
    kb: [[{ title: "🛒 ʙᴀᴄᴋ ᴛᴏ ᴄᴀʀᴛ", command: "/npOpt" }], [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]]
  });
  Bot.runCommand("/npChannelWait");
  return;
}

np.channel = okId ? ch : ("@" + ch);
np.step = "sponsor1";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npSponsor");
