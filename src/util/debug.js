const hasConsole = !!window.console;

export function error(msg) {
     hasConsole && console.error(msg);
};

export function warn(msg) {
     hasConsole && console.warn(msg);
};

