/*CMD
command: /npSponsor
help: Builder step 5 — ask for sponsor channel 1 of 2 (renders the prompt)
need_reply: false
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.channel) { Bot.runCommand("/npMenu"); return; }
if (!np.sponsors) { np.sponsors = []; }

np.step = "sponsor1";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/render", {
  text: "🏗 <b>ᴘᴏʟʟ ʙᴜɪʟᴅᴇʀ</b> — ꜱᴛᴇᴘ 5/5\n🔒 <b>ꜱᴘᴏɴꜱᴏʀ ɢᴀᴛᴇᴡᴀʏ</b> (1 ᴏꜰ 2)\n\n" +
    "ᴀᴛᴛᴀᴄʜ ᴀ <b>ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟ</b>: ᴏɴʟʏ ᴍᴇᴍʙᴇʀꜱ ᴏꜰ ɪᴛ ᴡɪʟʟ ʙᴇ ᴀʙʟᴇ ᴛᴏ ᴠᴏᴛᴇ — ᴘᴇʀꜰᴇᴄᴛ ꜰᴏʀ ᴄʀᴏꜱꜱ-ᴘʀᴏᴍᴏᴛɪᴏɴ.\n\n" +
    "ꜱᴇɴᴅ ᴀ ᴘᴜʙʟɪᴄ ᴄʜᴀɴɴᴇʟ ᴀꜱ <code>@ᴄʜᴀɴɴᴇʟɴᴀᴍᴇ</code>,\nᴏʀ ᴛᴀᴘ <b>ꜱᴋɪᴘ</b> ᴛᴏ ᴄᴏɴᴛɪɴᴜᴇ ᴡɪᴛʜᴏᴜᴛ ꜱᴘᴏɴꜱᴏʀꜱ.\n\n" +
    "⚠️ ᴀᴅᴅ ᴍᴇ ᴀꜱ ᴀɴ <b>ᴀᴅᴍɪɴ</b> ᴏꜰ ᴛʜᴇ ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟ (ᴍᴇᴍʙᴇʀꜱʜɪᴘ ᴄʜᴇᴄᴋꜱ).",
  kb: [
    [{ title: "⏭ ꜱᴋɪᴘ", command: "/npSponsorSkip" }],
    [{ title: "📣 ʙᴀᴄᴋ", command: "/npChannel" }],
    [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]
  ]
});

// Arm the reply listener — its BJS runs after the user's next message
Bot.runCommand("/npSponsorWait");
