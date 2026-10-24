/*CMD
command: /npFail
help: Internal — publish/post failure handler with fix instructions
need_reply: false
CMD*/

// options can be absent on some error callbacks — never assume it exists
var bb = (options && options.bb_options) ? options.bb_options : {};
var err = String((options && options.error) || "ᴜɴᴋɴᴏᴡɴ ᴇʀʀᴏʀ");

if (err.indexOf("message is not modified") >= 0) { return; }

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Re-arm the builder so the Retry button works (publish set step to "publishing")
var failPoll = bb.pollId ? Bot.getProp("poll_" + bb.pollId) : null;
var ownerId = (user && user.id) || (failPoll ? failPoll.owner_bbid : null);
if (ownerId) {
  var np = Bot.getProp("u" + ownerId + "_np");
  if (np && np.step === "publishing") {
    np.step = "preview";
    Bot.setProp({ name: "u" + ownerId + "_np", value: np, type: "json" });
  }
  if (bb.pollId) { Bot.clearRunAfter({ label: "pub_" + bb.pollId }); }
}

var detail = err.slice(0, 160);
var hint = "ᴍᴏꜱᴛ ᴄᴏᴍᴍᴏɴ ꜰɪxᴇꜱ:\n" +
  "1️⃣ ᴀᴅᴅ ᴍᴇ ᴀꜱ ᴀɴ <b>ᴀᴅᴍɪɴ</b> ᴏꜰ ᴛʜᴇ ᴄʜᴀɴɴᴇʟ/ɢʀᴏᴜᴘ ᴡɪᴛʜ <b>ᴘᴏꜱᴛ ᴍᴇꜱꜱᴀɢᴇꜱ</b> ᴘᴇʀᴍɪꜱꜱɪᴏɴ.\n" +
  "2️⃣ ᴄʜᴇᴄᴋ ᴛʜᴇ ᴄʜᴀɴɴᴇʟ ᴜꜱᴇʀɴᴀᴍᴇ ɪꜱ ᴄᴏʀʀᴇᴄᴛ (ᴘʀɪᴠᴀᴛᴇ ɢʀᴏᴜᴘꜱ ɴᴇᴇᴅ ᴛʜᴇ <code>-100…</code> ɪᴅ).\n" +
  "3️⃣ ꜰᴏʀ ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟꜱ: ᴀᴅᴅ ᴍᴇ ᴀꜱ ᴀᴅᴍɪɴ ᴛᴏᴏ (ᴍᴇᴍʙᴇʀꜱʜɪᴘ ᴄʜᴇᴄᴋꜱ).\n\n" +
  "ᴛʜᴇɴ ᴛᴀᴘ <b>ʀᴇᴛʀʏ</b>.";

Bot.runCommand("/render", {
  text: "❌ <b>ᴄᴏᴜʟᴅɴ'ᴛ ᴘᴜʙʟɪꜱʜ ᴛʜᴇ ᴘᴏʟʟ</b>\n\n" +
    "<i>" + esc(detail) + "</i>\n\n" + hint,
  kb: [
    [{ title: "🚀 ʀᴇᴛʀʏ", command: "/npPublish" }],
    [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]
  ],
  key: ownerId ? ("u" + ownerId + "_bubble") : undefined
});
