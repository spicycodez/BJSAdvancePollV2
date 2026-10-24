/*CMD
command: /npFail
help: Internal — publish/post failure handler with fix instructions
need_reply: false
CMD*/

var bb = options.bb_options || {};
var err = String(options.error || "unknown error");

if (err.indexOf("message is not modified") >= 0) { return; }

var detail = err.slice(0, 160);
var hint = "Most common fixes:\n" +
  "1️⃣ Add me as an <b>admin</b> of the channel with <b>Post Messages</b> permission.\n" +
  "2️⃣ Check the channel username is correct.\n" +
  "3️⃣ For sponsor channels: add me as admin too (membership checks).\n\n" +
  "Then tap <b>Retry</b>.";

Bot.runCommand("/render", {
  text: "❌ <b>Couldn't publish the poll</b>\n\n" +
    "<i>" + esc(detail) + "</i>\n\n" + hint,
  kb: [
    [{ title: "🚀 Retry", command: "/npPublish" }],
    [{ title: "✖ Cancel", command: "/npc" }]
  ]
});

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
