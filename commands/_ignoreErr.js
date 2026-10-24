/*CMD
command: /ignoreErr
help: Internal — swallow expected Telegram API errors
need_reply: false
CMD*/

try {
  if (options && options.error) {
    Bot.setProp("last_err", String(options.error).slice(0, 300));
  }
} catch (e) {}
