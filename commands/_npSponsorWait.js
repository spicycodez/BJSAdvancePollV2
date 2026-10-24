/*CMD
command: /npSponsorWait
help: Internal — receives sponsor channel 1 (need_reply)
need_reply: true
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.channel) { return; }
if (!np.sponsors) { np.sponsors = []; }

var txt = String(message == null ? "" : message).trim();

if (!txt || txt.charAt(0) === "/") { Bot.runCommand("/npSponsor"); return; }

var sp = txt.replace("https://t.me/", "").replace("t.me/", "").replace(/^@/, "").trim();

if (!/^[A-Za-z0-9_]{4,64}$/.test(sp)) {
  Bot.runCommand("/render", {
    text: "⚠️ ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟꜱ ᴍᴜꜱᴛ ʙᴇ ᴘᴜʙʟɪᴄ — ꜱᴇɴᴅ <code>@ᴄʜᴀɴɴᴇʟɴᴀᴍᴇ</code>:",
    kb: [[{ title: "⏭ ꜱᴋɪᴘ", command: "/npSponsorSkip" }], [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]]
  });
  Bot.runCommand("/npSponsorWait");
  return;
}

np.sponsors = [{ user: sp }];
np.step = "sponsor2";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npSponsor2");
