/*CMD
command: /npSponsor2Wait
help: Internal — receives sponsor channel 2 (need_reply)
need_reply: true
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.channel) { return; }
if (!np.sponsors) { np.sponsors = []; }

var txt = String(message == null ? "" : message).trim();

if (!txt || txt.charAt(0) === "/") { Bot.runCommand("/npSponsor2"); return; }

var sp2 = txt.replace("https://t.me/", "").replace("t.me/", "").replace(/^@/, "").trim();

if (!/^[A-Za-z0-9_]{4,64}$/.test(sp2)) {
  Bot.runCommand("/render", {
    text: "⚠️ ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟꜱ ᴍᴜꜱᴛ ʙᴇ ᴘᴜʙʟɪᴄ — ꜱᴇɴᴅ <code>@ᴄʜᴀɴɴᴇʟɴᴀᴍᴇ</code>:",
    kb: [[{ title: "⏭ ꜱᴋɪᴘ", command: "/npSponsor2Skip" }], [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]]
  });
  Bot.runCommand("/npSponsor2Wait");
  return;
}

if (np.sponsors.length && np.sponsors[0].user === sp2) {
  Bot.runCommand("/render", {
    text: "⚠️ ᴛʜᴀᴛ'ꜱ ᴛʜᴇ ꜱᴀᴍᴇ ᴄʜᴀɴɴᴇʟ ᴀꜱ ꜱᴘᴏɴꜱᴏʀ 1. ꜱᴇɴᴅ ᴀ ᴅɪꜰꜰᴇʀᴇɴᴛ ᴏɴᴇ, ᴏʀ ꜱᴋɪᴘ:",
    kb: [[{ title: "⏭ ꜱᴋɪᴘ", command: "/npSponsor2Skip" }], [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]]
  });
  Bot.runCommand("/npSponsor2Wait");
  return;
}

np.sponsors.push({ user: sp2 });
np.step = "preview";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npPreview");
