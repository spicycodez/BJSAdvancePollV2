/*CMD
command: /npSponsor2
help: Builder step 5 — sponsor channel 2 of 2
need_reply: true
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.channel) { Bot.runCommand("/npMenu"); return; }
if (!np.sponsors) { np.sponsors = []; }

var txt = String(message == null ? "" : message).trim();

function ask() {
  var attached = np.sponsors.length
    ? "ᴀᴛᴛᴀᴄʜᴇᴅ ꜱᴏ ꜰᴀʀ: <b>@" + esc(np.sponsors[0].user) + "</b>\n\n"
    : "No sponsor attached yet.\n\n";
  Bot.runCommand("/render", {
    text: "🏗 <b>ᴘᴏʟʟ ʙᴜɪʟᴅᴇʀ</b> — ꜱᴛᴇᴘ 5/5\n🔒 <b>ꜱᴘᴏɴꜱᴏʀ ɢᴀᴛᴇᴡᴀʏ</b> (2 ᴏꜰ 2)\n\n" +
      attached +
      "ᴏᴘᴛɪᴏɴᴀʟʟʏ ᴀᴛᴛᴀᴄʜ ᴀ <b>ꜱᴇᴄᴏɴᴅ ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟ</b>\n(<code>@ᴄʜᴀɴɴᴇʟɴᴀᴍᴇ</code>), ᴏʀ ᴛᴀᴘ ꜱᴋɪᴘ ᴛᴏ ꜰɪɴɪꜱʜ.",
    kb: [
      [{ title: "⏭ ꜱᴋɪᴘ", command: "/npSponsor2 skip" }],
      [{ title: "🔒 ʙᴀᴄᴋ", command: "/npSponsor" }],
      [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]
    ]
  });
}

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// First run or Skip button
if (txt.indexOf("/npSponsor2") === 0 || txt === "") {
  if (txt.indexOf("skip") >= 0) {
    np.step = "preview";
    Bot.setProp({ name: key, value: np, type: "json" });
    Bot.runCommand("/npPreview");
    return;
  }
  ask();
  return;
}

if (txt === "/npc") { return; }

var sp2 = txt.replace("https://t.me/", "").replace("t.me/", "").replace(/^@/, "").trim();

if (!/^[A-Za-z0-9_]{4,64}$/.test(sp2)) {
  Bot.runCommand("/render", {
    text: "⚠️ ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟꜱ ᴍᴜꜱᴛ ʙᴇ ᴘᴜʙʟɪᴄ — ꜱᴇɴᴅ <code>@ᴄʜᴀɴɴᴇʟɴᴀᴍᴇ</code>:",
    kb: [[{ title: "⏭ ꜱᴋɪᴘ", command: "/npSponsor2 skip" }], [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]]
  });
  return;
}

if (np.sponsors.length && np.sponsors[0].user === sp2) {
  Bot.runCommand("/render", {
    text: "⚠️ ᴛʜᴀᴛ'ꜱ ᴛʜᴇ ꜱᴀᴍᴇ ᴄʜᴀɴɴᴇʟ ᴀꜱ ꜱᴘᴏɴꜱᴏʀ 1. ꜱᴇɴᴅ ᴀ ᴅɪꜰꜰᴇʀᴇɴᴛ ᴏɴᴇ, ᴏʀ ꜱᴋɪᴘ:",
    kb: [[{ title: "⏭ ꜱᴋɪᴘ", command: "/npSponsor2 skip" }], [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]]
  });
  return;
}

np.sponsors.push({ user: sp2 });
np.step = "preview";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npPreview");
