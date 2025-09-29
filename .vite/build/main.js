"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const require$$3$1 = require("electron");
const path$1 = require("node:path");
const require$$0$1 = require("path");
const require$$1$1 = require("child_process");
const require$$0 = require("tty");
const require$$1 = require("util");
const require$$3 = require("fs");
const require$$4 = require("net");
const require$$0$2 = require("dgram");
const require$$1$2 = require("events");
const require$$3$2 = require("os");
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var src$1 = { exports: {} };
var browser = { exports: {} };
var debug$1 = { exports: {} };
var ms;
var hasRequiredMs;
function requireMs() {
  if (hasRequiredMs) return ms;
  hasRequiredMs = 1;
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var y = d * 365.25;
  ms = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
      return parse(val);
    } else if (type === "number" && isNaN(val) === false) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
    );
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch (type) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms2) {
    if (ms2 >= d) {
      return Math.round(ms2 / d) + "d";
    }
    if (ms2 >= h) {
      return Math.round(ms2 / h) + "h";
    }
    if (ms2 >= m) {
      return Math.round(ms2 / m) + "m";
    }
    if (ms2 >= s) {
      return Math.round(ms2 / s) + "s";
    }
    return ms2 + "ms";
  }
  function fmtLong(ms2) {
    return plural(ms2, d, "day") || plural(ms2, h, "hour") || plural(ms2, m, "minute") || plural(ms2, s, "second") || ms2 + " ms";
  }
  function plural(ms2, n, name) {
    if (ms2 < n) {
      return;
    }
    if (ms2 < n * 1.5) {
      return Math.floor(ms2 / n) + " " + name;
    }
    return Math.ceil(ms2 / n) + " " + name + "s";
  }
  return ms;
}
var hasRequiredDebug;
function requireDebug() {
  if (hasRequiredDebug) return debug$1.exports;
  hasRequiredDebug = 1;
  (function(module2, exports) {
    exports = module2.exports = createDebug.debug = createDebug["default"] = createDebug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = requireMs();
    exports.names = [];
    exports.skips = [];
    exports.formatters = {};
    var prevTime;
    function selectColor(namespace) {
      var hash = 0, i;
      for (i in namespace) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return exports.colors[Math.abs(hash) % exports.colors.length];
    }
    function createDebug(namespace) {
      function debug2() {
        if (!debug2.enabled) return;
        var self2 = debug2;
        var curr = +/* @__PURE__ */ new Date();
        var ms2 = curr - (prevTime || curr);
        self2.diff = ms2;
        self2.prev = prevTime;
        self2.curr = curr;
        prevTime = curr;
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        args[0] = exports.coerce(args[0]);
        if ("string" !== typeof args[0]) {
          args.unshift("%O");
        }
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          if (match === "%%") return match;
          index++;
          var formatter = exports.formatters[format];
          if ("function" === typeof formatter) {
            var val = args[index];
            match = formatter.call(self2, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        exports.formatArgs.call(self2, args);
        var logFn = debug2.log || exports.log || console.log.bind(console);
        logFn.apply(self2, args);
      }
      debug2.namespace = namespace;
      debug2.enabled = exports.enabled(namespace);
      debug2.useColors = exports.useColors();
      debug2.color = selectColor(namespace);
      if ("function" === typeof exports.init) {
        exports.init(debug2);
      }
      return debug2;
    }
    function enable(namespaces) {
      exports.save(namespaces);
      exports.names = [];
      exports.skips = [];
      var split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
      var len = split.length;
      for (var i = 0; i < len; i++) {
        if (!split[i]) continue;
        namespaces = split[i].replace(/\*/g, ".*?");
        if (namespaces[0] === "-") {
          exports.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
        } else {
          exports.names.push(new RegExp("^" + namespaces + "$"));
        }
      }
    }
    function disable() {
      exports.enable("");
    }
    function enabled(name) {
      var i, len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }
    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }
  })(debug$1, debug$1.exports);
  return debug$1.exports;
}
var hasRequiredBrowser;
function requireBrowser() {
  if (hasRequiredBrowser) return browser.exports;
  hasRequiredBrowser = 1;
  (function(module2, exports) {
    exports = module2.exports = requireDebug();
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : localstorage();
    exports.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && window.process.type === "renderer") {
        return true;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    exports.formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (err) {
        return "[UnexpectedJSONParseError]: " + err.message;
      }
    };
    function formatArgs(args) {
      var useColors2 = this.useColors;
      args[0] = (useColors2 ? "%c" : "") + this.namespace + (useColors2 ? " %c" : " ") + args[0] + (useColors2 ? "%c " : " ") + "+" + exports.humanize(this.diff);
      if (!useColors2) return;
      var c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if ("%%" === match) return;
        index++;
        if ("%c" === match) {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    function log() {
      return "object" === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports.storage.removeItem("debug");
        } else {
          exports.storage.debug = namespaces;
        }
      } catch (e) {
      }
    }
    function load() {
      var r;
      try {
        r = exports.storage.debug;
      } catch (e) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    exports.enable(load());
    function localstorage() {
      try {
        return window.localStorage;
      } catch (e) {
      }
    }
  })(browser, browser.exports);
  return browser.exports;
}
var node = { exports: {} };
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode) return node.exports;
  hasRequiredNode = 1;
  (function(module2, exports) {
    var tty = require$$0;
    var util = require$$1;
    exports = module2.exports = requireDebug();
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.colors = [6, 2, 3, 4, 5, 1];
    exports.inspectOpts = Object.keys(process.env).filter(function(key) {
      return /^debug_/i.test(key);
    }).reduce(function(obj, key) {
      var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function(_, k) {
        return k.toUpperCase();
      });
      var val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
      else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
      else if (val === "null") val = null;
      else val = Number(val);
      obj[prop] = val;
      return obj;
    }, {});
    var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
    if (1 !== fd && 2 !== fd) {
      util.deprecate(function() {
      }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    }
    var stream = 1 === fd ? process.stdout : 2 === fd ? process.stderr : createWritableStdioStream(fd);
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(fd);
    }
    exports.formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map(function(str) {
        return str.trim();
      }).join(" ");
    };
    exports.formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
    function formatArgs(args) {
      var name = this.namespace;
      var useColors2 = this.useColors;
      if (useColors2) {
        var c = this.color;
        var prefix = "  \x1B[3" + c + ";1m" + name + " \x1B[0m";
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push("\x1B[3" + c + "m+" + exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + name + " " + args[0];
      }
    }
    function log() {
      return stream.write(util.format.apply(util, arguments) + "\n");
    }
    function save(namespaces) {
      if (null == namespaces) {
        delete process.env.DEBUG;
      } else {
        process.env.DEBUG = namespaces;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function createWritableStdioStream(fd2) {
      var stream2;
      var tty_wrap = process.binding("tty_wrap");
      switch (tty_wrap.guessHandleType(fd2)) {
        case "TTY":
          stream2 = new tty.WriteStream(fd2);
          stream2._type = "tty";
          if (stream2._handle && stream2._handle.unref) {
            stream2._handle.unref();
          }
          break;
        case "FILE":
          var fs = require$$3;
          stream2 = new fs.SyncWriteStream(fd2, { autoClose: false });
          stream2._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var net = require$$4;
          stream2 = new net.Socket({
            fd: fd2,
            readable: false,
            writable: true
          });
          stream2.readable = false;
          stream2.read = null;
          stream2._type = "pipe";
          if (stream2._handle && stream2._handle.unref) {
            stream2._handle.unref();
          }
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      stream2.fd = fd2;
      stream2._isStdio = true;
      return stream2;
    }
    function init(debug2) {
      debug2.inspectOpts = {};
      var keys = Object.keys(exports.inspectOpts);
      for (var i = 0; i < keys.length; i++) {
        debug2.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    exports.enable(load());
  })(node, node.exports);
  return node.exports;
}
if (typeof process !== "undefined" && process.type === "renderer") {
  src$1.exports = requireBrowser();
} else {
  src$1.exports = requireNode();
}
var srcExports = src$1.exports;
var path = require$$0$1;
var spawn = require$$1$1.spawn;
var debug = srcExports("electron-squirrel-startup");
var app = require$$3$1.app;
var run = function(args, done) {
  var updateExe = path.resolve(path.dirname(process.execPath), "..", "Update.exe");
  debug("Spawning `%s` with args `%s`", updateExe, args);
  spawn(updateExe, args, {
    detached: true
  }).on("close", done);
};
var check = function() {
  if (process.platform === "win32") {
    var cmd = process.argv[1];
    debug("processing squirrel command `%s`", cmd);
    var target = path.basename(process.execPath);
    if (cmd === "--squirrel-install" || cmd === "--squirrel-updated") {
      run(["--createShortcut=" + target], app.quit);
      return true;
    }
    if (cmd === "--squirrel-uninstall") {
      run(["--removeShortcut=" + target], app.quit);
      return true;
    }
    if (cmd === "--squirrel-obsolete") {
      app.quit();
      return true;
    }
  }
  return false;
};
var electronSquirrelStartup = check();
const started = /* @__PURE__ */ getDefaultExportFromCjs(electronSquirrelStartup);
var src = {};
var constants$1 = {};
var buttonFlags = {};
Object.defineProperty(buttonFlags, "__esModule", { value: true });
buttonFlags.BUTTON_FLAGS = void 0;
buttonFlags.BUTTON_FLAGS = {
  1: "Cross or A",
  2: "Triangle or Y",
  4: "Circle or B",
  8: "Square or X",
  16: "D-pad Left",
  32: "D-pad Right",
  64: "D-pad Up",
  128: "D-pad Down",
  256: "Options or Menu",
  512: "L1 or LB",
  1024: "R1 or RB",
  2048: "L2 or LT",
  4096: "R2 or RT",
  8192: "Left Stick Click",
  16384: "Right Stick Click",
  32768: "Right Stick Left",
  65536: "Right Stick Right",
  131072: "Right Stick Up",
  262144: "Right Stick Down",
  524288: "Special",
  1048576: "UDP Action 1",
  2097152: "UDP Action 2",
  4194304: "UDP Action 3",
  8388608: "UDP Action 4",
  16777216: "UDP Action 5",
  33554432: "UDP Action 6",
  67108864: "UDP Action 7",
  134217728: "UDP Action 8",
  268435456: "UDP Action 9",
  536870912: "UDP Action 10",
  1073741824: "UDP Action 11",
  2147483648: "UDP Action 12"
};
var drivers = {};
Object.defineProperty(drivers, "__esModule", { value: true });
drivers.AI_DRIVER_NAMES = drivers.DRIVERS = void 0;
drivers.DRIVERS = {
  0: { abbreviation: "SAI", firstName: "Carlos", lastName: "Sainz" },
  1: { abbreviation: "KVY", firstName: "Daniil", lastName: "Kvyat" },
  2: { abbreviation: "RIC", firstName: "Daniel", lastName: "Ricciardo" },
  3: { abbreviation: "ALO", firstName: "Fernando", lastName: "Alonso" },
  4: { abbreviation: "MAS", firstName: "Felipe", lastName: "Massa" },
  6: { abbreviation: "RAI", firstName: "Kimi", lastName: "Raikkonen" },
  7: { abbreviation: "HAM", firstName: "Lewis", lastName: "Hamilton" },
  8: { abbreviation: "ERI", firstName: "Marcus", lastName: "Ericsson" },
  9: { abbreviation: "VER", firstName: "Max", lastName: "Verstappen" },
  10: { abbreviation: "HUL", firstName: "Nico", lastName: "Hulkenberg" },
  11: { abbreviation: "MAG", firstName: "Kevin", lastName: "Magnussen" },
  12: { abbreviation: "GRO", firstName: "Romain", lastName: "Grosjean" },
  13: { abbreviation: "VET", firstName: "Sebastian", lastName: "Vettel" },
  14: { abbreviation: "PER", firstName: "Sergio", lastName: "Perez" },
  15: { abbreviation: "BOT", firstName: "Valtteri", lastName: "Bottas" },
  17: { abbreviation: "OCO", firstName: "Esteban", lastName: "Ocon" },
  18: { abbreviation: "VAN", firstName: "Stoffel", lastName: "Vandoorne" },
  19: { abbreviation: "STR", firstName: "Lance", lastName: "Stroll" },
  20: { abbreviation: "BAR", firstName: "Arron", lastName: "Barnes" },
  21: { abbreviation: "GIL", firstName: "Martin", lastName: "Giles" },
  22: { abbreviation: "MUR", firstName: "Alex", lastName: "Murray" },
  23: { abbreviation: "ROT", firstName: "Lucas", lastName: "Roth" },
  24: { abbreviation: "COR", firstName: "Igor", lastName: "Correia" },
  25: { abbreviation: "LEV", firstName: "Sophie", lastName: "Levasseur" },
  26: { abbreviation: "SCH", firstName: "Jonas", lastName: "Schiffer" },
  27: { abbreviation: "FOR", firstName: "Alain", lastName: "Forest" },
  28: { abbreviation: "LET", firstName: "Jay", lastName: "Letorneau" },
  29: { abbreviation: "SAA", firstName: "Esto", lastName: "Saari" },
  30: { abbreviation: "ATI", firstName: "Yasar", lastName: "Atiyeh" },
  31: { abbreviation: "CAL", firstName: "Callisto", lastName: "Calabresi" },
  32: { abbreviation: "IZU", firstName: "Naota", lastName: "Izum" },
  33: { abbreviation: "CLA", firstName: "Howard", lastName: "Clarke" },
  34: { abbreviation: "KAU", firstName: "Wilheim", lastName: "Kaufmann" },
  35: { abbreviation: "LAU", firstName: "Marie", lastName: "Laursen" },
  36: { abbreviation: "NIE", firstName: "Flavio", lastName: "Nieves" },
  37: { abbreviation: "BEL", firstName: "Peter", lastName: "Belousov" },
  38: { abbreviation: "MIC", firstName: "Klimek", lastName: "Michalski" },
  39: { abbreviation: "MOR", firstName: "Santiago", lastName: "Moreno" },
  40: { abbreviation: "COP", firstName: "Benjamin", lastName: "Coppens" },
  41: { abbreviation: "VIS", firstName: "Noah", lastName: "Visser" },
  42: { abbreviation: "WAL", firstName: "Gert", lastName: "Waldmuller" },
  43: { abbreviation: "QUE", firstName: "Julian", lastName: "Quesada" },
  44: { abbreviation: "JON", firstName: "Daniel", lastName: "Jones" },
  45: { abbreviation: "MAR", firstName: "Artem", lastName: "Markelov" },
  46: { abbreviation: "MAK", firstName: "Tadasuke", lastName: "Makino" },
  47: { abbreviation: "GAL", firstName: "Sean", lastName: "Gelael" },
  48: { abbreviation: "DEV", firstName: "Nyck", lastName: "De Vries" },
  49: { abbreviation: "AIT", firstName: "Jack", lastName: "Aitken" },
  50: { abbreviation: "RUS", firstName: "George", lastName: "Russell" },
  51: { abbreviation: "GUN", firstName: "Maximilian", lastName: "Günther" },
  52: { abbreviation: "FUK", firstName: "Nirei", lastName: "Fukuzumi" },
  53: { abbreviation: "GHI", firstName: "Luca", lastName: "Ghiotto" },
  54: { abbreviation: "NOR", firstName: "Lando", lastName: "Norris" },
  55: { abbreviation: "SET", firstName: "Sérgio", lastName: "Sette Câmara" },
  56: { abbreviation: "DEL", firstName: "Louis", lastName: "Delétraz" },
  57: { abbreviation: "FUO", firstName: "Antonio", lastName: "Fuoco" },
  58: { abbreviation: "LEC", firstName: "Charles", lastName: "Leclerc" },
  59: { abbreviation: "GAS", firstName: "Pierre", lastName: "Gasly" },
  60: { abbreviation: "HAR", firstName: "Brendon", lastName: "Hartley" },
  61: { abbreviation: "SIR", firstName: "Sergey", lastName: "Sirotkin" },
  62: { abbreviation: "ALB", firstName: "Alexander", lastName: "Albon" },
  63: { abbreviation: "LAT", firstName: "Nicholas", lastName: "Latifi" },
  64: { abbreviation: "BOC", firstName: "Dorian", lastName: "Boccolacci" },
  65: { abbreviation: "KAR", firstName: "Niko", lastName: "Kari" },
  66: { abbreviation: "MER", firstName: "Roberto", lastName: "Merhi" },
  67: { abbreviation: "MAI", firstName: "Arjun", lastName: "Maini" },
  68: { abbreviation: "LOR", firstName: "Alessio", lastName: "Lorandi" },
  69: { abbreviation: "MEI", firstName: "Ruben", lastName: "Meijer" },
  70: { abbreviation: "NAI", firstName: "Rashid", lastName: "Nair" },
  71: { abbreviation: "TRE", firstName: "Jack", lastName: "Tremblay" },
  72: { abbreviation: "BUT", firstName: "Devon", lastName: "Butler" },
  73: { abbreviation: "WEB", firstName: "Lukas", lastName: "Weber" },
  74: { abbreviation: "GIO", firstName: "Antonio", lastName: "Giovinazzi" },
  75: { abbreviation: "KUB", firstName: "Robert", lastName: "Kubica" },
  76: { abbreviation: "PRO", firstName: "Alain", lastName: "Prost" },
  77: { abbreviation: "SEN", firstName: "Ayrton", lastName: "Senna" },
  78: { abbreviation: "MAT", firstName: "Nobuharu", lastName: "Matsushita" },
  79: { abbreviation: "MAZ", firstName: "Nikita", lastName: "Mazepin" },
  80: { abbreviation: "ZHO", firstName: "Guanya", lastName: "Zhou" },
  81: { abbreviation: "SWH", firstName: "Mick", lastName: "Schumacher" },
  82: { abbreviation: "ILO", firstName: "Callum", lastName: "Ilott" },
  83: { abbreviation: "COR", firstName: "Juan", lastName: "Manuel Correa" },
  84: { abbreviation: "KIN", firstName: "Jordan", lastName: "King" },
  85: { abbreviation: "RAG", firstName: "Mahaveer", lastName: "Raghunathan" },
  86: { abbreviation: "CAL", firstName: "Tatiana", lastName: "Calderon" },
  87: { abbreviation: "HUB", firstName: "Anthoine", lastName: "Hubert" },
  88: { abbreviation: "ALE", firstName: "Guiliano", lastName: "Alesi" },
  89: { abbreviation: "BOS", firstName: "Ralph", lastName: "Boschung" },
  90: { abbreviation: "SCH", firstName: "Michael", lastName: "Schumacher" },
  91: { abbreviation: "TIK", firstName: "Dan", lastName: "Ticktum" },
  92: { abbreviation: "ARM", firstName: "Marcus", lastName: "Armstrong" },
  93: { abbreviation: "LUN", firstName: "Christian", lastName: "Lundgaard" },
  94: { abbreviation: "TSU", firstName: "Yuki", lastName: "Tsunoda" },
  95: { abbreviation: "DAR", firstName: "Jehan", lastName: "Daruvala" },
  96: { abbreviation: "SAM", firstName: "Gulherme", lastName: "Samaia" },
  97: { abbreviation: "PIQ", firstName: "Pedro", lastName: "Pique" },
  98: { abbreviation: "BOS", firstName: "Felipe", lastName: "Drugovich" },
  99: { abbreviation: "SCH", firstName: "Robert", lastName: "Schwartzman" },
  100: { abbreviation: "NIS", firstName: "Roy", lastName: "Nissany" },
  101: { abbreviation: "SAT", firstName: "Marino", lastName: "Sato" },
  102: { abbreviation: "JAC", firstName: "Aidan", lastName: "Jackson" },
  103: { abbreviation: "AKK", firstName: "Casper", lastName: "Akkerman" },
  109: { abbreviation: "BUT", firstName: "Jenson", lastName: "Button" },
  110: { abbreviation: "COU", firstName: "David", lastName: "Coulthard" },
  111: { abbreviation: "ROS", firstName: "Nico", lastName: "Rosberg" },
  112: { abbreviation: "PIA", firstName: "Oscar", lastName: "Piastri" },
  113: { abbreviation: "LAW", firstName: "Liam", lastName: "Lawson" },
  114: { abbreviation: "VIP", firstName: "Juri", lastName: "Vips" },
  115: { abbreviation: "POU", firstName: "Theo", lastName: "Pourchaire" },
  116: { abbreviation: "VES", firstName: "Richard", lastName: "Verschoor" },
  117: { abbreviation: "ZEN", firstName: "Lirim", lastName: "Zendeli" },
  118: { abbreviation: "BEK", firstName: "David", lastName: "Beckmann" },
  121: { abbreviation: "DEL", firstName: "Alessio", lastName: "Deledda" },
  122: { abbreviation: "VIS", firstName: "Bent", lastName: "Viscaal" },
  123: { abbreviation: "FIT", firstName: "Enzo", lastName: "Fittipaldi" },
  125: { abbreviation: "WEB", firstName: "Mark", lastName: "Webber" },
  126: { abbreviation: "VIL", firstName: "Jacques", lastName: "Villeneuve" },
  127: { abbreviation: "MAY", firstName: "Callie", lastName: "Mayer" },
  128: { abbreviation: "BEL", firstName: "Noah", lastName: "Bell" },
  129: { abbreviation: "HUE", firstName: "Jake", lastName: "Hughes" },
  130: { abbreviation: "VTI", firstName: "Frederik", lastName: "Vesti" },
  131: { abbreviation: "CAL", firstName: "Olli", lastName: "Caldwell" },
  132: { abbreviation: "SAR", firstName: "Logan", lastName: "Sargeant" },
  133: { abbreviation: "BOL", firstName: "Cem", lastName: "Bolukbasi" },
  134: { abbreviation: "IWA", firstName: "Ayumu", lastName: "Iwasa" },
  135: { abbreviation: "NOV", firstName: "Clement", lastName: "Novalak" },
  136: { abbreviation: "DOO", firstName: "Jack", lastName: "Doohan" },
  137: { abbreviation: "COR", firstName: "Amaury", lastName: "Cordeel" },
  138: { abbreviation: "HAU", firstName: "Dennis", lastName: "Hauger" },
  139: { abbreviation: "WIL", firstName: "Calan", lastName: "Williams" },
  140: { abbreviation: "CHA", firstName: "Jamie", lastName: "Chadwick" },
  141: { abbreviation: "KOB", firstName: "Kamui", lastName: "Kobayashi" },
  142: { abbreviation: "MAL", firstName: "Pastor", lastName: "Maldonado" },
  143: { abbreviation: "HAK", firstName: "Mika", lastName: "Hakkinen" },
  144: { abbreviation: "MAN", firstName: "Nigel", lastName: "Mansell" },
  145: { abbreviation: "MAL", firstName: "Zane", lastName: "Maloney" },
  146: { abbreviation: "MAR", firstName: "Victor", lastName: "Martins" },
  147: { abbreviation: "BEA", firstName: "Oliver", lastName: "Bearman" },
  148: { abbreviation: "CRA", firstName: "Jak", lastName: "Crawford" },
  149: { abbreviation: "HAD", firstName: "Isack", lastName: "Hadjar" },
  150: { abbreviation: "ART", firstName: "Arthur", lastName: "Leclerc" },
  151: { abbreviation: "BEN", firstName: "Brad", lastName: "Benavides" },
  152: { abbreviation: "STA", firstName: "Roman", lastName: "Stanek" },
  153: { abbreviation: "MAI", firstName: "Kush", lastName: "Maini" },
  154: { abbreviation: "HUN", firstName: "James", lastName: "Hunt" },
  155: { abbreviation: "MON", firstName: "Juan Pablo", lastName: "Montoya" },
  156: { abbreviation: "LEI", firstName: "Brendon", lastName: "Leigh" },
  157: { abbreviation: "TON", firstName: "David", lastName: "Tonizza" },
  158: { abbreviation: "OPM", firstName: "Jarno", lastName: "Opmeer" },
  159: { abbreviation: "BLA", firstName: "Lucas", lastName: "Blakeley" },
  160: { abbreviation: "ARN", firstName: "Paul", lastName: "Aron" },
  161: { abbreviation: "BOR", firstName: "Gabriel", lastName: "Bortoleto" },
  162: { abbreviation: "COL", firstName: "Franco", lastName: "Colapinto" },
  163: { abbreviation: "BAR", firstName: "Taylor", lastName: "Barnard" },
  164: { abbreviation: "DUR", firstName: "Joshua", lastName: "Dürksen" },
  165: { abbreviation: "ANT", firstName: "Andrea-Kimi", lastName: "Antonelli" },
  166: { abbreviation: "MIY", firstName: "Ritomo", lastName: "Miyata" },
  167: { abbreviation: "VIL", firstName: "Rafael", lastName: "Villagómez" },
  168: { abbreviation: "OSU", firstName: "Zak", lastName: "O'Sullivan" },
  169: { abbreviation: "MAR", firstName: "Pepe", lastName: "Marti" },
  170: { abbreviation: "HAY", firstName: "Sonny", lastName: "Hayes" },
  171: { abbreviation: "PEA", firstName: "Joshua", lastName: "Pearce" },
  172: { abbreviation: "VOI", firstName: "Callum", lastName: "Voisin" },
  173: { abbreviation: "ZAG", firstName: "Matias", lastName: "Zagazeta" },
  174: { abbreviation: "TSO", firstName: "Nikola", lastName: "Tsolov" },
  175: { abbreviation: "TRA", firstName: "Tim", lastName: "Tramnitz" },
  185: { abbreviation: "COR", firstName: "Luca", lastName: "Cortez" },
  255: { abbreviation: "DRV", firstName: "Network", lastName: "Human" }
};
drivers.AI_DRIVER_NAMES = [
  "VETTEL",
  "LATIFI",
  "ALBON",
  "RICCIARDO",
  "SAINZ",
  "RUSSELL",
  "GASLY",
  "TSUNODA",
  "SCHUMACHER",
  "PÉREZ",
  "BOTTAS",
  "GUANYU",
  "GUANYU",
  "ZHOU",
  "OCON",
  "VERSTAPPEN",
  "ALONSO",
  "STROLL",
  "LECLERC",
  "MAGNUSSEN",
  "NORRIS",
  "HAMILTON",
  "SARGEANT",
  "DE VRIES",
  "PIASTRI",
  "HULKENBERG",
  "SENNA",
  "BUTTON",
  "HAKKINEN",
  "MANSELL",
  "VILLENEUVE",
  "KOBAYASHI",
  "MALDONADO",
  "MASSA",
  "BUTLER",
  "AKKERMAN",
  "WEBBER",
  "CHADWICK",
  "JACKSON",
  "MAYER",
  "CALDERÓN",
  "BOSCHUNG",
  "ARMSTRONG",
  "CALDWELL",
  "CORDEEL",
  "DARUVALA",
  "DRUGOVICH",
  "FITTIPALDI",
  "DOOHAN",
  "HAUGER",
  "HUGHES",
  "IWASA",
  "NOVALAK",
  "NISSANY",
  "LAWSON",
  "POURCHAIRE",
  "SATO",
  "VERSCHOOR",
  "WILLIAMS",
  "VIPS",
  "VESTI",
  "MALONEY",
  "MARTINS",
  "BEARMAN",
  "CRAWFORD",
  "HADJAR",
  "BENAVIDES",
  "STANEK",
  "MAINI",
  "LEIGH",
  "TONIZZA",
  "OPMEER",
  "BLAKELY"
];
var ersDeployMode = {};
Object.defineProperty(ersDeployMode, "__esModule", { value: true });
ersDeployMode.ERS_DEPLOY_MODE = void 0;
ersDeployMode.ERS_DEPLOY_MODE = [
  "None",
  "Medium",
  "Hotlap",
  "Overtake"
];
var eventCodes = {};
Object.defineProperty(eventCodes, "__esModule", { value: true });
eventCodes.EVENT_CODES = void 0;
eventCodes.EVENT_CODES = {
  SessionStarted: "SSTA",
  SessionEnded: "SEND",
  FastestLap: "FTLP",
  Retirement: "RTMT",
  DRSEnabled: "DRSE",
  DRSDisabled: "DRSD",
  TeammateInPits: "TMPT",
  ChequeredFlag: "CHQF",
  RaceWinner: "RCWN",
  PenaltyIssued: "PENA",
  SpeedTrapTriggered: "SPTP",
  StartLights: "STLG",
  LightsOut: "LGOT",
  DriveThroughServed: "DTSV",
  StopGoServed: "SGSV",
  Flashback: "FLBK",
  ButtonStatus: "BUTN",
  RedFlag: "RDFL",
  Overtake: "OVTK",
  SafetyCar: "SCAR",
  Collision: "COLL"
};
var formulas = {};
Object.defineProperty(formulas, "__esModule", { value: true });
formulas.FORMULAS = void 0;
formulas.FORMULAS = [
  { name: "F1 Modern", weight: 802 },
  { name: "F1 Classic", weight: 0 },
  { name: "F2", weight: 787 },
  { name: "F1 Generic", weight: 798 },
  { name: "Beta", weight: 798 },
  { name: "Supercars", weight: 0 },
  { name: "Esports", weight: 798 },
  { name: "F2 2021", weight: 787 },
  { name: "F1 World Car", weight: 796 },
  { name: "F1 Elimination", weight: 0 }
];
var fuelMix = {};
Object.defineProperty(fuelMix, "__esModule", { value: true });
fuelMix.FUEL_MIX = void 0;
fuelMix.FUEL_MIX = ["Lean", "Standard", "Rich", "Max"];
var gameModes = {};
Object.defineProperty(gameModes, "__esModule", { value: true });
gameModes.GAME_MODES = void 0;
gameModes.GAME_MODES = {
  0: "Event Mode",
  3: "Grand Prix",
  4: "Grand Prix 23",
  5: "Time Trial",
  6: "Splitscreen",
  7: "Online Custom",
  8: "Online League",
  11: "Career Invitational",
  12: "Championship Invitational",
  13: "Championship",
  14: "Online Championship",
  15: "Online Weekly Event",
  17: "Story Mode Breaking Point",
  19: "Career 22",
  20: "Career 22 Online",
  21: "Career 23",
  22: "Career 23 Online",
  23: "Career 24",
  24: "Career 24 Online",
  25: "My Team Career 24",
  26: "Curated Career 24",
  27: "My Team Career 25",
  28: "Driver Career 25",
  29: "Career 25 Online",
  30: "Challenge Career 25",
  75: "Story Mode APXGP",
  127: "Benchmark"
};
var infringements = {};
Object.defineProperty(infringements, "__esModule", { value: true });
infringements.INFRINGEMENTS = void 0;
infringements.INFRINGEMENTS = [
  "Blocking by slow driving",
  "Blocking by wrong way driving",
  "Reversing off the start line",
  "Big Collision",
  "Small Collision",
  "Collision failed to hand back position single",
  "Collision failed to hand back position multiple",
  "Corner cutting gained time",
  "Corner cutting overtake single",
  "Corner cutting overtake multiple",
  "Crossed pit exit lane",
  "Ignoring blue flags",
  "Ignoring yellow flags",
  "Ignoring drive through",
  "Too many drive throughs",
  "Drive through reminder serve within n laps",
  "Drive through reminder serve this lap",
  "Pit lane speeding",
  "Parked for too long",
  "Ignoring tyre regulations",
  "Too many penalties",
  "Multiple warnings",
  "Approaching disqualification",
  "Tyre regulations select single",
  "Tyre regulations select multiple",
  "Lap invalidated corner cutting",
  "Lap invalidated running wide",
  "Corner cutting ran wide gained time minor",
  "Corner cutting ran wide gained time significant",
  "Corner cutting ran wide gained time extreme",
  "Lap invalidated wall riding",
  "Lap invalidated flashback used",
  "Lap invalidated reset to track",
  "Blocking the pitlane",
  "Jump start",
  "Safety car to car collision",
  "Safety car illegal overtake",
  "Safety car exceeding allowed pace",
  "Virtual safety car exceeding allowed pace",
  "Formation lap below allowed speed",
  "Formation lap parking",
  "Retired mechanical failure",
  "Retired terminally damaged",
  "Safety car falling too far back",
  "Black flag timer",
  "Unserved stop go penalty",
  "Unserved drive through penalty",
  "Engine component change",
  "Gearbox change",
  "Parc Ferme change",
  "League grid penalty",
  "Retry penalty",
  "Illegal time gain",
  "Mandatory pitstop",
  "Attribute assigned"
];
var nationalities = {};
Object.defineProperty(nationalities, "__esModule", { value: true });
nationalities.NATIONALITIES = void 0;
nationalities.NATIONALITIES = {
  1: "American",
  2: "Argentinean",
  3: "Australian",
  4: "Austrian",
  5: "Azerbaijani",
  6: "Bahraini",
  7: "Belgian",
  8: "Bolivian",
  9: "Brazilian",
  10: "British",
  11: "Bulgarian",
  12: "Cameroonian",
  13: "Canadian",
  14: "Chilean",
  15: "Chinese",
  16: "Colombian",
  17: "Costa Rican",
  18: "Croatian",
  19: "Cypriot",
  20: "Czech",
  21: "Danish",
  22: "Dutch",
  23: "Ecuadorian",
  24: "English",
  25: "Emirian",
  26: "Estonian",
  27: "Finnish",
  28: "French",
  29: "German",
  30: "Ghanaian",
  31: "Greek",
  32: "Guatemalan",
  33: "Honduran",
  34: "Hong Konger",
  35: "Hungarian",
  36: "Icelander",
  37: "Indian",
  38: "Indonesian",
  39: "Irish",
  40: "Israeli",
  41: "Italian",
  42: "Jamaican",
  43: "Japanese",
  44: "Jordanian",
  45: "Kuwaiti",
  46: "Latvian",
  47: "Lebanese",
  48: "Lithuanian",
  49: "Luxembourger",
  50: "Malaysian",
  51: "Maltese",
  52: "Mexican",
  53: "Monegasque",
  54: "New Zealander",
  55: "Nicaraguan",
  56: "Northern Irish",
  57: "Norwegian",
  58: "Omani",
  59: "Pakistani",
  60: "Panamanian",
  61: "Paraguayan",
  62: "Peruvian",
  63: "Polish",
  64: "Portuguese",
  65: "Qatari",
  66: "Romanian",
  67: "Russian",
  68: "Salvadoran",
  69: "Saudi",
  70: "Scottish",
  71: "Serbian",
  72: "Singaporean",
  73: "Slovakian",
  74: "Slovenian",
  75: "South Korean",
  76: "South African",
  77: "Spanish",
  78: "Swedish",
  79: "Swiss",
  80: "Thai",
  81: "Turkish",
  82: "Uruguayan",
  83: "Ukrainian",
  84: "Venezuelan",
  85: "Barbadian",
  86: "Welsh",
  87: "Vietnamese",
  88: "Algerian",
  89: "Bosnian",
  90: "Filipino",
  255: "Not found"
};
var packets$1 = {};
Object.defineProperty(packets$1, "__esModule", { value: true });
packets$1.PACKETS = void 0;
packets$1.PACKETS = {
  motion: "motion",
  session: "session",
  lapData: "lapData",
  event: "event",
  participants: "participants",
  carSetups: "carSetups",
  carTelemetry: "carTelemetry",
  carStatus: "carStatus",
  finalClassification: "finalClassification",
  lobbyInfo: "lobbyInfo",
  carDamage: "carDamage",
  sessionHistory: "sessionHistory",
  tyreSets: "tyreSets",
  motionEx: "motionEx",
  timeTrial: "timeTrial",
  lapPositions: "lapPositions"
};
var packetSizes = {};
Object.defineProperty(packetSizes, "__esModule", { value: true });
packetSizes.PACKET_SIZES = void 0;
packetSizes.PACKET_SIZES = {
  motion: { 2025: 1349, 2024: 1349, 2023: 1349, 2022: 1464 },
  session: { 2025: 753, 2024: 753, 2023: 644, 2022: 632 },
  lapData: { 2025: 1285, 2024: 1285, 2023: 1131, 2022: 972 },
  event: { 2025: 45, 2024: 45, 2023: 45, 2022: 40 },
  participants: { 2025: 1284, 2024: 1350, 2023: 1306, 2022: 1257 },
  carSetups: { 2025: 1133, 2024: 1133, 2023: 1107, 2022: 1102 },
  carTelemetry: { 2025: 1352, 2024: 1352, 2023: 1352, 2022: 1347 },
  carStatus: { 2025: 1239, 2024: 1239, 2023: 1239, 2022: 1058 },
  finalClassification: { 2025: 1042, 2024: 1020, 2023: 1020, 2022: 1015 },
  lobbyInfo: { 2025: 954, 2024: 1306, 2023: 1218, 2022: 1191 },
  carDamage: { 2025: 1041, 2024: 953, 2023: 953, 2022: 948 },
  sessionHistory: { 2025: 1460, 2024: 1460, 2023: 1460, 2022: 1155 },
  tyreSets: { 2025: 231, 2024: 231, 2023: 231 },
  motionEx: { 2025: 273, 2024: 237, 2023: 217 },
  timeTrial: { 2025: 101, 2024: 101 },
  lapPositions: { 2025: 1131 }
};
var penalties = {};
Object.defineProperty(penalties, "__esModule", { value: true });
penalties.PENALTIES = void 0;
penalties.PENALTIES = [
  "Drive through",
  "Stop Go",
  "Grid penalty",
  "Penalty reminder",
  "Time penalty",
  "Warning",
  "Disqualified",
  "Removed from formation lap",
  "Parked too long timer",
  "Tyre regulations",
  "This lap invalidated",
  "This and next lap invalidated",
  "This lap invalidated without reason",
  "This and next lap invalidated without reason",
  "This and previous lap invalidated",
  "This and previous lap invalidated without reason",
  "Retired",
  "Black flag timer"
];
var rulesets = {};
Object.defineProperty(rulesets, "__esModule", { value: true });
rulesets.RULESETS = void 0;
rulesets.RULESETS = {
  0: "Practice & Qualifying",
  1: "Race",
  2: "Time Trial",
  4: "Time Attack",
  6: "Checkpoint Challenge",
  8: "Autocross",
  9: "Drift",
  10: "Average Speed Zone",
  11: "Rival Duel",
  12: "Elimination"
};
var safetyCarStatuses = {};
Object.defineProperty(safetyCarStatuses, "__esModule", { value: true });
safetyCarStatuses.SAFETY_CAR_STATUSES = void 0;
safetyCarStatuses.SAFETY_CAR_STATUSES = [
  "No Safety Car",
  "Full Safety Car",
  "Virtual Safety Car",
  "Formation Lap"
];
var sessionTypes = {};
Object.defineProperty(sessionTypes, "__esModule", { value: true });
sessionTypes.SESSION_TYPES = void 0;
sessionTypes.SESSION_TYPES = {
  2023: {
    0: { short: "UNK", long: "Unknown" },
    1: { short: "FP1", long: "Free Practice 1" },
    2: { short: "FP2", long: "Free Practice 2" },
    3: { short: "FP3", long: "Free Practice 3" },
    4: { short: "ShortFP", long: "Short Free Practice" },
    5: { short: "Q1", long: "Qualifying 1" },
    6: { short: "Q2", long: "Qualifying 2" },
    7: { short: "Q3", long: "Qualifying 3" },
    8: { short: "ShortQ", long: "Short Qualifying" },
    9: { short: "OneShotQ", long: "One Shot Qualifying" },
    10: { short: "R", long: "Race" },
    11: { short: "R2", long: "Race 2" },
    12: { short: "R3", long: "Race 3" },
    13: { short: "TT", long: "Time Trial" }
  },
  2024: {
    0: { short: "UNK", long: "Unknown" },
    1: { short: "FP1", long: "Free Practice 1" },
    2: { short: "FP2", long: "Free Practice 2" },
    3: { short: "FP3", long: "Free Practice 3" },
    4: { short: "ShortFP", long: "Short Free Practice" },
    5: { short: "Q1", long: "Qualifying 1" },
    6: { short: "Q2", long: "Qualifying 2" },
    7: { short: "Q3", long: "Qualifying 3" },
    8: { short: "ShortQ", long: "Short Qualifying" },
    9: { short: "OneShotQ", long: "One Shot Qualifying" },
    10: { short: "S1", long: "Sprint Shootout 1" },
    11: { short: "S2", long: "Sprint Shootout 2" },
    12: { short: "S3", long: "Sprint Shootout 3" },
    13: { short: "ShortS", long: "Short Sprint Shootout" },
    14: { short: "OneShotS", long: "One-Shot Sprint Shootout" },
    15: { short: "R", long: "Race" },
    16: { short: "R2", long: "Race 2" },
    17: { short: "R3", long: "Race 3" },
    18: { short: "TT", long: "Time Trial" }
  },
  2025: {
    0: { short: "UNK", long: "Unknown" },
    1: { short: "FP1", long: "Free Practice 1" },
    2: { short: "FP2", long: "Free Practice 2" },
    3: { short: "FP3", long: "Free Practice 3" },
    4: { short: "ShortFP", long: "Short Free Practice" },
    5: { short: "Q1", long: "Qualifying 1" },
    6: { short: "Q2", long: "Qualifying 2" },
    7: { short: "Q3", long: "Qualifying 3" },
    8: { short: "ShortQ", long: "Short Qualifying" },
    9: { short: "OneShotQ", long: "One Shot Qualifying" },
    10: { short: "S1", long: "Sprint Shootout 1" },
    11: { short: "S2", long: "Sprint Shootout 2" },
    12: { short: "S3", long: "Sprint Shootout 3" },
    13: { short: "ShortS", long: "Short Sprint Shootout" },
    14: { short: "OneShotS", long: "One-Shot Sprint Shootout" },
    15: { short: "R", long: "Race" },
    16: { short: "R2", long: "Race 2" },
    17: { short: "R3", long: "Race 3" },
    18: { short: "TT", long: "Time Trial" }
  }
};
var surfaces = {};
Object.defineProperty(surfaces, "__esModule", { value: true });
surfaces.SURFACES = void 0;
surfaces.SURFACES = [
  "Tarmac",
  "Rumble strip",
  "Concrete",
  "Rock",
  "Gravel",
  "Mud",
  "Sand",
  "Grass",
  "Water",
  "Cobblestone",
  "Metal",
  "Ridged"
];
var teams = {};
Object.defineProperty(teams, "__esModule", { value: true });
teams.TEAMS = void 0;
const MERCEDES_COLOR = "#00D2BE";
const FERRARI_COLOR = "#DC0000";
const RED_BULL_COLOR = "#0600EF";
const WILLIAMS_COLOR = "#005AFF";
const ASTON_MARTIN_COLOR = "#006F62";
const ALPINE_COLOR = "#0090FF";
const ALPHA_TAURI_COLOR = "#2B4562";
const HAAS_COLOR = "#FFFFFF";
const MCLAREN_COLOR = "#FF8700";
const ALFA_ROMEO_COLOR = "#900000";
const ART_GRAND_PRIX_COLOR = "#B4B3B4";
const CAMPOS_VEXATEC_COLOR = "#EBC110";
const CARLIN_COLOR = "#243EF6";
const CHAROUZ_COLOR = "#84020A";
const DAMS_COLOR = "#0ED4FA";
const MP_MOTORSPORT_COLOR = "#F7401A";
const TRIDENT_COLOR = "#0E1185";
const BWT_ARDEN_COLOR = "#ff88d3";
const UNI_VIRTUOSI_COLOR = "#FBEC20";
const PREMA_COLOR = "#E80309";
const HITECH_COLOR = "#E8E8E8";
const RACING_POINT_COLOR_2020 = "#FAA0BE";
const RENAULT_COLOR_2020 = "#FFF500";
teams.TEAMS = {
  2023: {
    0: { name: "Mercedes", color: MERCEDES_COLOR },
    1: { name: "Ferrari", color: FERRARI_COLOR },
    2: { name: "Red Bull Racing", color: RED_BULL_COLOR },
    3: { name: "Williams", color: WILLIAMS_COLOR },
    4: { name: "Aston Martin", color: ASTON_MARTIN_COLOR },
    5: { name: "Alpine", color: ALPINE_COLOR },
    6: { name: "Alpha Tauri", color: ALPHA_TAURI_COLOR },
    7: { name: "Haas", color: HAAS_COLOR },
    8: { name: "McLaren", color: MCLAREN_COLOR },
    9: { name: "Alfa Romeo", color: ALFA_ROMEO_COLOR },
    41: { name: "F1 Generic", color: "#FFFFFF" },
    85: { name: "Mercedes 2020", color: HITECH_COLOR },
    86: { name: "Ferrari 2020", color: FERRARI_COLOR },
    87: { name: "Red Bull 2020", color: RED_BULL_COLOR },
    88: { name: "Williams 2020", color: WILLIAMS_COLOR },
    89: { name: "Racing Point 2020", color: RACING_POINT_COLOR_2020 },
    90: { name: "Renault 2020", color: RENAULT_COLOR_2020 },
    91: { name: "Alpha Tauri 2020", color: ALPHA_TAURI_COLOR },
    92: { name: "Haas 2020", color: HAAS_COLOR },
    93: { name: "McLaren 2020", color: MCLAREN_COLOR },
    94: { name: "Alfa Romeo 2020", color: ALFA_ROMEO_COLOR },
    95: { name: "Aston Martin DB11 V12", color: ASTON_MARTIN_COLOR },
    96: { name: "Aston Martin Vantage F1 Edition", color: ASTON_MARTIN_COLOR },
    97: { name: "Aston Martin Vantage Safety Car", color: ASTON_MARTIN_COLOR },
    98: { name: "Ferrari F8 Tributo", color: FERRARI_COLOR },
    99: { name: "Ferrari Roma", color: FERRARI_COLOR },
    100: { name: "McLaren 720S", color: MCLAREN_COLOR },
    101: { name: "McLaren Artura", color: MCLAREN_COLOR },
    102: {
      name: "Mercedes AMG GT Black Series Safety Car",
      color: MERCEDES_COLOR
    },
    103: { name: "Mercedes AMG GTR Pro", color: MERCEDES_COLOR },
    104: { name: "F1 Custom Team", color: "#FFFFFF" },
    106: { name: "Prema 21", color: PREMA_COLOR },
    107: { name: "Uni-Virtuosi 21", color: UNI_VIRTUOSI_COLOR },
    108: { name: "Carlin 21", color: CARLIN_COLOR },
    109: { name: "HiTech 21", color: HITECH_COLOR },
    110: { name: "ART GP 21", color: ART_GRAND_PRIX_COLOR },
    111: { name: "MP Motorsport 21", color: MP_MOTORSPORT_COLOR },
    112: { name: "Charouz 21", color: CHAROUZ_COLOR },
    113: { name: "Dams 21", color: DAMS_COLOR },
    114: { name: "Campos 21", color: CAMPOS_VEXATEC_COLOR },
    115: { name: "BWT 21", color: BWT_ARDEN_COLOR },
    116: { name: "Trident 21", color: TRIDENT_COLOR },
    117: { name: "Mercedes AMG GT Black Series", color: MERCEDES_COLOR },
    118: { name: "Mercedes 22", color: MERCEDES_COLOR },
    119: { name: "Ferrari 22", color: FERRARI_COLOR },
    120: { name: "Red Bull Racing 22", color: RED_BULL_COLOR },
    121: { name: "Williams 22", color: WILLIAMS_COLOR },
    122: { name: "Aston Martin 22", color: ASTON_MARTIN_COLOR },
    123: { name: "Alpine 22", color: ALPINE_COLOR },
    124: { name: "Alpha Tauri 22", color: ALPHA_TAURI_COLOR },
    125: { name: "Haas 22", color: HAAS_COLOR },
    126: { name: "McLaren 22", color: MCLAREN_COLOR },
    127: { name: "Alfa Romeo 22", color: ALFA_ROMEO_COLOR },
    128: { name: "Konnersport 22", color: MERCEDES_COLOR },
    129: { name: "Konnersport", color: MERCEDES_COLOR },
    130: { name: "Prema 22", color: PREMA_COLOR },
    131: { name: "Virtuosi 22", color: UNI_VIRTUOSI_COLOR },
    132: { name: "Carlin 22", color: CARLIN_COLOR },
    133: { name: "MP Motorsport 22", color: MP_MOTORSPORT_COLOR },
    134: { name: "Charouz 22", color: CHAROUZ_COLOR },
    135: { name: "Dams 22", color: DAMS_COLOR },
    136: { name: "Campos 22", color: CAMPOS_VEXATEC_COLOR },
    137: { name: "Van Amersfoort Racing 22", color: "#FFFFFF" },
    138: { name: "Trident 22", color: TRIDENT_COLOR },
    139: { name: "Hitech 22", color: "#FFFFFF" },
    140: { name: "Art GP 22", color: "#FFFFFF" },
    143: { name: "Art GP 23", color: "#FFFFFF" },
    144: { name: "Campos 23", color: CAMPOS_VEXATEC_COLOR },
    145: { name: "Carlin 23", color: CARLIN_COLOR },
    146: { name: "PHM 23", color: "#FFFFFF" },
    147: { name: "Dams 23", color: DAMS_COLOR },
    148: { name: "Hitech 23", color: "#FFFFFF" },
    149: { name: "MP Motorsport 23", color: MP_MOTORSPORT_COLOR },
    150: { name: "Prema 23", color: PREMA_COLOR },
    151: { name: "Trident 23", color: TRIDENT_COLOR },
    152: { name: "Van Amersfoort Racing 23", color: "#FFFFFF" },
    153: { name: "Virtuosi 23", color: UNI_VIRTUOSI_COLOR },
    255: { name: "Not found", color: "#FFFFFF" }
  },
  2024: {
    0: { name: "Mercedes", color: MERCEDES_COLOR },
    1: { name: "Ferrari", color: FERRARI_COLOR },
    2: { name: "Red Bull Racing", color: RED_BULL_COLOR },
    3: { name: "Williams", color: WILLIAMS_COLOR },
    4: { name: "Aston Martin", color: ASTON_MARTIN_COLOR },
    5: { name: "Alpine", color: ALPINE_COLOR },
    6: { name: "RB", color: ALPHA_TAURI_COLOR },
    7: { name: "Haas", color: HAAS_COLOR },
    8: { name: "McLaren", color: MCLAREN_COLOR },
    9: { name: "Sauber", color: ALFA_ROMEO_COLOR },
    41: { name: "F1 Generic", color: "#FFFFFF" },
    104: { name: "F1 Custom Team", color: "#FFFFFF" },
    143: { name: "Art GP '23", color: ART_GRAND_PRIX_COLOR },
    144: { name: "Campos '23", color: CAMPOS_VEXATEC_COLOR },
    145: { name: "Carlin '23", color: CARLIN_COLOR },
    146: { name: "PHM '23", color: "#FFFFFF" },
    147: { name: "Dams '23", color: DAMS_COLOR },
    148: { name: "Hitech '23", color: HITECH_COLOR },
    149: { name: "MP Motorsport '23", color: MP_MOTORSPORT_COLOR },
    150: { name: "Prema '23", color: PREMA_COLOR },
    151: { name: "Trident '23", color: TRIDENT_COLOR },
    152: { name: "Van Amersfoort Racing '23", color: "#FFFFFF" },
    153: { name: "Virtuosi '23", color: UNI_VIRTUOSI_COLOR }
  },
  2025: {
    0: { name: "Mercedes", color: MERCEDES_COLOR },
    1: { name: "Ferrari", color: FERRARI_COLOR },
    2: { name: "Red Bull Racing", color: RED_BULL_COLOR },
    3: { name: "Williams", color: WILLIAMS_COLOR },
    4: { name: "Aston Martin", color: ASTON_MARTIN_COLOR },
    5: { name: "Alpine", color: ALPINE_COLOR },
    6: { name: "RB", color: ALPHA_TAURI_COLOR },
    7: { name: "Haas", color: HAAS_COLOR },
    8: { name: "McLaren", color: MCLAREN_COLOR },
    9: { name: "Sauber", color: ALFA_ROMEO_COLOR },
    41: { name: "F1 Generic", color: "#FFFFFF" },
    104: { name: "F1 Custom Team", color: "#FFFFFF" },
    129: { name: "Konnersport", color: MERCEDES_COLOR },
    142: { name: "APXGP 24", color: "#FFFFFF" },
    154: { name: "APXGP 25", color: "#FFFFFF" },
    155: { name: "Konnersport 24", color: MERCEDES_COLOR },
    158: { name: "Art GP '24", color: ART_GRAND_PRIX_COLOR },
    159: { name: "Campos '24", color: CAMPOS_VEXATEC_COLOR },
    160: { name: "Rodin Motorsport 24", color: "#FFFFFF" },
    161: { name: "AIX Racing 24", color: "#FFFFFF" },
    162: { name: "DAMS 24", color: DAMS_COLOR },
    163: { name: "Hitech 24", color: HITECH_COLOR },
    164: { name: "MP Motorsport 24", color: MP_MOTORSPORT_COLOR },
    165: { name: "Prema 24", color: PREMA_COLOR },
    166: { name: "Trident 24", color: TRIDENT_COLOR },
    167: { name: "Van Amersfoort Racing 24", color: "#FFFFFF" },
    168: { name: "Invicta 24", color: "#FFFFFF" },
    185: { name: "Mercedes 24", color: MERCEDES_COLOR },
    186: { name: "Ferrari 24", color: FERRARI_COLOR },
    187: { name: "Red Bull Racing 24", color: RED_BULL_COLOR },
    188: { name: "Williams 24", color: WILLIAMS_COLOR },
    189: { name: "Aston Martin 24", color: ASTON_MARTIN_COLOR },
    190: { name: "Alpine 24", color: ALPINE_COLOR },
    191: { name: "RB 24", color: ALPHA_TAURI_COLOR },
    192: { name: "Haas 24", color: HAAS_COLOR },
    193: { name: "McLaren 24", color: MCLAREN_COLOR },
    194: { name: "Sauber 24", color: ALFA_ROMEO_COLOR }
  }
};
var tracks = {};
Object.defineProperty(tracks, "__esModule", { value: true });
tracks.TRACKS = void 0;
tracks.TRACKS = [
  { name: "Melbourne", lat: -37.8499733, lon: 144.968826 },
  { name: "Paul Ricard", lat: 43.25213598057694, lon: 5.791287971011817 },
  { name: "Shanghai", lat: 31.33714419, lon: 121.22012219 },
  { name: "Sakhir", lat: 26.03246116, lon: 50.51050279 },
  { name: "Catalunya", lat: 41.5700299, lon: 2.261216 },
  { name: "Monaco", lat: 43.735025, lon: 7.421238 },
  { name: "Montreal", lat: 45.500055, lon: -73.522705 },
  { name: "Silverstone", lat: 52.06922421, lon: -1.02226861 },
  { name: "Hockenheim", lat: 49.32777079, lon: 8.56585016 },
  { name: "Hungaroring", lat: 47.578883, lon: 19.248414 },
  { name: "Spa", lat: 50.4431666, lon: 5.9661833 },
  { name: "Monza", lat: 45.6177419, lon: 9.2809437 },
  { name: "Singapore", lat: 1.29169511, lon: 103.8641588 },
  { name: "Suzuka", lat: 34.84321, lon: 136.5404439 },
  { name: "Abu Dhabi", lat: 24.46990897, lon: 54.6052121 },
  { name: "Texas", lat: 30.1335334, lon: -97.642269 },
  { name: "Brazil", lat: -23.704032, lon: -46.699871 },
  { name: "Austria", lat: 47.22031495, lon: 14.76673126 },
  { name: "Sochi", lat: 43.4114524, lon: 39.9696737 },
  { name: "Mexico", lat: 19.406146, lon: -99.092836 },
  { name: "Baku", lat: 40.3726657, lon: 49.8531916 },
  { name: "Sakhir Short", lat: 26.03246116, lon: 50.51050279 },
  { name: "Silverstone Short", lat: 52.06922421, lon: -1.02226861 },
  { name: "Texas Short", lat: 30.1335334, lon: -97.642269 },
  { name: "Suzuka Short", lat: 34.84321, lon: 136.5404439 },
  { name: "Hanoi", lat: 21.0139046, lon: 105.7621805 },
  { name: "Zandvoort", lat: 52.388851, lon: 4.5407599 },
  { name: "Imola", lat: 44.3440293, lon: 11.7163993 },
  { name: "Portimão", lat: 37.2297999, lon: -8.6299166 },
  { name: "Jeddah", lat: 21.63258357, lon: 39.1045163 },
  { name: "Miami", lat: 25.95597587, lon: -80.23981988 },
  { name: "Las Vegas", lat: 36.10983670164431, lon: -115.16149946704398 },
  { name: "Losail", lat: 25.489072129113993, lon: 51.44970029356955 },
  { name: "33", lat: 0, lon: 0 },
  { name: "34", lat: 0, lon: 0 },
  { name: "35", lat: 0, lon: 0 },
  { name: "36", lat: 0, lon: 0 },
  { name: "37", lat: 0, lon: 0 },
  { name: "38", lat: 0, lon: 0 },
  { name: "Silverstone Reverse", lat: 52.06922421, lon: -1.02226861 },
  { name: "Austria Reverse", lat: 47.22031495, lon: 14.76673126 },
  { name: "Zandvoort Reverse", lat: 52.388851, lon: 4.5407599 }
];
var tyres = {};
Object.defineProperty(tyres, "__esModule", { value: true });
tyres.TYRES = void 0;
tyres.TYRES = {
  0: { color: "#ffb3c3", name: "Hyper Soft" },
  1: { color: "#b14ba7", name: "Ultra Soft" },
  2: { color: "#f92d29", name: "Super Soft" },
  3: { color: "#ebd25f", name: "Soft" },
  4: { color: "#ffffff", name: "Medium" },
  5: { color: "#03a2f3", name: "Hard" },
  6: { color: "#ff803f", name: "Super Hard" },
  7: { color: "#3ac82b", name: "Intermediate" },
  8: { color: "#4491d2", name: "Wet" },
  9: { color: "#3ac82b", name: "Dry" },
  10: { color: "#4491d2", name: "Wet" },
  11: { color: "#f92d29", name: "Super Soft" },
  12: { color: "#f92d29", name: "Soft" },
  13: { color: "#ebd25f", name: "Medium" },
  14: { color: "#ffffff", name: "Hard" },
  15: { color: "#4491d2", name: "Wet" },
  16: { color: "#f92d29", name: "C5" },
  17: { color: "#f92d29", name: "C4" },
  18: { color: "#ebd25f", name: "C3" },
  19: { color: "#ffffff", name: "C2" },
  20: { color: "#ffffff", name: "C1" },
  21: { color: "#ffffff", name: "C0" },
  22: { color: "#f92d29", name: "C6" }
};
var weather = {};
Object.defineProperty(weather, "__esModule", { value: true });
weather.WEATHER = void 0;
weather.WEATHER = [
  "Clear",
  "Light Cloud",
  "Overcast",
  "Light Rain",
  "Heavy Rain",
  "Storm"
];
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.WEATHER = exports.TYRES = exports.TRACKS = exports.TEAMS = exports.SURFACES = exports.SESSION_TYPES = exports.SAFETY_CAR_STATUSES = exports.RULESETS = exports.PENALTIES = exports.PACKET_SIZES = exports.PACKETS = exports.NATIONALITIES = exports.INFRINGEMENTS = exports.GAME_MODES = exports.FUEL_MIX = exports.FORMULAS = exports.EVENT_CODES = exports.ERS_DEPLOY_MODE = exports.AI_DRIVER_NAMES = exports.DRIVERS = exports.BUTTON_FLAGS = void 0;
  const buttonFlags_1 = buttonFlags;
  Object.defineProperty(exports, "BUTTON_FLAGS", { enumerable: true, get: function() {
    return buttonFlags_1.BUTTON_FLAGS;
  } });
  const drivers_1 = drivers;
  Object.defineProperty(exports, "DRIVERS", { enumerable: true, get: function() {
    return drivers_1.DRIVERS;
  } });
  Object.defineProperty(exports, "AI_DRIVER_NAMES", { enumerable: true, get: function() {
    return drivers_1.AI_DRIVER_NAMES;
  } });
  const ersDeployMode_1 = ersDeployMode;
  Object.defineProperty(exports, "ERS_DEPLOY_MODE", { enumerable: true, get: function() {
    return ersDeployMode_1.ERS_DEPLOY_MODE;
  } });
  const eventCodes_1 = eventCodes;
  Object.defineProperty(exports, "EVENT_CODES", { enumerable: true, get: function() {
    return eventCodes_1.EVENT_CODES;
  } });
  const formulas_1 = formulas;
  Object.defineProperty(exports, "FORMULAS", { enumerable: true, get: function() {
    return formulas_1.FORMULAS;
  } });
  const fuelMix_1 = fuelMix;
  Object.defineProperty(exports, "FUEL_MIX", { enumerable: true, get: function() {
    return fuelMix_1.FUEL_MIX;
  } });
  const gameModes_1 = gameModes;
  Object.defineProperty(exports, "GAME_MODES", { enumerable: true, get: function() {
    return gameModes_1.GAME_MODES;
  } });
  const infringements_1 = infringements;
  Object.defineProperty(exports, "INFRINGEMENTS", { enumerable: true, get: function() {
    return infringements_1.INFRINGEMENTS;
  } });
  const nationalities_1 = nationalities;
  Object.defineProperty(exports, "NATIONALITIES", { enumerable: true, get: function() {
    return nationalities_1.NATIONALITIES;
  } });
  const packets_12 = packets$1;
  Object.defineProperty(exports, "PACKETS", { enumerable: true, get: function() {
    return packets_12.PACKETS;
  } });
  const packetSizes_1 = packetSizes;
  Object.defineProperty(exports, "PACKET_SIZES", { enumerable: true, get: function() {
    return packetSizes_1.PACKET_SIZES;
  } });
  const penalties_1 = penalties;
  Object.defineProperty(exports, "PENALTIES", { enumerable: true, get: function() {
    return penalties_1.PENALTIES;
  } });
  const rulesets_1 = rulesets;
  Object.defineProperty(exports, "RULESETS", { enumerable: true, get: function() {
    return rulesets_1.RULESETS;
  } });
  const safetyCarStatuses_1 = safetyCarStatuses;
  Object.defineProperty(exports, "SAFETY_CAR_STATUSES", { enumerable: true, get: function() {
    return safetyCarStatuses_1.SAFETY_CAR_STATUSES;
  } });
  const sessionTypes_1 = sessionTypes;
  Object.defineProperty(exports, "SESSION_TYPES", { enumerable: true, get: function() {
    return sessionTypes_1.SESSION_TYPES;
  } });
  const surfaces_1 = surfaces;
  Object.defineProperty(exports, "SURFACES", { enumerable: true, get: function() {
    return surfaces_1.SURFACES;
  } });
  const teams_1 = teams;
  Object.defineProperty(exports, "TEAMS", { enumerable: true, get: function() {
    return teams_1.TEAMS;
  } });
  const tracks_1 = tracks;
  Object.defineProperty(exports, "TRACKS", { enumerable: true, get: function() {
    return tracks_1.TRACKS;
  } });
  const tyres_1 = tyres;
  Object.defineProperty(exports, "TYRES", { enumerable: true, get: function() {
    return tyres_1.TYRES;
  } });
  const weather_1 = weather;
  Object.defineProperty(exports, "WEATHER", { enumerable: true, get: function() {
    return weather_1.WEATHER;
  } });
})(constants$1);
var types$1 = {};
Object.defineProperty(types$1, "__esModule", { value: true });
var packets = {};
var PacketCarDamageDataParser$1 = {};
var F1Parser$1 = {};
var binary_parser = {};
(function(scope) {
  function B(r, e) {
    var f;
    return r instanceof Buffer ? f = r : f = Buffer.from(r.buffer, r.byteOffset, r.byteLength), f.toString(e);
  }
  var w = function(r) {
    return Buffer.from(r);
  };
  function h(r) {
    for (var e = 0, f = Math.min(256 * 256, r.length + 1), n = new Uint16Array(f), i = [], o = 0; ; ) {
      var t = e < r.length;
      if (!t || o >= f - 1) {
        var s = n.subarray(0, o), m = s;
        if (i.push(String.fromCharCode.apply(null, m)), !t) return i.join("");
        r = r.subarray(e), e = 0, o = 0;
      }
      var a = r[e++];
      if ((a & 128) === 0) n[o++] = a;
      else if ((a & 224) === 192) {
        var d = r[e++] & 63;
        n[o++] = (a & 31) << 6 | d;
      } else if ((a & 240) === 224) {
        var d = r[e++] & 63, l = r[e++] & 63;
        n[o++] = (a & 31) << 12 | d << 6 | l;
      } else if ((a & 248) === 240) {
        var d = r[e++] & 63, l = r[e++] & 63, R = r[e++] & 63, c = (a & 7) << 18 | d << 12 | l << 6 | R;
        c > 65535 && (c -= 65536, n[o++] = c >>> 10 & 1023 | 55296, c = 56320 | c & 1023), n[o++] = c;
      }
    }
  }
  function F(r) {
    for (var e = 0, f = r.length, n = 0, i = Math.max(32, f + (f >>> 1) + 7), o = new Uint8Array(i >>> 3 << 3); e < f; ) {
      var t = r.charCodeAt(e++);
      if (t >= 55296 && t <= 56319) {
        if (e < f) {
          var s = r.charCodeAt(e);
          (s & 64512) === 56320 && (++e, t = ((t & 1023) << 10) + (s & 1023) + 65536);
        }
        if (t >= 55296 && t <= 56319) continue;
      }
      if (n + 4 > o.length) {
        i += 8, i *= 1 + e / r.length * 2, i = i >>> 3 << 3;
        var m = new Uint8Array(i);
        m.set(o), o = m;
      }
      if ((t & 4294967168) === 0) {
        o[n++] = t;
        continue;
      } else if ((t & 4294965248) === 0) o[n++] = t >>> 6 & 31 | 192;
      else if ((t & 4294901760) === 0) o[n++] = t >>> 12 & 15 | 224, o[n++] = t >>> 6 & 63 | 128;
      else if ((t & 4292870144) === 0) o[n++] = t >>> 18 & 7 | 240, o[n++] = t >>> 12 & 63 | 128, o[n++] = t >>> 6 & 63 | 128;
      else continue;
      o[n++] = t & 63 | 128;
    }
    return o.slice ? o.slice(0, n) : o.subarray(0, n);
  }
  var u = "Failed to ", p = function(r, e, f) {
    if (r) throw new Error("".concat(u).concat(e, ": the '").concat(f, "' option is unsupported."));
  };
  var x = typeof Buffer == "function" && Buffer.from;
  var A = x ? w : F;
  function v() {
    this.encoding = "utf-8";
  }
  v.prototype.encode = function(r, e) {
    return p(e && e.stream, "encode", "stream"), A(r);
  };
  function U(r) {
    var e;
    try {
      var f = new Blob([r], { type: "text/plain;charset=UTF-8" });
      e = URL.createObjectURL(f);
      var n = new XMLHttpRequest();
      return n.open("GET", e, false), n.send(), n.responseText;
    } finally {
      e && URL.revokeObjectURL(e);
    }
  }
  var O = !x && typeof Blob == "function" && typeof URL == "function" && typeof URL.createObjectURL == "function", S = ["utf-8", "utf8", "unicode-1-1-utf-8"], T = h;
  x ? T = B : O && (T = function(r) {
    try {
      return U(r);
    } catch (e) {
      return h(r);
    }
  });
  var y = "construct 'TextDecoder'", E = "".concat(u, " ").concat(y, ": the ");
  function g(r, e) {
    p(e && e.fatal, y, "fatal"), r = r || "utf-8";
    var f;
    if (x ? f = Buffer.isEncoding(r) : f = S.indexOf(r.toLowerCase()) !== -1, !f) throw new RangeError("".concat(E, " encoding label provided ('").concat(r, "') is invalid."));
    this.encoding = r, this.fatal = false, this.ignoreBOM = false;
  }
  g.prototype.decode = function(r, e) {
    p(e && e.stream, "decode", "stream");
    var f;
    return r instanceof Uint8Array ? f = r : r.buffer instanceof ArrayBuffer ? f = new Uint8Array(r.buffer) : f = new Uint8Array(r), T(f, this.encoding);
  };
  scope.TextEncoder = scope.TextEncoder || v;
  scope.TextDecoder = scope.TextDecoder || g;
})(typeof window !== "undefined" ? window : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : commonjsGlobal);
var context = {};
Object.defineProperty(context, "__esModule", { value: true });
context.Context = void 0;
var Context = (
  /** @class */
  function() {
    function Context2(importPath) {
      this.code = "";
      this.scopes = [["vars"]];
      this.bitFields = [];
      this.tmpVariableCount = 0;
      this.references = {};
      this.imports = [];
      this.reverseImports = /* @__PURE__ */ new Map();
      this.importPath = importPath;
    }
    Context2.prototype.generateVariable = function(name) {
      var arr = [];
      var scopes = this.scopes[this.scopes.length - 1];
      arr.push.apply(arr, scopes);
      if (name) {
        arr.push(name);
      }
      return arr.join(".");
    };
    Context2.prototype.generateOption = function(val) {
      switch (typeof val) {
        case "number":
          return val.toString();
        case "string":
          return this.generateVariable(val);
        case "function":
          return this.addImport(val) + ".call(" + this.generateVariable() + ", vars)";
      }
    };
    Context2.prototype.generateError = function(err) {
      this.pushCode("throw new Error(" + err + ");");
    };
    Context2.prototype.generateTmpVariable = function() {
      return "$tmp" + this.tmpVariableCount++;
    };
    Context2.prototype.pushCode = function(code) {
      this.code += code + "\n";
    };
    Context2.prototype.pushPath = function(name) {
      if (name) {
        this.scopes[this.scopes.length - 1].push(name);
      }
    };
    Context2.prototype.popPath = function(name) {
      if (name) {
        this.scopes[this.scopes.length - 1].pop();
      }
    };
    Context2.prototype.pushScope = function(name) {
      this.scopes.push([name]);
    };
    Context2.prototype.popScope = function() {
      this.scopes.pop();
    };
    Context2.prototype.addImport = function(im) {
      if (!this.importPath)
        return "(" + im + ")";
      var id = this.reverseImports.get(im);
      if (!id) {
        id = this.imports.push(im) - 1;
        this.reverseImports.set(im, id);
      }
      return this.importPath + "[" + id + "]";
    };
    Context2.prototype.addReference = function(alias) {
      if (this.references[alias])
        return;
      this.references[alias] = { resolved: false, requested: false };
    };
    Context2.prototype.markResolved = function(alias) {
      this.references[alias].resolved = true;
    };
    Context2.prototype.markRequested = function(aliasList) {
      var _this = this;
      aliasList.forEach(function(alias) {
        _this.references[alias].requested = true;
      });
    };
    Context2.prototype.getUnresolvedReferences = function() {
      var references = this.references;
      return Object.keys(this.references).filter(function(alias) {
        return !references[alias].resolved && !references[alias].requested;
      });
    };
    return Context2;
  }()
);
context.Context = Context;
Object.defineProperty(binary_parser, "__esModule", { value: true });
binary_parser.Parser = void 0;
var context_1 = context;
var aliasRegistry = {};
var FUNCTION_PREFIX = "___parser_";
var PRIMITIVE_SIZES = {
  uint8: 1,
  uint16le: 2,
  uint16be: 2,
  uint32le: 4,
  uint32be: 4,
  int8: 1,
  int16le: 2,
  int16be: 2,
  int32le: 4,
  int32be: 4,
  int64be: 8,
  int64le: 8,
  uint64be: 8,
  uint64le: 8,
  floatle: 4,
  floatbe: 4,
  doublele: 8,
  doublebe: 8
};
var PRIMITIVE_NAMES = {
  uint8: "Uint8",
  uint16le: "Uint16",
  uint16be: "Uint16",
  uint32le: "Uint32",
  uint32be: "Uint32",
  int8: "Int8",
  int16le: "Int16",
  int16be: "Int16",
  int32le: "Int32",
  int32be: "Int32",
  int64be: "BigInt64",
  int64le: "BigInt64",
  uint64be: "BigUint64",
  uint64le: "BigUint64",
  floatle: "Float32",
  floatbe: "Float32",
  doublele: "Float64",
  doublebe: "Float64"
};
var PRIMITIVE_LITTLE_ENDIANS = {
  uint8: false,
  uint16le: true,
  uint16be: false,
  uint32le: true,
  uint32be: false,
  int8: false,
  int16le: true,
  int16be: false,
  int32le: true,
  int32be: false,
  int64be: false,
  int64le: true,
  uint64be: false,
  uint64le: true,
  floatle: true,
  floatbe: false,
  doublele: true,
  doublebe: false
};
var Parser = (
  /** @class */
  function() {
    function Parser2() {
      this.varName = "";
      this.type = "";
      this.options = {};
      this.next = null;
      this.head = null;
      this.compiled = null;
      this.endian = "be";
      this.constructorFn = null;
      this.alias = null;
    }
    Parser2.start = function() {
      return new Parser2();
    };
    Parser2.prototype.primitiveGenerateN = function(type, ctx) {
      var typeName = PRIMITIVE_NAMES[type];
      var littleEndian = PRIMITIVE_LITTLE_ENDIANS[type];
      ctx.pushCode(ctx.generateVariable(this.varName) + " = dataView.get" + typeName + "(offset, " + littleEndian + ");");
      ctx.pushCode("offset += " + PRIMITIVE_SIZES[type] + ";");
    };
    Parser2.prototype.primitiveN = function(type, varName, options) {
      return this.setNextParser(type, varName, options);
    };
    Parser2.prototype.useThisEndian = function(type) {
      return type + this.endian.toLowerCase();
    };
    Parser2.prototype.uint8 = function(varName, options) {
      return this.primitiveN("uint8", varName, options);
    };
    Parser2.prototype.uint16 = function(varName, options) {
      return this.primitiveN(this.useThisEndian("uint16"), varName, options);
    };
    Parser2.prototype.uint16le = function(varName, options) {
      return this.primitiveN("uint16le", varName, options);
    };
    Parser2.prototype.uint16be = function(varName, options) {
      return this.primitiveN("uint16be", varName, options);
    };
    Parser2.prototype.uint32 = function(varName, options) {
      return this.primitiveN(this.useThisEndian("uint32"), varName, options);
    };
    Parser2.prototype.uint32le = function(varName, options) {
      return this.primitiveN("uint32le", varName, options);
    };
    Parser2.prototype.uint32be = function(varName, options) {
      return this.primitiveN("uint32be", varName, options);
    };
    Parser2.prototype.int8 = function(varName, options) {
      return this.primitiveN("int8", varName, options);
    };
    Parser2.prototype.int16 = function(varName, options) {
      return this.primitiveN(this.useThisEndian("int16"), varName, options);
    };
    Parser2.prototype.int16le = function(varName, options) {
      return this.primitiveN("int16le", varName, options);
    };
    Parser2.prototype.int16be = function(varName, options) {
      return this.primitiveN("int16be", varName, options);
    };
    Parser2.prototype.int32 = function(varName, options) {
      return this.primitiveN(this.useThisEndian("int32"), varName, options);
    };
    Parser2.prototype.int32le = function(varName, options) {
      return this.primitiveN("int32le", varName, options);
    };
    Parser2.prototype.int32be = function(varName, options) {
      return this.primitiveN("int32be", varName, options);
    };
    Parser2.prototype.bigIntVersionCheck = function() {
      if (!DataView.prototype.getBigInt64)
        throw new Error("BigInt64 is unsupported in this runtime");
    };
    Parser2.prototype.int64 = function(varName, options) {
      this.bigIntVersionCheck();
      return this.primitiveN(this.useThisEndian("int64"), varName, options);
    };
    Parser2.prototype.int64be = function(varName, options) {
      this.bigIntVersionCheck();
      return this.primitiveN("int64be", varName, options);
    };
    Parser2.prototype.int64le = function(varName, options) {
      this.bigIntVersionCheck();
      return this.primitiveN("int64le", varName, options);
    };
    Parser2.prototype.uint64 = function(varName, options) {
      this.bigIntVersionCheck();
      return this.primitiveN(this.useThisEndian("uint64"), varName, options);
    };
    Parser2.prototype.uint64be = function(varName, options) {
      this.bigIntVersionCheck();
      return this.primitiveN("uint64be", varName, options);
    };
    Parser2.prototype.uint64le = function(varName, options) {
      this.bigIntVersionCheck();
      return this.primitiveN("uint64le", varName, options);
    };
    Parser2.prototype.floatle = function(varName, options) {
      return this.primitiveN("floatle", varName, options);
    };
    Parser2.prototype.floatbe = function(varName, options) {
      return this.primitiveN("floatbe", varName, options);
    };
    Parser2.prototype.doublele = function(varName, options) {
      return this.primitiveN("doublele", varName, options);
    };
    Parser2.prototype.doublebe = function(varName, options) {
      return this.primitiveN("doublebe", varName, options);
    };
    Parser2.prototype.bitN = function(size, varName, options) {
      if (!options) {
        options = {};
      }
      options.length = size;
      return this.setNextParser("bit", varName, options);
    };
    Parser2.prototype.bit1 = function(varName, options) {
      return this.bitN(1, varName, options);
    };
    Parser2.prototype.bit2 = function(varName, options) {
      return this.bitN(2, varName, options);
    };
    Parser2.prototype.bit3 = function(varName, options) {
      return this.bitN(3, varName, options);
    };
    Parser2.prototype.bit4 = function(varName, options) {
      return this.bitN(4, varName, options);
    };
    Parser2.prototype.bit5 = function(varName, options) {
      return this.bitN(5, varName, options);
    };
    Parser2.prototype.bit6 = function(varName, options) {
      return this.bitN(6, varName, options);
    };
    Parser2.prototype.bit7 = function(varName, options) {
      return this.bitN(7, varName, options);
    };
    Parser2.prototype.bit8 = function(varName, options) {
      return this.bitN(8, varName, options);
    };
    Parser2.prototype.bit9 = function(varName, options) {
      return this.bitN(9, varName, options);
    };
    Parser2.prototype.bit10 = function(varName, options) {
      return this.bitN(10, varName, options);
    };
    Parser2.prototype.bit11 = function(varName, options) {
      return this.bitN(11, varName, options);
    };
    Parser2.prototype.bit12 = function(varName, options) {
      return this.bitN(12, varName, options);
    };
    Parser2.prototype.bit13 = function(varName, options) {
      return this.bitN(13, varName, options);
    };
    Parser2.prototype.bit14 = function(varName, options) {
      return this.bitN(14, varName, options);
    };
    Parser2.prototype.bit15 = function(varName, options) {
      return this.bitN(15, varName, options);
    };
    Parser2.prototype.bit16 = function(varName, options) {
      return this.bitN(16, varName, options);
    };
    Parser2.prototype.bit17 = function(varName, options) {
      return this.bitN(17, varName, options);
    };
    Parser2.prototype.bit18 = function(varName, options) {
      return this.bitN(18, varName, options);
    };
    Parser2.prototype.bit19 = function(varName, options) {
      return this.bitN(19, varName, options);
    };
    Parser2.prototype.bit20 = function(varName, options) {
      return this.bitN(20, varName, options);
    };
    Parser2.prototype.bit21 = function(varName, options) {
      return this.bitN(21, varName, options);
    };
    Parser2.prototype.bit22 = function(varName, options) {
      return this.bitN(22, varName, options);
    };
    Parser2.prototype.bit23 = function(varName, options) {
      return this.bitN(23, varName, options);
    };
    Parser2.prototype.bit24 = function(varName, options) {
      return this.bitN(24, varName, options);
    };
    Parser2.prototype.bit25 = function(varName, options) {
      return this.bitN(25, varName, options);
    };
    Parser2.prototype.bit26 = function(varName, options) {
      return this.bitN(26, varName, options);
    };
    Parser2.prototype.bit27 = function(varName, options) {
      return this.bitN(27, varName, options);
    };
    Parser2.prototype.bit28 = function(varName, options) {
      return this.bitN(28, varName, options);
    };
    Parser2.prototype.bit29 = function(varName, options) {
      return this.bitN(29, varName, options);
    };
    Parser2.prototype.bit30 = function(varName, options) {
      return this.bitN(30, varName, options);
    };
    Parser2.prototype.bit31 = function(varName, options) {
      return this.bitN(31, varName, options);
    };
    Parser2.prototype.bit32 = function(varName, options) {
      return this.bitN(32, varName, options);
    };
    Parser2.prototype.namely = function(alias) {
      aliasRegistry[alias] = this;
      this.alias = alias;
      return this;
    };
    Parser2.prototype.skip = function(length, options) {
      return this.seek(length, options);
    };
    Parser2.prototype.seek = function(relOffset, options) {
      if (options && options.assert) {
        throw new Error("assert option on seek is not allowed.");
      }
      return this.setNextParser("seek", "", { length: relOffset });
    };
    Parser2.prototype.string = function(varName, options) {
      if (!options.zeroTerminated && !options.length && !options.greedy) {
        throw new Error("Neither length, zeroTerminated, nor greedy is defined for string.");
      }
      if ((options.zeroTerminated || options.length) && options.greedy) {
        throw new Error("greedy is mutually exclusive with length and zeroTerminated for string.");
      }
      if (options.stripNull && !(options.length || options.greedy)) {
        throw new Error("Length or greedy must be defined if stripNull is defined.");
      }
      options.encoding = options.encoding || "utf8";
      return this.setNextParser("string", varName, options);
    };
    Parser2.prototype.buffer = function(varName, options) {
      if (!options.length && !options.readUntil) {
        throw new Error("Length nor readUntil is defined in buffer parser");
      }
      return this.setNextParser("buffer", varName, options);
    };
    Parser2.prototype.wrapped = function(varName, options) {
      if (!options.length && !options.readUntil) {
        throw new Error("Length nor readUntil is defined in buffer parser");
      }
      if (!options.wrapper || !options.type) {
        throw new Error("Both wrapper and type must be defined in wrapper parser");
      }
      return this.setNextParser("wrapper", varName, options);
    };
    Parser2.prototype.array = function(varName, options) {
      if (!options.readUntil && !options.length && !options.lengthInBytes) {
        throw new Error("Length option of array is not defined.");
      }
      if (!options.type) {
        throw new Error("Type option of array is not defined.");
      }
      if (typeof options.type === "string" && !aliasRegistry[options.type] && Object.keys(PRIMITIVE_SIZES).indexOf(options.type) < 0) {
        throw new Error('Specified primitive type "' + options.type + '" is not supported.');
      }
      return this.setNextParser("array", varName, options);
    };
    Parser2.prototype.choice = function(varName, options) {
      if (typeof options !== "object" && typeof varName === "object") {
        options = varName;
        varName = null;
      }
      if (!options.tag) {
        throw new Error("Tag option of array is not defined.");
      }
      if (!options.choices) {
        throw new Error("Choices option of array is not defined.");
      }
      Object.keys(options.choices).forEach(function(keyString) {
        var key = parseInt(keyString, 10);
        var value = options.choices[key];
        if (isNaN(key)) {
          throw new Error("Key of choices must be a number.");
        }
        if (!value) {
          throw new Error("Choice Case " + keyString + " of " + varName + " is not valid.");
        }
        if (typeof value === "string" && !aliasRegistry[value] && Object.keys(PRIMITIVE_SIZES).indexOf(value) < 0) {
          throw new Error('Specified primitive type "' + value + '" is not supported.');
        }
      });
      return this.setNextParser("choice", varName, options);
    };
    Parser2.prototype.nest = function(varName, options) {
      if (typeof options !== "object" && typeof varName === "object") {
        options = varName;
        varName = null;
      }
      if (!options.type) {
        throw new Error("Type option of nest is not defined.");
      }
      if (!(options.type instanceof Parser2) && !aliasRegistry[options.type]) {
        throw new Error("Type option of nest must be a Parser object.");
      }
      if (!(options.type instanceof Parser2) && !varName) {
        throw new Error("options.type must be a object if variable name is omitted.");
      }
      return this.setNextParser("nest", varName, options);
    };
    Parser2.prototype.pointer = function(varName, options) {
      if (!options.offset) {
        throw new Error("Offset option of pointer is not defined.");
      }
      if (!options.type) {
        throw new Error("Type option of pointer is not defined.");
      } else if (typeof options.type === "string") {
        if (Object.keys(PRIMITIVE_SIZES).indexOf(options.type) < 0 && !aliasRegistry[options.type]) {
          throw new Error('Specified type "' + options.type + '" is not supported.');
        }
      } else if (options.type instanceof Parser2) ;
      else {
        throw new Error("Type option of pointer must be a string or a Parser object.");
      }
      return this.setNextParser("pointer", varName, options);
    };
    Parser2.prototype.saveOffset = function(varName, options) {
      return this.setNextParser("saveOffset", varName, options);
    };
    Parser2.prototype.endianess = function(endianess) {
      switch (endianess.toLowerCase()) {
        case "little":
          this.endian = "le";
          break;
        case "big":
          this.endian = "be";
          break;
        default:
          throw new Error("Invalid endianess: " + endianess);
      }
      return this;
    };
    Parser2.prototype.create = function(constructorFn) {
      if (!(constructorFn instanceof Function)) {
        throw new Error("Constructor must be a Function object.");
      }
      this.constructorFn = constructorFn;
      return this;
    };
    Parser2.prototype.getContext = function(importPath) {
      var ctx = new context_1.Context(importPath);
      ctx.pushCode("var dataView = new DataView(buffer.buffer, buffer.byteOffset, buffer.length);");
      if (!this.alias) {
        this.addRawCode(ctx);
      } else {
        this.addAliasedCode(ctx);
        ctx.pushCode("return " + (FUNCTION_PREFIX + this.alias) + "(0).result;");
      }
      return ctx;
    };
    Parser2.prototype.getCode = function() {
      return this.getContext().code;
    };
    Parser2.prototype.addRawCode = function(ctx) {
      ctx.pushCode("var offset = 0;");
      ctx.pushCode("var vars = " + (this.constructorFn ? "new constructorFn()" : "{}") + ";");
      ctx.pushCode("vars.$parent = null;");
      ctx.pushCode("vars.$root = vars;");
      this.generate(ctx);
      this.resolveReferences(ctx);
      ctx.pushCode("delete vars.$parent;");
      ctx.pushCode("delete vars.$root;");
      ctx.pushCode("return vars;");
    };
    Parser2.prototype.addAliasedCode = function(ctx) {
      ctx.pushCode("function " + (FUNCTION_PREFIX + this.alias) + "(offset, context) {");
      ctx.pushCode("var vars = " + (this.constructorFn ? "new constructorFn()" : "{}") + ";");
      ctx.pushCode("var ctx = Object.assign({$parent: null, $root: vars}, context || {});");
      ctx.pushCode("vars = Object.assign(vars, ctx);");
      this.generate(ctx);
      ctx.markResolved(this.alias);
      this.resolveReferences(ctx);
      ctx.pushCode("Object.keys(ctx).forEach(function (item) { delete vars[item]; });");
      ctx.pushCode("return { offset: offset, result: vars };");
      ctx.pushCode("}");
      return ctx;
    };
    Parser2.prototype.resolveReferences = function(ctx) {
      var references = ctx.getUnresolvedReferences();
      ctx.markRequested(references);
      references.forEach(function(alias) {
        var parser = aliasRegistry[alias];
        parser.addAliasedCode(ctx);
      });
    };
    Parser2.prototype.compile = function() {
      var importPath = "imports";
      var ctx = this.getContext(importPath);
      this.compiled = new Function(importPath, "TextDecoder", "return function (buffer, constructorFn) { " + ctx.code + " };")(ctx.imports, TextDecoder);
    };
    Parser2.prototype.sizeOf = function() {
      var size = NaN;
      if (Object.keys(PRIMITIVE_SIZES).indexOf(this.type) >= 0) {
        size = PRIMITIVE_SIZES[this.type];
      } else if (this.type === "string" && typeof this.options.length === "number") {
        size = this.options.length;
      } else if (this.type === "buffer" && typeof this.options.length === "number") {
        size = this.options.length;
      } else if (this.type === "array" && typeof this.options.length === "number") {
        var elementSize = NaN;
        if (typeof this.options.type === "string") {
          elementSize = PRIMITIVE_SIZES[this.options.type];
        } else if (this.options.type instanceof Parser2) {
          elementSize = this.options.type.sizeOf();
        }
        size = this.options.length * elementSize;
      } else if (this.type === "seek") {
        size = this.options.length;
      } else if (this.type === "nest") {
        size = this.options.type.sizeOf();
      } else if (!this.type) {
        size = 0;
      }
      if (this.next) {
        size += this.next.sizeOf();
      }
      return size;
    };
    Parser2.prototype.parse = function(buffer) {
      if (!this.compiled) {
        this.compile();
      }
      return this.compiled(buffer, this.constructorFn);
    };
    Parser2.prototype.setNextParser = function(type, varName, options) {
      var parser = new Parser2();
      parser.type = type;
      parser.varName = varName;
      parser.options = options || parser.options;
      parser.endian = this.endian;
      if (this.head) {
        this.head.next = parser;
      } else {
        this.next = parser;
      }
      this.head = parser;
      return this;
    };
    Parser2.prototype.generate = function(ctx) {
      if (this.type) {
        switch (this.type) {
          case "uint8":
          case "uint16le":
          case "uint16be":
          case "uint32le":
          case "uint32be":
          case "int8":
          case "int16le":
          case "int16be":
          case "int32le":
          case "int32be":
          case "int64be":
          case "int64le":
          case "uint64be":
          case "uint64le":
          case "floatle":
          case "floatbe":
          case "doublele":
          case "doublebe":
            this.primitiveGenerateN(this.type, ctx);
            break;
          case "bit":
            this.generateBit(ctx);
            break;
          case "string":
            this.generateString(ctx);
            break;
          case "buffer":
            this.generateBuffer(ctx);
            break;
          case "seek":
            this.generateSeek(ctx);
            break;
          case "nest":
            this.generateNest(ctx);
            break;
          case "array":
            this.generateArray(ctx);
            break;
          case "choice":
            this.generateChoice(ctx);
            break;
          case "pointer":
            this.generatePointer(ctx);
            break;
          case "saveOffset":
            this.generateSaveOffset(ctx);
            break;
          case "wrapper":
            this.generateWrapper(ctx);
            break;
        }
        this.generateAssert(ctx);
      }
      var varName = ctx.generateVariable(this.varName);
      if (this.options.formatter) {
        this.generateFormatter(ctx, varName, this.options.formatter);
      }
      return this.generateNext(ctx);
    };
    Parser2.prototype.generateAssert = function(ctx) {
      if (!this.options.assert) {
        return;
      }
      var varName = ctx.generateVariable(this.varName);
      switch (typeof this.options.assert) {
        case "function":
          var func = ctx.addImport(this.options.assert);
          ctx.pushCode("if (!" + func + ".call(vars, " + varName + ")) {");
          break;
        case "number":
          ctx.pushCode("if (" + this.options.assert + " !== " + varName + ") {");
          break;
        case "string":
          ctx.pushCode('if ("' + this.options.assert + '" !== ' + varName + ") {");
          break;
        default:
          throw new Error("Assert option supports only strings, numbers and assert functions.");
      }
      ctx.generateError('"Assert error: ' + varName + ' is " + ' + this.options.assert);
      ctx.pushCode("}");
    };
    Parser2.prototype.generateNext = function(ctx) {
      if (this.next) {
        ctx = this.next.generate(ctx);
      }
      return ctx;
    };
    Parser2.prototype.generateBit = function(ctx) {
      var parser = JSON.parse(JSON.stringify(this));
      parser.varName = ctx.generateVariable(parser.varName);
      ctx.bitFields.push(parser);
      if (!this.next || this.next && ["bit", "nest"].indexOf(this.next.type) < 0) {
        var sum_1 = 0;
        ctx.bitFields.forEach(function(parser2) {
          return sum_1 += parser2.options.length;
        });
        var val_1 = ctx.generateTmpVariable();
        if (sum_1 <= 8) {
          ctx.pushCode("var " + val_1 + " = dataView.getUint8(offset);");
          sum_1 = 8;
        } else if (sum_1 <= 16) {
          ctx.pushCode("var " + val_1 + " = dataView.getUint16(offset);");
          sum_1 = 16;
        } else if (sum_1 <= 24) {
          var val1 = ctx.generateTmpVariable();
          var val2 = ctx.generateTmpVariable();
          ctx.pushCode("var " + val1 + " = dataView.getUint16(offset);");
          ctx.pushCode("var " + val2 + " = dataView.getUint8(offset + 2);");
          ctx.pushCode("var " + val_1 + " = (" + val1 + " << 8) | " + val2 + ";");
          sum_1 = 24;
        } else if (sum_1 <= 32) {
          ctx.pushCode("var " + val_1 + " = dataView.getUint32(offset);");
          sum_1 = 32;
        } else {
          throw new Error("Currently, bit field sequence longer than 4-bytes is not supported.");
        }
        ctx.pushCode("offset += " + sum_1 / 8 + ";");
        var bitOffset_1 = 0;
        var isBigEndian_1 = this.endian === "be";
        ctx.bitFields.forEach(function(parser2) {
          var length = parser2.options.length;
          var offset = isBigEndian_1 ? sum_1 - bitOffset_1 - length : bitOffset_1;
          var mask = (1 << length) - 1;
          ctx.pushCode(parser2.varName + " = " + val_1 + " >> " + offset + " & " + mask + ";");
          bitOffset_1 += length;
        });
        ctx.bitFields = [];
      }
    };
    Parser2.prototype.generateSeek = function(ctx) {
      var length = ctx.generateOption(this.options.length);
      ctx.pushCode("offset += " + length + ";");
    };
    Parser2.prototype.generateString = function(ctx) {
      var name = ctx.generateVariable(this.varName);
      var start = ctx.generateTmpVariable();
      var encoding = this.options.encoding;
      var isHex = encoding.toLowerCase() === "hex";
      var toHex = 'b => b.toString(16).padStart(2, "0")';
      if (this.options.length && this.options.zeroTerminated) {
        var len = this.options.length;
        ctx.pushCode("var " + start + " = offset;");
        ctx.pushCode("while(dataView.getUint8(offset++) !== 0 && offset - " + start + " < " + len + ");");
        var end = "offset - " + start + " < " + len + " ? offset - 1 : offset";
        ctx.pushCode(isHex ? name + " = Array.from(buffer.subarray(" + start + ", " + end + "), " + toHex + ").join('');" : name + " = new TextDecoder('" + encoding + "').decode(buffer.subarray(" + start + ", " + end + "));");
      } else if (this.options.length) {
        var len = ctx.generateOption(this.options.length);
        ctx.pushCode(isHex ? name + " = Array.from(buffer.subarray(offset, offset + " + len + "), " + toHex + ").join('');" : name + " = new TextDecoder('" + encoding + "').decode(buffer.subarray(offset, offset + " + len + "));");
        ctx.pushCode("offset += " + len + ";");
      } else if (this.options.zeroTerminated) {
        ctx.pushCode("var " + start + " = offset;");
        ctx.pushCode("while(dataView.getUint8(offset++) !== 0);");
        ctx.pushCode(isHex ? name + " = Array.from(buffer.subarray(" + start + ", offset - 1), " + toHex + ").join('');" : name + " = new TextDecoder('" + encoding + "').decode(buffer.subarray(" + start + ", offset - 1));");
      } else if (this.options.greedy) {
        ctx.pushCode("var " + start + " = offset;");
        ctx.pushCode("while(buffer.length > offset++);");
        ctx.pushCode(isHex ? name + " = Array.from(buffer.subarray(" + start + ", offset), " + toHex + ").join('');" : name + " = new TextDecoder('" + encoding + "').decode(buffer.subarray(" + start + ", offset));");
      }
      if (this.options.stripNull) {
        ctx.pushCode(name + " = " + name + ".replace(/\\x00+$/g, '')");
      }
    };
    Parser2.prototype.generateBuffer = function(ctx) {
      var varName = ctx.generateVariable(this.varName);
      if (typeof this.options.readUntil === "function") {
        var pred = this.options.readUntil;
        var start = ctx.generateTmpVariable();
        var cur = ctx.generateTmpVariable();
        ctx.pushCode("var " + start + " = offset;");
        ctx.pushCode("var " + cur + " = 0;");
        ctx.pushCode("while (offset < buffer.length) {");
        ctx.pushCode(cur + " = dataView.getUint8(offset);");
        var func = ctx.addImport(pred);
        ctx.pushCode("if (" + func + ".call(" + ctx.generateVariable() + ", " + cur + ", buffer.subarray(offset))) break;");
        ctx.pushCode("offset += 1;");
        ctx.pushCode("}");
        ctx.pushCode(varName + " = buffer.subarray(" + start + ", offset);");
      } else if (this.options.readUntil === "eof") {
        ctx.pushCode(varName + " = buffer.subarray(offset);");
      } else {
        var len = ctx.generateOption(this.options.length);
        ctx.pushCode(varName + " = buffer.subarray(offset, offset + " + len + ");");
        ctx.pushCode("offset += " + len + ";");
      }
      if (this.options.clone) {
        ctx.pushCode(varName + " = buffer.constructor.from(" + varName + ");");
      }
    };
    Parser2.prototype.generateArray = function(ctx) {
      var length = ctx.generateOption(this.options.length);
      var lengthInBytes = ctx.generateOption(this.options.lengthInBytes);
      var type = this.options.type;
      var counter = ctx.generateTmpVariable();
      var lhs = ctx.generateVariable(this.varName);
      var item = ctx.generateTmpVariable();
      var key = this.options.key;
      var isHash = typeof key === "string";
      if (isHash) {
        ctx.pushCode(lhs + " = {};");
      } else {
        ctx.pushCode(lhs + " = [];");
      }
      if (typeof this.options.readUntil === "function") {
        ctx.pushCode("do {");
      } else if (this.options.readUntil === "eof") {
        ctx.pushCode("for (var " + counter + " = 0; offset < buffer.length; " + counter + "++) {");
      } else if (lengthInBytes !== void 0) {
        ctx.pushCode("for (var " + counter + " = offset + " + lengthInBytes + "; offset < " + counter + "; ) {");
      } else {
        ctx.pushCode("for (var " + counter + " = " + length + "; " + counter + " > 0; " + counter + "--) {");
      }
      if (typeof type === "string") {
        if (!aliasRegistry[type]) {
          var typeName = PRIMITIVE_NAMES[type];
          var littleEndian = PRIMITIVE_LITTLE_ENDIANS[type];
          ctx.pushCode("var " + item + " = dataView.get" + typeName + "(offset, " + littleEndian + ");");
          ctx.pushCode("offset += " + PRIMITIVE_SIZES[type] + ";");
        } else {
          var parentVar = ctx.generateVariable();
          var tempVar = ctx.generateTmpVariable();
          ctx.pushCode("var " + tempVar + " = " + (FUNCTION_PREFIX + type) + "(offset, {");
          ctx.pushCode("$parent: " + parentVar + ",");
          ctx.pushCode("$root: " + parentVar + ".$root,");
          if (!this.options.readUntil && lengthInBytes === void 0) {
            ctx.pushCode("$index: " + length + " - " + counter + ",");
          }
          ctx.pushCode("});");
          ctx.pushCode("var " + item + " = " + tempVar + ".result; offset = " + tempVar + ".offset;");
          if (type !== this.alias)
            ctx.addReference(type);
        }
      } else if (type instanceof Parser2) {
        var parentVar = ctx.generateVariable();
        ctx.pushCode("var " + item + " = {};");
        ctx.pushScope(item);
        ctx.pushCode(item + ".$parent = " + parentVar + ";");
        ctx.pushCode(item + ".$root = " + parentVar + ".$root;");
        if (!this.options.readUntil && lengthInBytes === void 0) {
          ctx.pushCode(item + ".$index = " + length + " - " + counter + ";");
        }
        type.generate(ctx);
        ctx.pushCode("delete " + item + ".$parent;");
        ctx.pushCode("delete " + item + ".$root;");
        ctx.pushCode("delete " + item + ".$index;");
        ctx.popScope();
      }
      if (isHash) {
        ctx.pushCode(lhs + "[" + item + "." + key + "] = " + item + ";");
      } else {
        ctx.pushCode(lhs + ".push(" + item + ");");
      }
      ctx.pushCode("}");
      if (typeof this.options.readUntil === "function") {
        var pred = this.options.readUntil;
        var func = ctx.addImport(pred);
        ctx.pushCode("while (!" + func + ".call(" + ctx.generateVariable() + ", " + item + ", buffer.subarray(offset)));");
      }
    };
    Parser2.prototype.generateChoiceCase = function(ctx, varName, type) {
      if (typeof type === "string") {
        var varName_1 = ctx.generateVariable(this.varName);
        if (!aliasRegistry[type]) {
          var typeName = PRIMITIVE_NAMES[type];
          var littleEndian = PRIMITIVE_LITTLE_ENDIANS[type];
          ctx.pushCode(varName_1 + " = dataView.get" + typeName + "(offset, " + littleEndian + ");");
          ctx.pushCode("offset += " + PRIMITIVE_SIZES[type]);
        } else {
          var tempVar = ctx.generateTmpVariable();
          ctx.pushCode("var " + tempVar + " = " + (FUNCTION_PREFIX + type) + "(offset, {");
          ctx.pushCode("$parent: " + varName_1 + ".$parent,");
          ctx.pushCode("$root: " + varName_1 + ".$root,");
          ctx.pushCode("});");
          ctx.pushCode(varName_1 + " = " + tempVar + ".result; offset = " + tempVar + ".offset;");
          if (type !== this.alias)
            ctx.addReference(type);
        }
      } else if (type instanceof Parser2) {
        ctx.pushPath(varName);
        type.generate(ctx);
        ctx.popPath(varName);
      }
    };
    Parser2.prototype.generateChoice = function(ctx) {
      var _this = this;
      var tag = ctx.generateOption(this.options.tag);
      var nestVar = ctx.generateVariable(this.varName);
      if (this.varName) {
        ctx.pushCode(nestVar + " = {};");
        var parentVar = ctx.generateVariable();
        ctx.pushCode(nestVar + ".$parent = " + parentVar + ";");
        ctx.pushCode(nestVar + ".$root = " + parentVar + ".$root;");
      }
      ctx.pushCode("switch(" + tag + ") {");
      Object.keys(this.options.choices).forEach(function(tag2) {
        var type = _this.options.choices[parseInt(tag2, 10)];
        ctx.pushCode("case " + tag2 + ":");
        _this.generateChoiceCase(ctx, _this.varName, type);
        ctx.pushCode("break;");
      });
      ctx.pushCode("default:");
      if (this.options.defaultChoice) {
        this.generateChoiceCase(ctx, this.varName, this.options.defaultChoice);
      } else {
        ctx.generateError('"Met undefined tag value " + ' + tag + ' + " at choice"');
      }
      ctx.pushCode("}");
      if (this.varName) {
        ctx.pushCode("delete " + nestVar + ".$parent;");
        ctx.pushCode("delete " + nestVar + ".$root;");
      }
    };
    Parser2.prototype.generateNest = function(ctx) {
      var nestVar = ctx.generateVariable(this.varName);
      if (this.options.type instanceof Parser2) {
        if (this.varName) {
          var parentVar = ctx.generateVariable();
          ctx.pushCode(nestVar + " = {};");
          ctx.pushCode(nestVar + ".$parent = " + parentVar + ";");
          ctx.pushCode(nestVar + ".$root = " + parentVar + ".$root;");
        }
        ctx.pushPath(this.varName);
        this.options.type.generate(ctx);
        ctx.popPath(this.varName);
        if (this.varName) {
          ctx.pushCode("delete " + nestVar + ".$parent;");
          ctx.pushCode("delete " + nestVar + ".$root;");
        }
      } else if (aliasRegistry[this.options.type]) {
        var parentVar = ctx.generateVariable();
        var tempVar = ctx.generateTmpVariable();
        ctx.pushCode("var " + tempVar + " = " + (FUNCTION_PREFIX + this.options.type) + "(offset, {");
        ctx.pushCode("$parent: " + parentVar + ",");
        ctx.pushCode("$root: " + parentVar + ".$root,");
        ctx.pushCode("});");
        ctx.pushCode(nestVar + " = " + tempVar + ".result; offset = " + tempVar + ".offset;");
        if (this.options.type !== this.alias)
          ctx.addReference(this.options.type);
      }
    };
    Parser2.prototype.generateWrapper = function(ctx) {
      var wrapperVar = ctx.generateVariable(this.varName);
      var wrappedBuf = ctx.generateTmpVariable();
      if (typeof this.options.readUntil === "function") {
        var pred = this.options.readUntil;
        var start = ctx.generateTmpVariable();
        var cur = ctx.generateTmpVariable();
        ctx.pushCode("var " + start + " = offset;");
        ctx.pushCode("var " + cur + " = 0;");
        ctx.pushCode("while (offset < buffer.length) {");
        ctx.pushCode(cur + " = dataView.getUint8(offset);");
        var func_1 = ctx.addImport(pred);
        ctx.pushCode("if (" + func_1 + ".call(" + ctx.generateVariable() + ", " + cur + ", buffer.subarray(offset))) break;");
        ctx.pushCode("offset += 1;");
        ctx.pushCode("}");
        ctx.pushCode(wrappedBuf + " = buffer.subarray(" + start + ", offset);");
      } else if (this.options.readUntil === "eof") {
        ctx.pushCode(wrappedBuf + " = buffer.subarray(offset);");
      } else {
        var len = ctx.generateOption(this.options.length);
        ctx.pushCode(wrappedBuf + " = buffer.subarray(offset, offset + " + len + ");");
        ctx.pushCode("offset += " + len + ";");
      }
      if (this.options.clone) {
        ctx.pushCode(wrappedBuf + " = buffer.constructor.from(" + wrappedBuf + ");");
      }
      var tempBuf = ctx.generateTmpVariable();
      var tempOff = ctx.generateTmpVariable();
      var tempView = ctx.generateTmpVariable();
      var func = ctx.addImport(this.options.wrapper);
      ctx.pushCode(wrappedBuf + " = " + func + ".call(this, " + wrappedBuf + ").subarray(0);");
      ctx.pushCode("var " + tempBuf + " = buffer;");
      ctx.pushCode("var " + tempOff + " = offset;");
      ctx.pushCode("var " + tempView + " = dataView;");
      ctx.pushCode("buffer = " + wrappedBuf + ";");
      ctx.pushCode("offset = 0;");
      ctx.pushCode("dataView = new DataView(buffer.buffer, buffer.byteOffset, buffer.length);");
      if (this.options.type instanceof Parser2) {
        if (this.varName) {
          ctx.pushCode(wrapperVar + " = {};");
        }
        ctx.pushPath(this.varName);
        this.options.type.generate(ctx);
        ctx.popPath(this.varName);
      } else if (aliasRegistry[this.options.type]) {
        var tempVar = ctx.generateTmpVariable();
        ctx.pushCode("var " + tempVar + " = " + (FUNCTION_PREFIX + this.options.type) + "(0);");
        ctx.pushCode(wrapperVar + " = " + tempVar + ".result;");
        if (this.options.type !== this.alias)
          ctx.addReference(this.options.type);
      }
      ctx.pushCode("buffer = " + tempBuf + ";");
      ctx.pushCode("dataView = " + tempView + ";");
      ctx.pushCode("offset = " + tempOff + ";");
    };
    Parser2.prototype.generateFormatter = function(ctx, varName, formatter) {
      if (typeof formatter === "function") {
        var func = ctx.addImport(formatter);
        ctx.pushCode(varName + " = " + func + ".call(" + ctx.generateVariable() + ", " + varName + ");");
      }
    };
    Parser2.prototype.generatePointer = function(ctx) {
      var type = this.options.type;
      var offset = ctx.generateOption(this.options.offset);
      var tempVar = ctx.generateTmpVariable();
      var nestVar = ctx.generateVariable(this.varName);
      ctx.pushCode("var " + tempVar + " = offset;");
      ctx.pushCode("offset = " + offset + ";");
      if (this.options.type instanceof Parser2) {
        var parentVar = ctx.generateVariable();
        ctx.pushCode(nestVar + " = {};");
        ctx.pushCode(nestVar + ".$parent = " + parentVar + ";");
        ctx.pushCode(nestVar + ".$root = " + parentVar + ".$root;");
        ctx.pushPath(this.varName);
        this.options.type.generate(ctx);
        ctx.popPath(this.varName);
        ctx.pushCode("delete " + nestVar + ".$parent;");
        ctx.pushCode("delete " + nestVar + ".$root;");
      } else if (aliasRegistry[this.options.type]) {
        var parentVar = ctx.generateVariable();
        var tempVar_1 = ctx.generateTmpVariable();
        ctx.pushCode("var " + tempVar_1 + " = " + (FUNCTION_PREFIX + this.options.type) + "(offset, {");
        ctx.pushCode("$parent: " + parentVar + ",");
        ctx.pushCode("$root: " + parentVar + ".$root,");
        ctx.pushCode("});");
        ctx.pushCode(nestVar + " = " + tempVar_1 + ".result; offset = " + tempVar_1 + ".offset;");
        if (this.options.type !== this.alias)
          ctx.addReference(this.options.type);
      } else if (Object.keys(PRIMITIVE_SIZES).indexOf(this.options.type) >= 0) {
        var typeName = PRIMITIVE_NAMES[type];
        var littleEndian = PRIMITIVE_LITTLE_ENDIANS[type];
        ctx.pushCode(nestVar + " = dataView.get" + typeName + "(offset, " + littleEndian + ");");
        ctx.pushCode("offset += " + PRIMITIVE_SIZES[type] + ";");
      }
      ctx.pushCode("offset = " + tempVar + ";");
    };
    Parser2.prototype.generateSaveOffset = function(ctx) {
      var varName = ctx.generateVariable(this.varName);
      ctx.pushCode(varName + " = offset");
    };
    return Parser2;
  }()
);
binary_parser.Parser = Parser;
Object.defineProperty(F1Parser$1, "__esModule", { value: true });
F1Parser$1.F1Parser = void 0;
const binary_parser_1$7 = binary_parser;
class F1Parser extends binary_parser_1$7.Parser {
  /**
   *
   * @param {Buffer} buffer
   */
  // tslint:disable-next-line:no-any
  fromBuffer(buffer) {
    return this.parse(buffer);
  }
}
F1Parser$1.F1Parser = F1Parser;
var CarDamageDataParser$1 = {};
Object.defineProperty(CarDamageDataParser$1, "__esModule", { value: true });
CarDamageDataParser$1.CarDamageDataParser = void 0;
const binary_parser_1$6 = binary_parser;
const F1Parser_1$x = F1Parser$1;
class CarDamageDataParser extends F1Parser_1$x.F1Parser {
  constructor(packetFormat) {
    super();
    this.array("m_tyresWear", {
      length: 4,
      type: new binary_parser_1$6.Parser().floatle("")
    }).array("m_tyresDamage", {
      length: 4,
      type: new binary_parser_1$6.Parser().uint8("")
    }).array("m_brakesDamage", {
      length: 4,
      type: new binary_parser_1$6.Parser().uint8("")
    });
    if (packetFormat === 2025) {
      this.array("m_tyreBlisters", {
        length: 4,
        type: new binary_parser_1$6.Parser().uint8("")
      });
    }
    this.uint8("m_frontLeftWingDamage").uint8("m_frontRightWingDamage").uint8("m_rearWingDamage").uint8("m_floorDamage").uint8("m_diffuserDamage").uint8("m_sidepodDamage").uint8("m_drsFault").uint8("m_ersFault").uint8("m_gearBoxDamage").uint8("m_engineDamage").uint8("m_engineMGUHWear").uint8("m_engineESWear").uint8("m_engineCEWear").uint8("m_engineICEWear").uint8("m_engineMGUKWear").uint8("m_engineTCWear").uint8("m_engineBlown").uint8("m_engineSeized");
  }
}
CarDamageDataParser$1.CarDamageDataParser = CarDamageDataParser;
var PacketHeaderParser$1 = {};
Object.defineProperty(PacketHeaderParser$1, "__esModule", { value: true });
PacketHeaderParser$1.PacketHeaderParser = void 0;
const F1Parser_1$w = F1Parser$1;
class PacketHeaderParser extends F1Parser_1$w.F1Parser {
  constructor(packetFormat) {
    super();
    this.endianess("little").uint16le("m_packetFormat");
    if (packetFormat === 2023 || packetFormat === 2024 || packetFormat === 2025) {
      this.uint8("m_gameYear");
    }
    this.uint8("m_gameMajorVersion").uint8("m_gameMinorVersion").uint8("m_packetVersion").uint8("m_packetId").uint64("m_sessionUID").floatle("m_sessionTime").uint32("m_frameIdentifier");
    if (packetFormat === 2023 || packetFormat === 2024 || packetFormat === 2025) {
      this.uint32("m_overallFrameIdentifier");
    }
    this.uint8("m_playerCarIndex").uint8("m_secondaryPlayerCarIndex");
  }
}
PacketHeaderParser$1.PacketHeaderParser = PacketHeaderParser;
Object.defineProperty(PacketCarDamageDataParser$1, "__esModule", { value: true });
PacketCarDamageDataParser$1.PacketCarDamageDataParser = void 0;
const F1Parser_1$v = F1Parser$1;
const CarDamageDataParser_1 = CarDamageDataParser$1;
const PacketHeaderParser_1$f = PacketHeaderParser$1;
class PacketCarDamageDataParser extends F1Parser_1$v.F1Parser {
  constructor(buffer, packetFormat) {
    super();
    __publicField(this, "data");
    this.endianess("little").nest("m_header", {
      type: new PacketHeaderParser_1$f.PacketHeaderParser(packetFormat)
    }).array("m_carDamageData", {
      length: 22,
      type: new CarDamageDataParser_1.CarDamageDataParser(packetFormat)
    });
    this.data = this.fromBuffer(buffer);
  }
}
PacketCarDamageDataParser$1.PacketCarDamageDataParser = PacketCarDamageDataParser;
var PacketCarSetupDataParser$1 = {};
var CarSetupDataParser$1 = {};
Object.defineProperty(CarSetupDataParser$1, "__esModule", { value: true });
CarSetupDataParser$1.CarSetupDataParser = void 0;
const F1Parser_1$u = F1Parser$1;
class CarSetupDataParser extends F1Parser_1$u.F1Parser {
  constructor(packetFormat) {
    super();
    this.uint8("m_frontWing").uint8("m_rearWing").uint8("m_onThrottle").uint8("m_offThrottle").floatle("m_frontCamber").floatle("m_rearCamber").floatle("m_frontToe").floatle("m_rearToe").uint8("m_frontSuspension").uint8("m_rearSuspension").uint8("m_frontAntiRollBar").uint8("m_rearAntiRollBar").uint8("m_frontSuspensionHeight").uint8("m_rearSuspensionHeight").uint8("m_brakePressure").uint8("m_brakeBias");
    if (packetFormat === 2024 || packetFormat === 2025) {
      this.uint8("m_engineBraking");
    }
    this.floatle("m_rearLeftTyrePressure").floatle("m_rearRightTyrePressure").floatle("m_frontLeftTyrePressure").floatle("m_frontRightTyrePressure").uint8("m_ballast").floatle("m_fuelLoad");
  }
}
CarSetupDataParser$1.CarSetupDataParser = CarSetupDataParser;
Object.defineProperty(PacketCarSetupDataParser$1, "__esModule", { value: true });
PacketCarSetupDataParser$1.PacketCarSetupDataParser = void 0;
const F1Parser_1$t = F1Parser$1;
const CarSetupDataParser_1 = CarSetupDataParser$1;
const PacketHeaderParser_1$e = PacketHeaderParser$1;
class PacketCarSetupDataParser extends F1Parser_1$t.F1Parser {
  constructor(buffer, packetFormat) {
    super();
    __publicField(this, "data");
    this.endianess("little").nest("m_header", {
      type: new PacketHeaderParser_1$e.PacketHeaderParser(packetFormat)
    }).array("m_carSetups", {
      length: 22,
      type: new CarSetupDataParser_1.CarSetupDataParser(packetFormat)
    });
    if (packetFormat === 2024 || packetFormat === 2025) {
      this.floatle("m_nextFrontWingValue");
    }
    this.data = this.fromBuffer(buffer);
  }
}
PacketCarSetupDataParser$1.PacketCarSetupDataParser = PacketCarSetupDataParser;
var PacketCarStatusDataParser$1 = {};
var CarStatusDataParser$1 = {};
Object.defineProperty(CarStatusDataParser$1, "__esModule", { value: true });
CarStatusDataParser$1.CarStatusDataParser = void 0;
const F1Parser_1$s = F1Parser$1;
class CarStatusDataParser extends F1Parser_1$s.F1Parser {
  constructor(packetFormat) {
    super();
    this.uint8("m_tractionControl").uint8("m_antiLockBrakes").uint8("m_fuelMix").uint8("m_frontBrakeBias").uint8("m_pitLimiterStatus").floatle("m_fuelInTank").floatle("m_fuelCapacity").floatle("m_fuelRemainingLaps").uint16le("m_maxRPM").uint16le("m_idleRPM").uint8("m_maxGears").uint8("m_drsAllowed").uint16le("m_drsActivationDistance").uint8("m_actualTyreCompound").uint8("m_visualTyreCompound").uint8("m_tyresAgeLaps");
    if (packetFormat === 2023 || packetFormat === 2024 || packetFormat === 2025) {
      this.int8("m_vehicleFiaFlags").floatle("m_enginePowerICE").floatle("m_enginePowerMGUK");
    } else {
      this.int8("m_vehicleFiaFlags");
    }
    this.floatle("m_ersStoreEnergy").uint8("m_ersDeployMode").floatle("m_ersHarvestedThisLapMGUK").floatle("m_ersHarvestedThisLapMGUH").floatle("m_ersDeployedThisLap").uint8("m_networkPaused");
  }
}
CarStatusDataParser$1.CarStatusDataParser = CarStatusDataParser;
Object.defineProperty(PacketCarStatusDataParser$1, "__esModule", { value: true });
PacketCarStatusDataParser$1.PacketCarStatusDataParser = void 0;
const F1Parser_1$r = F1Parser$1;
const CarStatusDataParser_1 = CarStatusDataParser$1;
const PacketHeaderParser_1$d = PacketHeaderParser$1;
class PacketCarStatusDataParser extends F1Parser_1$r.F1Parser {
  constructor(buffer, packetFormat) {
    super();
    __publicField(this, "data");
    this.endianess("little").nest("m_header", {
      type: new PacketHeaderParser_1$d.PacketHeaderParser(packetFormat)
    }).array("m_carStatusData", {
      length: 22,
      type: new CarStatusDataParser_1.CarStatusDataParser(packetFormat)
    });
    this.data = this.fromBuffer(buffer);
  }
}
PacketCarStatusDataParser$1.PacketCarStatusDataParser = PacketCarStatusDataParser;
var PacketCarTelemetryDataParser$1 = {};
var CarTelemetryDataParser$1 = {};
Object.defineProperty(CarTelemetryDataParser$1, "__esModule", { value: true });
CarTelemetryDataParser$1.CarTelemetryDataParser = void 0;
const binary_parser_1$5 = binary_parser;
const F1Parser_1$q = F1Parser$1;
class CarTelemetryDataParser extends F1Parser_1$q.F1Parser {
  constructor() {
    super();
    this.uint16le("m_speed").floatle("m_throttle").floatle("m_steer").floatle("m_brake").uint8("m_clutch").int8("m_gear").uint16le("m_engineRPM").uint8("m_drs").uint8("m_revLightsPercent").uint16le("m_revLightsBitValue").array("m_brakesTemperature", {
      length: 4,
      type: new binary_parser_1$5.Parser().uint16le("")
    }).array("m_tyresSurfaceTemperature", {
      length: 4,
      type: new binary_parser_1$5.Parser().uint8("")
    }).array("m_tyresInnerTemperature", {
      length: 4,
      type: new binary_parser_1$5.Parser().uint8("")
    }).uint16le("m_engineTemperature").array("m_tyresPressure", {
      length: 4,
      type: new binary_parser_1$5.Parser().floatle("")
    }).array("m_surfaceType", {
      length: 4,
      type: new binary_parser_1$5.Parser().uint8("")
    });
  }
}
CarTelemetryDataParser$1.CarTelemetryDataParser = CarTelemetryDataParser;
Object.defineProperty(PacketCarTelemetryDataParser$1, "__esModule", { value: true });
PacketCarTelemetryDataParser$1.PacketCarTelemetryDataParser = void 0;
const F1Parser_1$p = F1Parser$1;
const CarTelemetryDataParser_1 = CarTelemetryDataParser$1;
const PacketHeaderParser_1$c = PacketHeaderParser$1;
class PacketCarTelemetryDataParser extends F1Parser_1$p.F1Parser {
  constructor(buffer, packetFormat) {
    super();
    __publicField(this, "data");
    this.endianess("little").nest("m_header", {
      type: new PacketHeaderParser_1$c.PacketHeaderParser(packetFormat)
    }).array("m_carTelemetryData", {
      length: 22,
      type: new CarTelemetryDataParser_1.CarTelemetryDataParser()
    });
    this.uint8("m_mfdPanelIndex").uint8("m_mfdPanelIndexSecondaryPlayer").int8("m_suggestedGear");
    this.data = this.fromBuffer(buffer);
  }
}
PacketCarTelemetryDataParser$1.PacketCarTelemetryDataParser = PacketCarTelemetryDataParser;
var PacketEventDataParser$1 = {};
Object.defineProperty(PacketEventDataParser$1, "__esModule", { value: true });
PacketEventDataParser$1.PacketEventDataParser = PacketEventDataParser$1.CollisionParser = PacketEventDataParser$1.SafetyCarParser = PacketEventDataParser$1.OvertakeParser = PacketEventDataParser$1.ButtonsParser = PacketEventDataParser$1.FlashbackParser = PacketEventDataParser$1.StopGoPenaltyServedParser2025 = PacketEventDataParser$1.StopGoPenaltyServedParser = PacketEventDataParser$1.DriveThroughPenaltyServedParser = PacketEventDataParser$1.StartLightsParser = PacketEventDataParser$1.SpeedTrapParser = PacketEventDataParser$1.PenaltyParser = PacketEventDataParser$1.RaceWinnerParser = PacketEventDataParser$1.TeamMateInPitsParser = PacketEventDataParser$1.DRSDisabledParser = PacketEventDataParser$1.RetirementParser2025 = PacketEventDataParser$1.RetirementParser = PacketEventDataParser$1.FastestLapParser = void 0;
const binary_parser_1$4 = binary_parser;
const constants_1$1 = constants$1;
const F1Parser_1$o = F1Parser$1;
const PacketHeaderParser_1$b = PacketHeaderParser$1;
class FastestLapParser extends F1Parser_1$o.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("vehicleIdx").floatle("lapTime");
  }
}
PacketEventDataParser$1.FastestLapParser = FastestLapParser;
class RetirementParser extends F1Parser_1$o.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("vehicleIdx");
  }
}
PacketEventDataParser$1.RetirementParser = RetirementParser;
class RetirementParser2025 extends F1Parser_1$o.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("vehicleIdx").uint8("reason");
  }
}
PacketEventDataParser$1.RetirementParser2025 = RetirementParser2025;
class DRSDisabledParser extends F1Parser_1$o.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("reason");
  }
}
PacketEventDataParser$1.DRSDisabledParser = DRSDisabledParser;
class TeamMateInPitsParser extends F1Parser_1$o.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("vehicleIdx");
  }
}
PacketEventDataParser$1.TeamMateInPitsParser = TeamMateInPitsParser;
class RaceWinnerParser extends F1Parser_1$o.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("vehicleIdx");
  }
}
PacketEventDataParser$1.RaceWinnerParser = RaceWinnerParser;
class PenaltyParser extends F1Parser_1$o.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("penaltyType").uint8("infringementType").uint8("vehicleIdx").uint8("otherVehicleIdx").uint8("time").uint8("lapNum").uint8("placesGained");
  }
}
PacketEventDataParser$1.PenaltyParser = PenaltyParser;
class SpeedTrapParser extends F1Parser_1$o.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("vehicleIdx").floatle("speed").uint8("isOverallFastestInSession").uint8("isDriverFastestInSession").uint8("fastestVehicleIdxInSession").floatle("fastestSpeedInSession");
  }
}
PacketEventDataParser$1.SpeedTrapParser = SpeedTrapParser;
class StartLightsParser extends F1Parser_1$o.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("numLights");
  }
}
PacketEventDataParser$1.StartLightsParser = StartLightsParser;
class DriveThroughPenaltyServedParser extends F1Parser_1$o.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("vehicleIdx");
  }
}
PacketEventDataParser$1.DriveThroughPenaltyServedParser = DriveThroughPenaltyServedParser;
class StopGoPenaltyServedParser extends F1Parser_1$o.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("vehicleIdx");
  }
}
PacketEventDataParser$1.StopGoPenaltyServedParser = StopGoPenaltyServedParser;
class StopGoPenaltyServedParser2025 extends F1Parser_1$o.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("vehicleIdx").floatle("stopTime");
  }
}
PacketEventDataParser$1.StopGoPenaltyServedParser2025 = StopGoPenaltyServedParser2025;
class FlashbackParser extends F1Parser_1$o.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint32le("flashbackFrameIdentifier").floatle("flashbackSessionTime");
  }
}
PacketEventDataParser$1.FlashbackParser = FlashbackParser;
class ButtonsParser extends F1Parser_1$o.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint32le("buttonStatus");
  }
}
PacketEventDataParser$1.ButtonsParser = ButtonsParser;
class OvertakeParser extends F1Parser_1$o.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("overtakingVehicleIdx").uint8("beingOvertakenVehicleIdx");
  }
}
PacketEventDataParser$1.OvertakeParser = OvertakeParser;
class SafetyCarParser extends F1Parser_1$o.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("safetyCarType").uint8("eventType");
  }
}
PacketEventDataParser$1.SafetyCarParser = SafetyCarParser;
class CollisionParser extends F1Parser_1$o.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("vehicle1Idx").uint8("vehicle2Idx");
  }
}
PacketEventDataParser$1.CollisionParser = CollisionParser;
class PacketEventDataParser extends F1Parser_1$o.F1Parser {
  constructor(buffer, packetFormat) {
    super();
    __publicField(this, "data");
    __publicField(this, "unpack2022Format", (buffer, packetFormat) => {
      const eventStringCode = this.getEventStringCode(buffer, packetFormat);
      if (eventStringCode === constants_1$1.EVENT_CODES.FastestLap) {
        this.nest("m_eventDetails", { type: new FastestLapParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.Retirement) {
        this.nest("m_eventDetails", { type: new RetirementParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.TeammateInPits) {
        this.nest("m_eventDetails", { type: new TeamMateInPitsParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.RaceWinner) {
        this.nest("m_eventDetails", { type: new RaceWinnerParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.PenaltyIssued) {
        this.nest("m_eventDetails", { type: new PenaltyParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.SpeedTrapTriggered) {
        this.nest("m_eventDetails", { type: new SpeedTrapParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.StartLights) {
        this.nest("m_eventDetails", { type: new StartLightsParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.DriveThroughServed) {
        this.nest("m_eventDetails", {
          type: new DriveThroughPenaltyServedParser()
        });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.StopGoServed) {
        this.nest("m_eventDetails", { type: new StopGoPenaltyServedParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.Flashback) {
        this.nest("m_eventDetails", { type: new FlashbackParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.ButtonStatus) {
        this.nest("m_eventDetails", { type: new ButtonsParser() });
      }
    });
    __publicField(this, "unpack2023Format", (buffer, packetFormat) => {
      const eventStringCode = this.getEventStringCode(buffer, packetFormat);
      if (eventStringCode === constants_1$1.EVENT_CODES.FastestLap) {
        this.nest("m_eventDetails", { type: new FastestLapParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.Retirement) {
        this.nest("m_eventDetails", { type: new RetirementParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.TeammateInPits) {
        this.nest("m_eventDetails", { type: new TeamMateInPitsParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.RaceWinner) {
        this.nest("m_eventDetails", { type: new RaceWinnerParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.PenaltyIssued) {
        this.nest("m_eventDetails", { type: new PenaltyParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.SpeedTrapTriggered) {
        this.nest("m_eventDetails", { type: new SpeedTrapParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.StartLights) {
        this.nest("m_eventDetails", { type: new StartLightsParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.DriveThroughServed) {
        this.nest("m_eventDetails", {
          type: new DriveThroughPenaltyServedParser()
        });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.StopGoServed) {
        this.nest("m_eventDetails", { type: new StopGoPenaltyServedParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.Flashback) {
        this.nest("m_eventDetails", { type: new FlashbackParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.ButtonStatus) {
        this.nest("m_eventDetails", { type: new ButtonsParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.Overtake) {
        this.nest("m_eventDetails", { type: new OvertakeParser() });
      }
    });
    __publicField(this, "unpack2024Format", (buffer, packetFormat) => {
      const eventStringCode = this.getEventStringCode(buffer, packetFormat);
      if (eventStringCode === constants_1$1.EVENT_CODES.FastestLap) {
        this.nest("m_eventDetails", { type: new FastestLapParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.Retirement) {
        this.nest("m_eventDetails", { type: new RetirementParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.TeammateInPits) {
        this.nest("m_eventDetails", { type: new TeamMateInPitsParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.RaceWinner) {
        this.nest("m_eventDetails", { type: new RaceWinnerParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.PenaltyIssued) {
        this.nest("m_eventDetails", { type: new PenaltyParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.SpeedTrapTriggered) {
        this.nest("m_eventDetails", { type: new SpeedTrapParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.StartLights) {
        this.nest("m_eventDetails", { type: new StartLightsParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.DriveThroughServed) {
        this.nest("m_eventDetails", {
          type: new DriveThroughPenaltyServedParser()
        });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.StopGoServed) {
        this.nest("m_eventDetails", { type: new StopGoPenaltyServedParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.Flashback) {
        this.nest("m_eventDetails", { type: new FlashbackParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.ButtonStatus) {
        this.nest("m_eventDetails", { type: new ButtonsParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.Overtake) {
        this.nest("m_eventDetails", { type: new OvertakeParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.SafetyCar) {
        this.nest("m_eventDetails", { type: new SafetyCarParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.Collision) {
        this.nest("m_eventDetails", { type: new CollisionParser() });
      }
    });
    __publicField(this, "unpack2025Format", (buffer, packetFormat) => {
      const eventStringCode = this.getEventStringCode(buffer, packetFormat);
      if (eventStringCode === constants_1$1.EVENT_CODES.FastestLap) {
        this.nest("m_eventDetails", { type: new FastestLapParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.Retirement) {
        this.nest("m_eventDetails", { type: new RetirementParser2025() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.DRSDisabled) {
        this.nest("m_eventDetails", { type: new DRSDisabledParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.TeammateInPits) {
        this.nest("m_eventDetails", { type: new TeamMateInPitsParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.RaceWinner) {
        this.nest("m_eventDetails", { type: new RaceWinnerParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.PenaltyIssued) {
        this.nest("m_eventDetails", { type: new PenaltyParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.SpeedTrapTriggered) {
        this.nest("m_eventDetails", { type: new SpeedTrapParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.StartLights) {
        this.nest("m_eventDetails", { type: new StartLightsParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.DriveThroughServed) {
        this.nest("m_eventDetails", {
          type: new DriveThroughPenaltyServedParser()
        });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.StopGoServed) {
        this.nest("m_eventDetails", { type: new StopGoPenaltyServedParser2025() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.Flashback) {
        this.nest("m_eventDetails", { type: new FlashbackParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.ButtonStatus) {
        this.nest("m_eventDetails", { type: new ButtonsParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.Overtake) {
        this.nest("m_eventDetails", { type: new OvertakeParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.SafetyCar) {
        this.nest("m_eventDetails", { type: new SafetyCarParser() });
      } else if (eventStringCode === constants_1$1.EVENT_CODES.Collision) {
        this.nest("m_eventDetails", { type: new CollisionParser() });
      }
    });
    __publicField(this, "getEventStringCode", (buffer, packetFormat) => {
      const headerParser = new binary_parser_1$4.Parser().endianess("little").nest("m_header", {
        type: new PacketHeaderParser_1$b.PacketHeaderParser(packetFormat)
      }).string("m_eventStringCode", { length: 4 });
      const { m_eventStringCode } = headerParser.parse(buffer);
      return m_eventStringCode;
    });
    this.endianess("little").nest("m_header", {
      type: new PacketHeaderParser_1$b.PacketHeaderParser(packetFormat)
    });
    this.string("m_eventStringCode", { length: 4 });
    if (packetFormat === 2022) {
      this.unpack2022Format(buffer, packetFormat);
    }
    if (packetFormat === 2023) {
      this.unpack2023Format(buffer, packetFormat);
    }
    if (packetFormat === 2024) {
      this.unpack2024Format(buffer, packetFormat);
    }
    if (packetFormat === 2025) {
      this.unpack2025Format(buffer, packetFormat);
    }
    this.data = this.fromBuffer(buffer);
  }
}
PacketEventDataParser$1.PacketEventDataParser = PacketEventDataParser;
var PacketFinalClassificationDataParser$1 = {};
var FinalClassificationDataParser$1 = {};
Object.defineProperty(FinalClassificationDataParser$1, "__esModule", { value: true });
FinalClassificationDataParser$1.FinalClassificationDataParser = void 0;
const binary_parser_1$3 = binary_parser;
const F1Parser_1$n = F1Parser$1;
class FinalClassificationDataParser extends F1Parser_1$n.F1Parser {
  constructor(packetFormat) {
    super();
    this.uint8("m_position").uint8("m_numLaps").uint8("m_gridPosition").uint8("m_points").uint8("m_numPitStops").uint8("m_resultStatus");
    if (packetFormat === 2025) {
      this.uint8("m_resultReason");
    }
    this.uint32le("m_bestLapTimeInMS").doublele("m_totalRaceTime").uint8("m_penaltiesTime").uint8("m_numPenalties").uint8("m_numTyreStints").array("m_tyreStintsActual", {
      length: 8,
      type: new binary_parser_1$3.Parser().uint8("")
    }).array("m_tyreStintsVisual", {
      length: 8,
      type: new binary_parser_1$3.Parser().uint8("")
    }).array("m_tyreStintsEndLaps", {
      length: 8,
      type: new binary_parser_1$3.Parser().uint8("")
    });
  }
}
FinalClassificationDataParser$1.FinalClassificationDataParser = FinalClassificationDataParser;
Object.defineProperty(PacketFinalClassificationDataParser$1, "__esModule", { value: true });
PacketFinalClassificationDataParser$1.PacketFinalClassificationDataParser = void 0;
const F1Parser_1$m = F1Parser$1;
const FinalClassificationDataParser_1 = FinalClassificationDataParser$1;
const PacketHeaderParser_1$a = PacketHeaderParser$1;
class PacketFinalClassificationDataParser extends F1Parser_1$m.F1Parser {
  constructor(buffer, packetFormat) {
    super();
    __publicField(this, "data");
    this.endianess("little").nest("m_header", {
      type: new PacketHeaderParser_1$a.PacketHeaderParser(packetFormat)
    }).uint8("m_numCars").array("m_classificationData", {
      length: 22,
      type: new FinalClassificationDataParser_1.FinalClassificationDataParser(packetFormat)
    });
    this.data = this.fromBuffer(buffer);
  }
}
PacketFinalClassificationDataParser$1.PacketFinalClassificationDataParser = PacketFinalClassificationDataParser;
var PacketFormatParser$1 = {};
Object.defineProperty(PacketFormatParser$1, "__esModule", { value: true });
PacketFormatParser$1.PacketFormatParser = void 0;
const F1Parser_1$l = F1Parser$1;
class PacketFormatParser extends F1Parser_1$l.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint16le("m_packetFormat");
  }
}
PacketFormatParser$1.PacketFormatParser = PacketFormatParser;
var PacketLapDataParser$1 = {};
var LapDataParser$1 = {};
Object.defineProperty(LapDataParser$1, "__esModule", { value: true });
LapDataParser$1.LapDataParser = void 0;
const F1Parser_1$k = F1Parser$1;
class LapDataParser extends F1Parser_1$k.F1Parser {
  constructor(packetFormat) {
    super();
    this.endianess("little");
    this.uint32le("m_lastLapTimeInMS").uint32le("m_currentLapTimeInMS");
    if (packetFormat === 2023) {
      this.uint16le("m_sector1TimeInMS").uint8("m_sector1TimeMinutes").uint16le("m_sector2TimeInMS").uint8("m_sector2TimeMinutes").uint16le("m_deltaToCarInFrontInMS").uint16le("m_deltaToRaceLeaderInMS");
    } else if (packetFormat === 2024 || packetFormat === 2025) {
      this.uint16le("m_sector1TimeMSPart").uint8("m_sector1TimeMinutesPart").uint16le("m_sector2TimeMSPart").uint8("m_sector2TimeMinutesPart").uint16le("m_deltaToCarInFrontMSPart").uint8("m_deltaToCarInFrontMinutesPart").uint16le("m_deltaToRaceLeaderMSPart").uint8("m_deltaToRaceLeaderMinutesPart");
    } else {
      this.uint16le("m_sector1TimeInMS").uint16le("m_sector2TimeInMS");
    }
    this.floatle("m_lapDistance").floatle("m_totalDistance").floatle("m_safetyCarDelta").uint8("m_carPosition").uint8("m_currentLapNum").uint8("m_pitStatus").uint8("m_numPitStops").uint8("m_sector").uint8("m_currentLapInvalid").uint8("m_penalties");
    if (packetFormat === 2023 || packetFormat === 2024 || packetFormat === 2025) {
      this.uint8("m_totalWarnings").uint8("m_cornerCuttingWarnings");
    } else {
      this.uint8("m_warnings");
    }
    this.uint8("m_numUnservedDriveThroughPens").uint8("m_numUnservedStopGoPens").uint8("m_gridPosition").uint8("m_driverStatus").uint8("m_resultStatus").uint8("m_pitLaneTimerActive").uint16le("m_pitLaneTimeInLaneInMS").uint16le("m_pitStopTimerInMS").uint8("m_pitStopShouldServePen");
    if (packetFormat === 2024 || packetFormat === 2025) {
      this.floatle("m_speedTrapFastestSpeed").uint8("m_speedTrapFastestLap");
    }
  }
}
LapDataParser$1.LapDataParser = LapDataParser;
Object.defineProperty(PacketLapDataParser$1, "__esModule", { value: true });
PacketLapDataParser$1.PacketLapDataParser = void 0;
const F1Parser_1$j = F1Parser$1;
const LapDataParser_1 = LapDataParser$1;
const PacketHeaderParser_1$9 = PacketHeaderParser$1;
class PacketLapDataParser extends F1Parser_1$j.F1Parser {
  constructor(buffer, packetFormat) {
    super();
    __publicField(this, "data");
    this.endianess("little").nest("m_header", {
      type: new PacketHeaderParser_1$9.PacketHeaderParser(packetFormat)
    }).array("m_lapData", {
      length: 22,
      type: new LapDataParser_1.LapDataParser(packetFormat)
    });
    this.uint8("m_timeTrialPBCarIdx").uint8("m_timeTrialRivalCarIdx");
    this.data = this.fromBuffer(buffer);
  }
}
PacketLapDataParser$1.PacketLapDataParser = PacketLapDataParser;
var PacketLobbyInfoDataParser$1 = {};
var LobbyInfoDataParser$1 = {};
Object.defineProperty(LobbyInfoDataParser$1, "__esModule", { value: true });
LobbyInfoDataParser$1.LobbyInfoDataParser = void 0;
const F1Parser_1$i = F1Parser$1;
class LobbyInfoDataParser extends F1Parser_1$i.F1Parser {
  constructor(packetFormat) {
    super();
    this.uint8("m_aiControlled").uint8("m_teamId").uint8("m_nationality");
    if (packetFormat === 2023 || packetFormat === 2024 || packetFormat === 2025) {
      this.uint8("m_platform");
    }
    if (packetFormat === 2025) {
      this.string("m_name", {
        length: 32,
        stripNull: true
      });
    } else {
      this.string("m_name", {
        length: 48,
        stripNull: true
      });
    }
    this.uint8("m_carNumber");
    if (packetFormat === 2024 || packetFormat === 2025) {
      this.uint8("m_yourTelemetry").uint8("m_showOnlineNames").uint16le("m_techLevel");
    }
    this.uint8("m_readyStatus");
  }
}
LobbyInfoDataParser$1.LobbyInfoDataParser = LobbyInfoDataParser;
Object.defineProperty(PacketLobbyInfoDataParser$1, "__esModule", { value: true });
PacketLobbyInfoDataParser$1.PacketLobbyInfoDataParser = void 0;
const F1Parser_1$h = F1Parser$1;
const LobbyInfoDataParser_1 = LobbyInfoDataParser$1;
const PacketHeaderParser_1$8 = PacketHeaderParser$1;
class PacketLobbyInfoDataParser extends F1Parser_1$h.F1Parser {
  constructor(buffer, packetFormat) {
    super();
    __publicField(this, "data");
    this.endianess("little").nest("m_header", {
      type: new PacketHeaderParser_1$8.PacketHeaderParser(packetFormat)
    }).uint8("m_numPlayers").array("m_lobbyPlayers", {
      length: 22,
      type: new LobbyInfoDataParser_1.LobbyInfoDataParser(packetFormat)
    });
    this.data = this.fromBuffer(buffer);
  }
}
PacketLobbyInfoDataParser$1.PacketLobbyInfoDataParser = PacketLobbyInfoDataParser;
var PacketMotionDataParser$1 = {};
var CarMotionDataParser$1 = {};
Object.defineProperty(CarMotionDataParser$1, "__esModule", { value: true });
CarMotionDataParser$1.CarMotionDataParser = void 0;
const F1Parser_1$g = F1Parser$1;
class CarMotionDataParser extends F1Parser_1$g.F1Parser {
  constructor() {
    super();
    this.floatle("m_worldPositionX").floatle("m_worldPositionY").floatle("m_worldPositionZ").floatle("m_worldVelocityX").floatle("m_worldVelocityY").floatle("m_worldVelocityZ").int16le("m_worldForwardDirX").int16le("m_worldForwardDirY").int16le("m_worldForwardDirZ").int16le("m_worldRightDirX").int16le("m_worldRightDirY").int16le("m_worldRightDirZ").floatle("m_gForceLateral").floatle("m_gForceLongitudinal").floatle("m_gForceVertical").floatle("m_yaw").floatle("m_pitch").floatle("m_roll");
  }
}
CarMotionDataParser$1.CarMotionDataParser = CarMotionDataParser;
Object.defineProperty(PacketMotionDataParser$1, "__esModule", { value: true });
PacketMotionDataParser$1.PacketMotionDataParser = void 0;
const binary_parser_1$2 = binary_parser;
const F1Parser_1$f = F1Parser$1;
const CarMotionDataParser_1 = CarMotionDataParser$1;
const PacketHeaderParser_1$7 = PacketHeaderParser$1;
class PacketMotionDataParser extends F1Parser_1$f.F1Parser {
  constructor(buffer, packetFormat) {
    super();
    __publicField(this, "data");
    this.endianess("little").nest("m_header", {
      type: new PacketHeaderParser_1$7.PacketHeaderParser(packetFormat)
    }).array("m_carMotionData", {
      length: 22,
      type: new CarMotionDataParser_1.CarMotionDataParser()
    });
    if (packetFormat === 2022) {
      this.array("m_suspensionPosition", {
        length: 4,
        type: new binary_parser_1$2.Parser().floatle("")
      }).array("m_suspensionVelocity", {
        length: 4,
        type: new binary_parser_1$2.Parser().floatle("")
      }).array("m_suspensionAcceleration", {
        length: 4,
        type: new binary_parser_1$2.Parser().floatle("")
      }).array("m_wheelSpeed", {
        length: 4,
        type: new binary_parser_1$2.Parser().floatle("")
      }).array("m_wheelSlip", {
        length: 4,
        type: new binary_parser_1$2.Parser().floatle("")
      }).floatle("m_localVelocityX").floatle("m_localVelocityY").floatle("m_localVelocityZ").floatle("m_angularVelocityX").floatle("m_angularVelocityY").floatle("m_angularVelocityZ").floatle("m_angularAccelerationX").floatle("m_angularAccelerationY").floatle("m_angularAccelerationZ").floatle("m_frontWheelsAngle");
    }
    this.data = this.fromBuffer(buffer);
  }
}
PacketMotionDataParser$1.PacketMotionDataParser = PacketMotionDataParser;
var PacketParticipantsDataParser$1 = {};
var ParticipantDataParser$1 = {};
var LiveryColourParser$1 = {};
Object.defineProperty(LiveryColourParser$1, "__esModule", { value: true });
LiveryColourParser$1.LiveryColourParser = void 0;
const F1Parser_1$e = F1Parser$1;
class LiveryColourParser extends F1Parser_1$e.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("red").uint8("green").uint8("blue");
  }
}
LiveryColourParser$1.LiveryColourParser = LiveryColourParser;
Object.defineProperty(ParticipantDataParser$1, "__esModule", { value: true });
ParticipantDataParser$1.ParticipantDataParser = void 0;
const F1Parser_1$d = F1Parser$1;
const LiveryColourParser_1 = LiveryColourParser$1;
class ParticipantDataParser extends F1Parser_1$d.F1Parser {
  constructor(packetFormat) {
    super();
    this.uint8("m_aiControlled").uint8("m_driverId").uint8("m_networkId").uint8("m_teamId").uint8("m_myTeam").uint8("m_raceNumber").uint8("m_nationality");
    if (packetFormat === 2025) {
      this.string("m_name", {
        length: 32,
        stripNull: true
      });
    } else {
      this.string("m_name", {
        length: 48,
        stripNull: true
      });
    }
    this.uint8("m_yourTelemetry");
    if (packetFormat === 2023) {
      this.uint8("m_showOnlineNames").uint8("m_platform");
    }
    if (packetFormat === 2024) {
      this.uint8("m_showOnlineNames").uint16le("m_techLevel").uint8("m_platform");
    }
    if (packetFormat === 2025) {
      this.uint8("m_showOnlineNames").uint16le("m_techLevel").uint8("m_platform").uint8("m_numColours").array("m_liveryColour", { length: 4, type: new LiveryColourParser_1.LiveryColourParser() });
    }
  }
}
ParticipantDataParser$1.ParticipantDataParser = ParticipantDataParser;
Object.defineProperty(PacketParticipantsDataParser$1, "__esModule", { value: true });
PacketParticipantsDataParser$1.PacketParticipantsDataParser = void 0;
const F1Parser_1$c = F1Parser$1;
const PacketHeaderParser_1$6 = PacketHeaderParser$1;
const ParticipantDataParser_1 = ParticipantDataParser$1;
class PacketParticipantsDataParser extends F1Parser_1$c.F1Parser {
  constructor(buffer, packetFormat) {
    super();
    __publicField(this, "data");
    this.endianess("little").nest("m_header", {
      type: new PacketHeaderParser_1$6.PacketHeaderParser(packetFormat)
    });
    this.uint8("m_numActiveCars");
    this.array("m_participants", {
      length: 22,
      type: new ParticipantDataParser_1.ParticipantDataParser(packetFormat)
    });
    this.data = this.fromBuffer(buffer);
  }
}
PacketParticipantsDataParser$1.PacketParticipantsDataParser = PacketParticipantsDataParser;
var PacketSessionDataParser$1 = {};
var MarshalZoneParser$1 = {};
Object.defineProperty(MarshalZoneParser$1, "__esModule", { value: true });
MarshalZoneParser$1.MarshalZoneParser = void 0;
const F1Parser_1$b = F1Parser$1;
class MarshalZoneParser extends F1Parser_1$b.F1Parser {
  constructor() {
    super();
    this.endianess("little").floatle("m_zoneStart").int8("m_zoneFlag");
  }
}
MarshalZoneParser$1.MarshalZoneParser = MarshalZoneParser;
var WeatherForecastSampleParser$1 = {};
Object.defineProperty(WeatherForecastSampleParser$1, "__esModule", { value: true });
WeatherForecastSampleParser$1.WeatherForecastSampleParser = void 0;
const F1Parser_1$a = F1Parser$1;
class WeatherForecastSampleParser extends F1Parser_1$a.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("m_sessionType").uint8("m_timeOffset").uint8("m_weather").int8("m_trackTemperature").int8("m_trackTemperatureChange").int8("m_airTemperature").int8("m_airTemperatureChange").uint8("m_rainPercentage");
  }
}
WeatherForecastSampleParser$1.WeatherForecastSampleParser = WeatherForecastSampleParser;
Object.defineProperty(PacketSessionDataParser$1, "__esModule", { value: true });
PacketSessionDataParser$1.PacketSessionDataParser = void 0;
const binary_parser_1$1 = binary_parser;
const F1Parser_1$9 = F1Parser$1;
const MarshalZoneParser_1 = MarshalZoneParser$1;
const PacketHeaderParser_1$5 = PacketHeaderParser$1;
const WeatherForecastSampleParser_1 = WeatherForecastSampleParser$1;
class PacketSessionDataParser extends F1Parser_1$9.F1Parser {
  constructor(buffer, packetFormat) {
    super();
    __publicField(this, "data");
    this.endianess("little").nest("m_header", {
      type: new PacketHeaderParser_1$5.PacketHeaderParser(packetFormat)
    }).uint8("m_weather").int8("m_trackTemperature").int8("m_airTemperature").uint8("m_totalLaps").uint16le("m_trackLength").uint8("m_sessionType").int8("m_trackId").uint8("m_formula").uint16le("m_sessionTimeLeft").uint16le("m_sessionDuration").uint8("m_pitSpeedLimit").uint8("m_gamePaused").uint8("m_isSpectating").uint8("m_spectatorCarIndex").uint8("m_sliProNativeSupport").uint8("m_numMarshalZones").array("m_marshalZones", { length: 21, type: new MarshalZoneParser_1.MarshalZoneParser() }).uint8("m_safetyCarStatus").uint8("m_networkGame").uint8("m_numWeatherForecastSamples");
    if (packetFormat === 2022 || packetFormat === 2023) {
      this.array("m_weatherForecastSamples", {
        length: 56,
        type: new WeatherForecastSampleParser_1.WeatherForecastSampleParser()
      });
    }
    if (packetFormat === 2024 || packetFormat === 2025) {
      this.array("m_weatherForecastSamples", {
        length: 64,
        type: new WeatherForecastSampleParser_1.WeatherForecastSampleParser()
      });
    }
    this.uint8("m_forecastAccuracy").uint8("m_aiDifficulty").uint32le("m_seasonLinkIdentifier").uint32le("m_weekendLinkIdentifier").uint32le("m_sessionLinkIdentifier").uint8("m_pitStopWindowIdealLap").uint8("m_pitStopWindowLatestLap").uint8("m_pitStopRejoinPosition").uint8("m_steeringAssist").uint8("m_brakingAssist").uint8("m_gearboxAssist").uint8("m_pitAssist").uint8("m_pitReleaseAssist").uint8("m_ERSAssist").uint8("m_DRSAssist").uint8("m_dynamicRacingLine").uint8("m_dynamicRacingLineType").uint8("m_gameMode").uint8("m_ruleSet").uint32le("m_timeOfDay").uint8("m_sessionLength");
    if (packetFormat === 2023) {
      this.uint8("m_speedUnitsLeadPlayer").uint8("m_temperatureUnitsLeadPlayer").uint8("m_speedUnitsSecondaryPlayer").uint8("m_temperatureUnitsSecondaryPlayer").uint8("m_numSafetyCarPeriods").uint8("m_numVirtualSafetyCarPeriods").uint8("m_numRedFlagPeriods");
    }
    if (packetFormat === 2024 || packetFormat === 2025) {
      this.uint8("m_speedUnitsLeadPlayer").uint8("m_temperatureUnitsLeadPlayer").uint8("m_speedUnitsSecondaryPlayer").uint8("m_temperatureUnitsSecondaryPlayer").uint8("m_numSafetyCarPeriods").uint8("m_numVirtualSafetyCarPeriods").uint8("m_numRedFlagPeriods").uint8("m_equalCarPerformance").uint8("m_recoveryMode").uint8("m_flashbackLimit").uint8("m_surfaceType").uint8("m_lowFuelMode").uint8("m_raceStarts").uint8("m_tyreTemperature").uint8("m_pitLaneTyreSim").uint8("m_carDamage").uint8("m_carDamageRate").uint8("m_collisions").uint8("m_collisionsOffForFirstLapOnly").uint8("m_mpUnsafePitRelease").uint8("m_mpOffForGriefing").uint8("m_cornerCuttingStringency").uint8("m_parcFermeRules").uint8("m_pitStopExperience").uint8("m_safetyCar").uint8("m_safetyCarExperience").uint8("m_formationLap").uint8("m_formationLapExperience").uint8("m_redFlags").uint8("m_affectsLicenceLevelSolo").uint8("m_affectsLicenceLevelMP").uint8("m_numSessionsInWeekend").array("m_weekendStructure", {
        length: 12,
        type: new binary_parser_1$1.Parser().uint8("")
      }).floatle("m_sector2LapDistanceStart").floatle("m_sector3LapDistanceStart");
    }
    this.data = this.fromBuffer(buffer);
  }
}
PacketSessionDataParser$1.PacketSessionDataParser = PacketSessionDataParser;
var PacketSessionHistoryDataParser$1 = {};
var LapHistoryDataParser$1 = {};
Object.defineProperty(LapHistoryDataParser$1, "__esModule", { value: true });
LapHistoryDataParser$1.LapHistoryDataParser = void 0;
const F1Parser_1$8 = F1Parser$1;
class LapHistoryDataParser extends F1Parser_1$8.F1Parser {
  constructor(packetFormat) {
    super();
    this.endianess("little").uint32("m_lapTimeInMS");
    if (packetFormat === 2024 || packetFormat === 2025) {
      this.uint16le("m_sector1TimeMSPart").uint8("m_sector1TimeMinutesPart").uint16le("m_sector2TimeMSPart").uint8("m_sector2TimeMinutesPart").uint16le("m_sector3TimeMSPart").uint8("m_sector3TimeMinutesPart");
    } else if (packetFormat === 2023) {
      this.uint16le("m_sector1TimeInMS").uint8("m_sector1TimeMinutes").uint16le("m_sector2TimeInMS").uint8("m_sector2TimeMinutes").uint16le("m_sector3TimeInMS").uint8("m_sector3TimeMinutes");
    } else {
      this.uint16le("m_sector1TimeInMS").uint16le("m_sector2TimeInMS").uint16le("m_sector3TimeInMS");
    }
    this.uint8("m_lapValidBitFlags");
  }
}
LapHistoryDataParser$1.LapHistoryDataParser = LapHistoryDataParser;
var TyreStintsHistoryDataParser$1 = {};
Object.defineProperty(TyreStintsHistoryDataParser$1, "__esModule", { value: true });
TyreStintsHistoryDataParser$1.TyreStintsHistoryDataParser = void 0;
const F1Parser_1$7 = F1Parser$1;
class TyreStintsHistoryDataParser extends F1Parser_1$7.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("m_endLap").uint8("m_tyreActualCompound").uint8("m_tyreVisualCompound");
  }
}
TyreStintsHistoryDataParser$1.TyreStintsHistoryDataParser = TyreStintsHistoryDataParser;
Object.defineProperty(PacketSessionHistoryDataParser$1, "__esModule", { value: true });
PacketSessionHistoryDataParser$1.PacketSessionHistoryDataParser = void 0;
const F1Parser_1$6 = F1Parser$1;
const LapHistoryDataParser_1 = LapHistoryDataParser$1;
const TyreStintsHistoryDataParser_1 = TyreStintsHistoryDataParser$1;
const PacketHeaderParser_1$4 = PacketHeaderParser$1;
class PacketSessionHistoryDataParser extends F1Parser_1$6.F1Parser {
  constructor(buffer, packetFormat) {
    super();
    __publicField(this, "data");
    this.endianess("little").nest("m_header", {
      type: new PacketHeaderParser_1$4.PacketHeaderParser(packetFormat)
    }).uint8("m_carIdx").uint8("m_numLaps").uint8("m_numTyreStints").uint8("m_bestLapTimeLapNum").uint8("m_bestSector1LapNum").uint8("m_bestSector2LapNum").uint8("m_bestSector3LapNum").array("m_lapHistoryData", {
      length: 100,
      type: new LapHistoryDataParser_1.LapHistoryDataParser(packetFormat)
    }).array("m_tyreStintsHistoryData", {
      length: 8,
      type: new TyreStintsHistoryDataParser_1.TyreStintsHistoryDataParser()
    });
    this.data = this.fromBuffer(buffer);
  }
}
PacketSessionHistoryDataParser$1.PacketSessionHistoryDataParser = PacketSessionHistoryDataParser;
var PacketTyreSetsDataParser$1 = {};
var TyreSetDataParser$1 = {};
Object.defineProperty(TyreSetDataParser$1, "__esModule", { value: true });
TyreSetDataParser$1.TyreSetDataParser = void 0;
const F1Parser_1$5 = F1Parser$1;
class TyreSetDataParser extends F1Parser_1$5.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("m_actualTyreCompound").uint8("m_visualTyreCompound").uint8("m_wear").uint8("m_available").uint8("m_recommendedSession").uint8("m_lifeSpan").uint8("m_usableLife").int16("m_lapDeltaTime").uint8("m_fitted");
  }
}
TyreSetDataParser$1.TyreSetDataParser = TyreSetDataParser;
Object.defineProperty(PacketTyreSetsDataParser$1, "__esModule", { value: true });
PacketTyreSetsDataParser$1.PacketTyreSetsDataParser = void 0;
const F1Parser_1$4 = F1Parser$1;
const TyreSetDataParser_1 = TyreSetDataParser$1;
const PacketHeaderParser_1$3 = PacketHeaderParser$1;
class PacketTyreSetsDataParser extends F1Parser_1$4.F1Parser {
  constructor(buffer, packetFormat) {
    super();
    __publicField(this, "data");
    this.endianess("little").nest("m_header", {
      type: new PacketHeaderParser_1$3.PacketHeaderParser(packetFormat)
    }).uint8("m_carIdx").array("m_tyreSetData", {
      length: 20,
      type: new TyreSetDataParser_1.TyreSetDataParser()
    }).uint8("m_fittedIdx");
    this.data = this.fromBuffer(buffer);
  }
}
PacketTyreSetsDataParser$1.PacketTyreSetsDataParser = PacketTyreSetsDataParser;
var PacketMotionExDataParser$1 = {};
Object.defineProperty(PacketMotionExDataParser$1, "__esModule", { value: true });
PacketMotionExDataParser$1.PacketMotionExDataParser = void 0;
const binary_parser_1 = binary_parser;
const F1Parser_1$3 = F1Parser$1;
const PacketHeaderParser_1$2 = PacketHeaderParser$1;
class PacketMotionExDataParser extends F1Parser_1$3.F1Parser {
  constructor(buffer, packetFormat) {
    super();
    __publicField(this, "data");
    this.endianess("little").nest("m_header", {
      type: new PacketHeaderParser_1$2.PacketHeaderParser(packetFormat)
    }).array("m_suspensionPosition", {
      length: 4,
      type: new binary_parser_1.Parser().floatle("")
    }).array("m_suspensionVelocity", {
      length: 4,
      type: new binary_parser_1.Parser().floatle("")
    }).array("m_suspensionAcceleration", {
      length: 4,
      type: new binary_parser_1.Parser().floatle("")
    }).array("m_wheelSpeed", {
      length: 4,
      type: new binary_parser_1.Parser().floatle("")
    }).array("m_wheelSlipRatio", {
      length: 4,
      type: new binary_parser_1.Parser().floatle("")
    }).array("m_wheelSlipAngle", {
      length: 4,
      type: new binary_parser_1.Parser().floatle("")
    }).array("m_wheelLatForce", {
      length: 4,
      type: new binary_parser_1.Parser().floatle("")
    }).array("m_wheelLongForce", {
      length: 4,
      type: new binary_parser_1.Parser().floatle("")
    }).floatle("m_heightOfCOGAboveGround").floatle("m_localVelocityX").floatle("m_localVelocityY").floatle("m_localVelocityZ").floatle("m_angularVelocityX").floatle("m_angularVelocityY").floatle("m_angularVelocityZ").floatle("m_angularAccelerationX").floatle("m_angularAccelerationY").floatle("m_angularAccelerationZ").floatle("m_frontWheelsAngle").array("m_wheelVertForce", {
      length: 4,
      type: new binary_parser_1.Parser().floatle("")
    });
    if (packetFormat === 2024 || packetFormat === 2025) {
      this.floatle("m_frontAeroHeight").floatle("m_rearAeroHeight").floatle("m_frontRollAngle").floatle("m_rearRollAngle").floatle("m_chassisYaw");
    }
    if (packetFormat === 2025) {
      this.floatle("m_chassisPitch").array("m_wheelCamber", {
        length: 4,
        type: new binary_parser_1.Parser().floatle("")
      }).array("m_wheelCamberGain", {
        length: 4,
        type: new binary_parser_1.Parser().floatle("")
      });
    }
    this.data = this.fromBuffer(buffer);
  }
}
PacketMotionExDataParser$1.PacketMotionExDataParser = PacketMotionExDataParser;
var PacketTimeTrialDataParser$1 = {};
var TimeTrialDataSetParser$1 = {};
Object.defineProperty(TimeTrialDataSetParser$1, "__esModule", { value: true });
TimeTrialDataSetParser$1.TimeTrialDataSetParser = void 0;
const F1Parser_1$2 = F1Parser$1;
class TimeTrialDataSetParser extends F1Parser_1$2.F1Parser {
  constructor() {
    super();
    this.endianess("little").uint8("m_carIdx").uint8("m_teamId").uint32("m_sector1TimeInMS").uint32("m_sector2TimeInMS").uint32("m_sector3TimeInMS").uint8("m_tractionControl").uint8("m_gearboxAssist").uint8("m_antiLockBrakes").uint8("m_equalCarPerformance").uint8("m_customSetup").uint8("m_valid");
  }
}
TimeTrialDataSetParser$1.TimeTrialDataSetParser = TimeTrialDataSetParser;
Object.defineProperty(PacketTimeTrialDataParser$1, "__esModule", { value: true });
PacketTimeTrialDataParser$1.PacketTimeTrialDataParser = void 0;
const F1Parser_1$1 = F1Parser$1;
const PacketHeaderParser_1$1 = PacketHeaderParser$1;
const TimeTrialDataSetParser_1 = TimeTrialDataSetParser$1;
class PacketTimeTrialDataParser extends F1Parser_1$1.F1Parser {
  constructor(buffer, packetFormat) {
    super();
    __publicField(this, "data");
    this.endianess("little").nest("m_header", {
      type: new PacketHeaderParser_1$1.PacketHeaderParser(packetFormat)
    });
    this.nest("m_playerSessionBestDataSet", {
      type: new TimeTrialDataSetParser_1.TimeTrialDataSetParser()
    });
    this.nest("m_personalBestDataSet", {
      type: new TimeTrialDataSetParser_1.TimeTrialDataSetParser()
    });
    this.nest("m_rivalDataSet", {
      type: new TimeTrialDataSetParser_1.TimeTrialDataSetParser()
    });
    this.data = this.fromBuffer(buffer);
  }
}
PacketTimeTrialDataParser$1.PacketTimeTrialDataParser = PacketTimeTrialDataParser;
var PacketLapPositionsDataParser$1 = {};
Object.defineProperty(PacketLapPositionsDataParser$1, "__esModule", { value: true });
PacketLapPositionsDataParser$1.PacketLapPositionsDataParser = void 0;
const F1Parser_1 = F1Parser$1;
const PacketHeaderParser_1 = PacketHeaderParser$1;
class PacketLapPositionsDataParser extends F1Parser_1.F1Parser {
  constructor(buffer, packetFormat) {
    super();
    __publicField(this, "data");
    this.endianess("little").nest("m_header", { type: new PacketHeaderParser_1.PacketHeaderParser(packetFormat) }).uint8("m_numLaps").uint8("m_lapStart").array("m_positionForVehicleIdx", {
      length: 50,
      type: new F1Parser_1.F1Parser().array("", { length: 22, type: new F1Parser_1.F1Parser().uint8("") })
      // 22 cars
    });
    this.data = this.fromBuffer(buffer);
  }
}
PacketLapPositionsDataParser$1.PacketLapPositionsDataParser = PacketLapPositionsDataParser;
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.PacketLapPositionsDataParser = exports.PacketTimeTrialDataParser = exports.PacketMotionExDataParser = exports.PacketTyreSetsDataParser = exports.PacketSessionHistoryDataParser = exports.PacketCarDamageDataParser = exports.PacketSessionDataParser = exports.PacketParticipantsDataParser = exports.PacketMotionDataParser = exports.PacketLobbyInfoDataParser = exports.PacketLapDataParser = exports.PacketHeaderParser = exports.PacketFormatParser = exports.PacketFinalClassificationDataParser = exports.PacketEventDataParser = exports.PacketCarTelemetryDataParser = exports.PacketCarStatusDataParser = exports.PacketCarSetupDataParser = void 0;
  const PacketCarDamageDataParser_1 = PacketCarDamageDataParser$1;
  Object.defineProperty(exports, "PacketCarDamageDataParser", { enumerable: true, get: function() {
    return PacketCarDamageDataParser_1.PacketCarDamageDataParser;
  } });
  const PacketCarSetupDataParser_1 = PacketCarSetupDataParser$1;
  Object.defineProperty(exports, "PacketCarSetupDataParser", { enumerable: true, get: function() {
    return PacketCarSetupDataParser_1.PacketCarSetupDataParser;
  } });
  const PacketCarStatusDataParser_1 = PacketCarStatusDataParser$1;
  Object.defineProperty(exports, "PacketCarStatusDataParser", { enumerable: true, get: function() {
    return PacketCarStatusDataParser_1.PacketCarStatusDataParser;
  } });
  const PacketCarTelemetryDataParser_1 = PacketCarTelemetryDataParser$1;
  Object.defineProperty(exports, "PacketCarTelemetryDataParser", { enumerable: true, get: function() {
    return PacketCarTelemetryDataParser_1.PacketCarTelemetryDataParser;
  } });
  const PacketEventDataParser_1 = PacketEventDataParser$1;
  Object.defineProperty(exports, "PacketEventDataParser", { enumerable: true, get: function() {
    return PacketEventDataParser_1.PacketEventDataParser;
  } });
  const PacketFinalClassificationDataParser_1 = PacketFinalClassificationDataParser$1;
  Object.defineProperty(exports, "PacketFinalClassificationDataParser", { enumerable: true, get: function() {
    return PacketFinalClassificationDataParser_1.PacketFinalClassificationDataParser;
  } });
  const PacketFormatParser_1 = PacketFormatParser$1;
  Object.defineProperty(exports, "PacketFormatParser", { enumerable: true, get: function() {
    return PacketFormatParser_1.PacketFormatParser;
  } });
  const PacketHeaderParser_12 = PacketHeaderParser$1;
  Object.defineProperty(exports, "PacketHeaderParser", { enumerable: true, get: function() {
    return PacketHeaderParser_12.PacketHeaderParser;
  } });
  const PacketLapDataParser_1 = PacketLapDataParser$1;
  Object.defineProperty(exports, "PacketLapDataParser", { enumerable: true, get: function() {
    return PacketLapDataParser_1.PacketLapDataParser;
  } });
  const PacketLobbyInfoDataParser_1 = PacketLobbyInfoDataParser$1;
  Object.defineProperty(exports, "PacketLobbyInfoDataParser", { enumerable: true, get: function() {
    return PacketLobbyInfoDataParser_1.PacketLobbyInfoDataParser;
  } });
  const PacketMotionDataParser_1 = PacketMotionDataParser$1;
  Object.defineProperty(exports, "PacketMotionDataParser", { enumerable: true, get: function() {
    return PacketMotionDataParser_1.PacketMotionDataParser;
  } });
  const PacketParticipantsDataParser_1 = PacketParticipantsDataParser$1;
  Object.defineProperty(exports, "PacketParticipantsDataParser", { enumerable: true, get: function() {
    return PacketParticipantsDataParser_1.PacketParticipantsDataParser;
  } });
  const PacketSessionDataParser_1 = PacketSessionDataParser$1;
  Object.defineProperty(exports, "PacketSessionDataParser", { enumerable: true, get: function() {
    return PacketSessionDataParser_1.PacketSessionDataParser;
  } });
  const PacketSessionHistoryDataParser_1 = PacketSessionHistoryDataParser$1;
  Object.defineProperty(exports, "PacketSessionHistoryDataParser", { enumerable: true, get: function() {
    return PacketSessionHistoryDataParser_1.PacketSessionHistoryDataParser;
  } });
  const PacketTyreSetsDataParser_1 = PacketTyreSetsDataParser$1;
  Object.defineProperty(exports, "PacketTyreSetsDataParser", { enumerable: true, get: function() {
    return PacketTyreSetsDataParser_1.PacketTyreSetsDataParser;
  } });
  const PacketMotionExDataParser_1 = PacketMotionExDataParser$1;
  Object.defineProperty(exports, "PacketMotionExDataParser", { enumerable: true, get: function() {
    return PacketMotionExDataParser_1.PacketMotionExDataParser;
  } });
  const PacketTimeTrialDataParser_1 = PacketTimeTrialDataParser$1;
  Object.defineProperty(exports, "PacketTimeTrialDataParser", { enumerable: true, get: function() {
    return PacketTimeTrialDataParser_1.PacketTimeTrialDataParser;
  } });
  const PacketLapPositionsDataParser_1 = PacketLapPositionsDataParser$1;
  Object.defineProperty(exports, "PacketLapPositionsDataParser", { enumerable: true, get: function() {
    return PacketLapPositionsDataParser_1.PacketLapPositionsDataParser;
  } });
})(packets);
var types = {};
Object.defineProperty(types, "__esModule", { value: true });
var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
  if (k2 === void 0) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = { enumerable: true, get: function() {
      return m[k];
    } };
  }
  Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
  if (k2 === void 0) k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
} : function(o, v) {
  o["default"] = v;
});
var __importStar = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) {
    for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }
  __setModuleDefault(result, mod);
  return result;
};
var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(src, "__esModule", { value: true });
src.FORWARD_ADDRESSES = src.DEFAULT_PORT = src.packetTypes = src.constantsTypes = constants_1 = src.constants = F1TelemetryClient_1 = src.F1TelemetryClient = void 0;
const dgram = __importStar(require$$0$2);
const events_1 = require$$1$2;
const fs_1 = __importDefault(require$$3);
const os_1 = __importDefault(require$$3$2);
const path_1 = __importDefault(require$$0$1);
const constants = __importStar(constants$1);
var constants_1 = src.constants = constants;
const constantsTypes = __importStar(types$1);
src.constantsTypes = constantsTypes;
const packets_1 = packets;
const packetTypes = __importStar(types);
src.packetTypes = packetTypes;
const DEFAULT_PORT = 20777;
src.DEFAULT_PORT = DEFAULT_PORT;
const FORWARD_ADDRESSES = void 0;
src.FORWARD_ADDRESSES = FORWARD_ADDRESSES;
class F1TelemetryClient extends events_1.EventEmitter {
  constructor(opts = {}) {
    super();
    __publicField(this, "port");
    __publicField(this, "forwardAddresses");
    __publicField(this, "socket");
    __publicField(this, "testModeActive", false);
    __publicField(this, "testMode");
    const { port = DEFAULT_PORT, forwardAddresses = FORWARD_ADDRESSES, testModeActive } = opts;
    this.port = port;
    this.forwardAddresses = forwardAddresses;
    this.socket = dgram.createSocket("udp4");
    this.testModeActive = testModeActive;
    if (testModeActive)
      this.testMode = initializeTestMode.call(this);
  }
  /**
   *
   * @param {Buffer} message
   */
  static parseBufferMessage(message) {
    const { m_packetFormat, m_packetId } = F1TelemetryClient.parsePacketHeader(message);
    const parser = F1TelemetryClient.getParserByPacketId(m_packetId);
    if (!parser) {
      return;
    }
    const packetData = new parser(message, m_packetFormat);
    const packetID = Object.keys(constants.PACKETS)[m_packetId];
    return { packetData, packetID };
  }
  /**
   *
   * @param {Buffer} buffer
   */
  static parsePacketHeader(buffer) {
    const packetFormatParser = new packets_1.PacketFormatParser();
    const { m_packetFormat } = packetFormatParser.fromBuffer(buffer);
    const packetHeaderParser = new packets_1.PacketHeaderParser(m_packetFormat);
    return packetHeaderParser.fromBuffer(buffer);
  }
  /**
   *
   * @param {Number} packetFormat
   * @param {Number} packetId
   */
  static getPacketSize(packetFormat, packetId) {
    const { PACKET_SIZES } = constants;
    const packetValues = Object.values(PACKET_SIZES);
    return packetValues[packetId][packetFormat];
  }
  /**
   *
   * @param {Number} packetId
   */
  static getParserByPacketId(packetId) {
    const { PACKETS: PACKETS2 } = constants;
    const packetKeys = Object.keys(PACKETS2);
    const packetType = packetKeys[packetId];
    switch (packetType) {
      case PACKETS2.session:
        return packets_1.PacketSessionDataParser;
      case PACKETS2.motion:
        return packets_1.PacketMotionDataParser;
      case PACKETS2.lapData:
        return packets_1.PacketLapDataParser;
      case PACKETS2.event:
        return packets_1.PacketEventDataParser;
      case PACKETS2.participants:
        return packets_1.PacketParticipantsDataParser;
      case PACKETS2.carSetups:
        return packets_1.PacketCarSetupDataParser;
      case PACKETS2.carTelemetry:
        return packets_1.PacketCarTelemetryDataParser;
      case PACKETS2.carStatus:
        return packets_1.PacketCarStatusDataParser;
      case PACKETS2.finalClassification:
        return packets_1.PacketFinalClassificationDataParser;
      case PACKETS2.lobbyInfo:
        return packets_1.PacketLobbyInfoDataParser;
      case PACKETS2.carDamage:
        return packets_1.PacketCarDamageDataParser;
      case PACKETS2.sessionHistory:
        return packets_1.PacketSessionHistoryDataParser;
      case PACKETS2.tyreSets:
        return packets_1.PacketTyreSetsDataParser;
      case PACKETS2.motionEx:
        return packets_1.PacketMotionExDataParser;
      case PACKETS2.timeTrial:
        return packets_1.PacketTimeTrialDataParser;
      case PACKETS2.lapPositions:
        return packets_1.PacketLapPositionsDataParser;
      default:
        return null;
    }
  }
  /**
   *
   * @param {Buffer} message
   */
  handleMessage(message) {
    if (this.forwardAddresses) {
      this.bridgeMessage(message);
    }
    const parsedMessage = F1TelemetryClient.parseBufferMessage(message);
    if (!parsedMessage || !parsedMessage.packetData) {
      return;
    }
    this.emit(parsedMessage.packetID, parsedMessage.packetData.data);
  }
  /**
   *
   * @param {Buffer} message
   */
  handleTestModeMessage(message) {
    const { testMode } = this;
    if (!testMode)
      return;
    testMode.bufferStream.write(`${JSON.stringify(message.toJSON().data)},
`);
    testMode.bufferCount += 1;
    if (testMode.bufferCount > 1e4) {
      testMode.bufferStream.end();
      testMode.fileCount++;
      testMode.bufferCount = 0;
      testMode.bufferStream = fs_1.default.createWriteStream(`${testMode.logDir}/chunk_${testMode.fileCount}.json`);
    }
  }
  /**
   *
   * @param {Buffer} message
   */
  bridgeMessage(message) {
    if (!this.socket) {
      throw new Error("Socket is not initialized");
    }
    if (!this.forwardAddresses) {
      throw new Error("No ports to bridge over");
    }
    for (const address of this.forwardAddresses) {
      this.socket.send(message, 0, message.length, address.port, address.ip || "0.0.0.0");
    }
  }
  /**
   * Method to start listening for packets
   */
  start() {
    if (!this.socket) {
      return;
    }
    this.socket.on("listening", () => {
      if (!this.socket) {
        return;
      }
      this.socket.address();
      this.socket.setBroadcast(true);
    });
    this.socket.on("message", (m) => {
      if (this.testModeActive && this.testMode) {
        this.handleTestModeMessage(m);
      } else
        this.handleMessage(m);
    });
    this.socket.bind({
      port: this.port,
      exclusive: false
    });
  }
  /**
   * Method to close the client
   */
  stop() {
    if (!this.socket) {
      return;
    }
    return this.socket.close(() => {
      this.socket = void 0;
    });
  }
  /**
   * Method to add a new forward address
   */
  addForwardAddress(address) {
    if (!this.forwardAddresses) {
      this.forwardAddresses = [];
    }
    this.forwardAddresses.push(address);
    return this.forwardAddresses;
  }
  /**
   * Method to remove a forward address
   */
  removeForwardAddress(address) {
    if (!this.forwardAddresses) {
      return;
    }
    this.forwardAddresses.splice(this.forwardAddresses.findIndex((forwardAddress) => forwardAddress.port === address.port && forwardAddress.ip === address.ip), 1);
    return this.forwardAddresses;
  }
}
var F1TelemetryClient_1 = src.F1TelemetryClient = F1TelemetryClient;
function initializeTestMode() {
  const localAppDataDirectory = path_1.default.join(os_1.default.homedir(), "AppData", "Local");
  const testLogDir = `${localAppDataDirectory}/Podium/udp_logs/${Date.now()}`;
  fs_1.default.mkdirSync(testLogDir);
  const testMode = {
    bufferStream: fs_1.default.createWriteStream(`${testLogDir}/chunk_${0}.json`),
    fileCount: 0,
    bufferCount: 0,
    logDir: testLogDir
  };
  return testMode;
}
const { PACKETS } = constants_1;
if (started) {
  require$$3$1.app.quit();
}
let mainWindow;
const createWindow = () => {
  mainWindow = new require$$3$1.BrowserWindow({
    width: 1e3,
    height: 800,
    webPreferences: {
      preload: path$1.join(__dirname, "preload.js")
    }
  });
  {
    mainWindow.loadURL("http://localhost:5173");
  }
  mainWindow.webContents.openDevTools();
  startTelemetry();
};
function startTelemetry() {
  const client = new F1TelemetryClient_1({ port: 20777 });
  client.on(PACKETS.carTelemetry, (data) => {
    var _a, _b;
    const speed = (_b = (_a = data.m_carTelemetryData) == null ? void 0 : _a[0]) == null ? void 0 : _b.m_speed;
    if (mainWindow && typeof speed === "number") {
      mainWindow.webContents.send("telemetry:speed", speed);
    }
  });
  client.start();
  console.log("[UDP] Listening on port 20777");
}
require$$3$1.app.whenReady().then(createWindow);
require$$3$1.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    require$$3$1.app.quit();
  }
});
