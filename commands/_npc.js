/*CMD
command: /npc
help: Cancel the poll builder
need_reply: false
CMD*/

Bot.deleteProp("u" + user.id + "_np");
Bot.runCommand("/start");
