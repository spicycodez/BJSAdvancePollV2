/*CMD
command: /npSponsor
help: Builder step 5 — sponsor channel 1 of 2
need_reply: true
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.channel) { Bot.runCommand("/npMenu"); return; }

var txt = String(message == null ? "" : message).trim();

function ask() {
  Bot.runCommand("/render", {
    text: "🏗 <b>ᴘᴏʟʟ ʙᴜɪʟᴅᴇʀ</b> — ꜱᴛᴇᴘ 5/5\n🔒 <b>ꜱᴘᴏɴꜱᴏʀ ɢᴀᴛᴇᴡᴀʏ</b> (1 ᴏꜰ 2)\n\n" +
      "ᴀᴛᴛᴀᴄʜ ᴀ <b>ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟ</b>: ᴏɴʟʏ ᴍᴇᴍʙᴇʀꜱ ᴏꜰ ɪᴛ ᴡɪʟʟ ʙᴇ ᴀʙʟᴇ ᴛᴏ ᴠᴏᴛᴇ — ᴘᴇʀꜰᴇᴄᴛ ꜰᴏʀ ᴄʀᴏꜱꜱ-ᴘʀᴏᴍᴏᴛɪᴏɴ.\n\n" +
      "ꜱᴇɴᴅ ᴀ ᴘᴜʙʟɪᴄ ᴄʜᴀɴɴᴇʟ ᴀꜱ <code>@ᴄʜᴀɴɴᴇʟɴᴀᴍᴇ</code>,\nᴏʀ ᴛᴀᴘ <b>ꜱᴋɪᴘ</b> ᴛᴏ ᴄᴏɴᴛɪɴᴜᴇ ᴡɪᴛʜᴏᴜᴛ ꜱᴘᴏɴꜱᴏʀꜱ.\n\n" +
      "⚠️ ᴀᴅᴅ ᴍᴇ ᴀꜱ ᴀɴ <b>ᴀᴅᴍɪɴ</b> ᴏꜰ ᴛʜᴇ ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟ (ᴍᴇᴍʙᴇʀꜱʜɪᴘ ᴄʜᴇᴄᴋꜱ).",
    kb: [
      [{ title: "⏭ ꜱᴋɪᴘ", command: "/npSponsor skip" }],
      [{ title: "📣 ʙᴀᴄᴋ", command: "/npChannel" }],
      [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]
    ]
  });
}

// First run or Skip button
if (txt.indexOf("/npSponsor") === 0 || txt === "") {
  if (txt.indexOf("skip") >= 0) {
    np.sponsors = [];
    np.step = "sponsor2";
    Bot.setProp({ name: key, value: np, type: "json" });
    Bot.runCommand("/npSponsor2");
    return;
  }
  ask();
  return;
}

if (txt === "/npc") { return; }

var sp = txt.replace("https://t.me/", "").replace("t.me/", "").replace(/^@/, "").trim();

if (!/^[A-Za-z0-9_]{4,64}$/.test(sp)) {
  Bot.runCommand("/render", {
    text: "⚠️ ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟꜱ ᴍᴜꜱᴛ ʙᴇ ᴘᴜʙʟɪᴄ — ꜱᴇɴᴅ <code>@ᴄʜᴀɴɴᴇʟɴᴀᴍᴇ</code>:",
    kb: [[{ title: "⏭ ꜱᴋɪᴘ", command: "/npSponsor skip" }], [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]]
  });
  return;
}

np.sponsors = [{ user: sp }];
np.step = "sponsor2";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npSponsor2");
