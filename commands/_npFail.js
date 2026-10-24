/*CMD
command: /npFail
help: Internal — publish/post failure handler with fix instructions
need_reply: false
CMD*/

var bb = options.bb_options || {};
var err = String(options.error || "ᴜɴᴋɴᴏᴡɴ ᴇʀʀᴏʀ");

if (err.indexOf("message is not modified") >= 0) { return; }

// Re-arm the builder so the Retry button works (publish set step to "publishing")
var failPoll = bb.pollId ? Bot.getProp("poll_" + bb.pollId) : null;
var ownerId = (user && user.id) || (failPoll ? failPoll.owner_bbid : null);
if (ownerId) {
  var np = Bot.getProp("u" + ownerId + "_np");
  if (np && np.step === "publishing") {
    np.step = "preview";
    Bot.setProp({ name: "u" + ownerId + "_np", value: np, type: "json" });
  }
}

var detail = err.slice(0, 160);
var hint = "ᴍᴏꜱᴛ ᴄᴏᴍᴍᴏɴ ꜰɪxᴇꜱ:\n" +
  "1️⃣ ᴀᴅᴅ ᴍᴇ ᴀꜱ ᴀɴ <b>ᴀᴅᴍɪɴ</b> ᴏꜰ ᴛʜᴇ ᴄʜᴀɴɴᴇʟ ᴡɪᴛʜ <b>ᴘᴏꜱᴛ ᴍᴇꜱꜱᴀɢᴇꜱ</b> ᴘᴇʀᴍɪꜱꜱɪᴏɴ.\n" +
  "2️⃣ ᴄʜᴇᴄᴋ ᴛʜᴇ ᴄʜᴀɴɴᴇʟ ᴜꜱᴇʀɴᴀᴍᴇ ɪꜱ ᴄᴏʀʀᴇᴄᴛ.\n" +
  "3️⃣ ꜰᴏʀ ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟꜱ: ᴀᴅᴅ ᴍᴇ ᴀꜱ ᴀᴅᴍɪɴ ᴛᴏᴏ (ᴍᴇᴍʙᴇʀꜱʜɪᴘ ᴄʜᴇᴄᴋꜱ).\n\n" +
  "ᴛʜᴇɴ ᴛᴀᴘ <b>ʀᴇᴛʀʏ</b>.";

Bot.runCommand("/render", {
  text: "❌ <b>ᴄᴏᴜʟᴅɴ'ᴛ ᴘᴜʙʟɪꜱʜ ᴛʜᴇ ᴘᴏʟʟ</b>\n\n" +
    "<i>" + esc(detail) + "</i>\n\n" + hint,
  kb: [
    [{ title: "🚀 ʀᴇᴛʀʏ", command: "/npPublish" }],
    [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]
  ]
});

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
