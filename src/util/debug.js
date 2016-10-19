const hasConsole = !!window.console;

export function error(msg, extra) {
     hasConsole && console.error(msg, extra);
};

export function warn(msg, extra) {
     hasConsole && console.warn(msg, extra);
};

