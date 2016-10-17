const hasConsole = !!window.console;

export function warn(msg, extra) {
     hasConsole && console.error(msg, extra);
}
