// src/tui.tsx
import { createTextNode as _$createTextNode } from "@opentui/solid";
import { insertNode as _$insertNode } from "@opentui/solid";
import { createComponent as _$createComponent } from "@opentui/solid";
import { effect as _$effect } from "@opentui/solid";
import { insert as _$insert } from "@opentui/solid";
import { memo as _$memo } from "@opentui/solid";
import { setProp as _$setProp } from "@opentui/solid";
import { createElement as _$createElement } from "@opentui/solid";
import { createRoot, createSignal, createMemo, Show, For, onCleanup } from "solid-js";
import { readFileSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";
var STATE_FILE = join(homedir(), ".cache", "opencode-quota", "state.json");
function readState() {
  try {
    if (!existsSync(STATE_FILE)) return null;
    return JSON.parse(readFileSync(STATE_FILE, "utf-8"));
  } catch {
    return null;
  }
}
function barFull(pct, len = 6) {
  const filled = Math.round(pct / 100 * len);
  return "\u2501".repeat(Math.max(0, filled));
}
function barEmpty(pct, len = 6) {
  const filled = Math.round(pct / 100 * len);
  return "\u2500".repeat(Math.max(0, len - filled));
}
var tui = async (api) => {
  createRoot((dispose) => {
    const [data, setData] = createSignal(readState());
    const [open, setOpen] = createSignal(api.kv?.get("quota-open", true) ?? true);
    const timer = setInterval(() => {
      setData(readState());
    }, 3e3);
    onCleanup(() => {
      clearInterval(timer);
      dispose();
    });
    const toggle = () => {
      const next = !open();
      setOpen(next);
      api.kv?.set("quota-open", next);
    };
    function View() {
      const d = data();
      const provs = d?.providers ?? [];
      const theme = api.theme.current;
      const hasBilling = createMemo(() => provs.filter((p) => !p.noBilling && !p.error));
      const noBilling = createMemo(() => provs.filter((p) => p.noBilling));
      const hasErrors = createMemo(() => provs.filter((p) => p.error));
      const totalCount = () => provs.length;
      const summary = () => {
        const parts = [];
        const b = hasBilling().length;
        if (b > 0) parts.push(`${b} com billing`);
        const nb = noBilling().length;
        if (nb > 0) parts.push(`${nb} N/A`);
        const e = hasErrors().length;
        if (e > 0) parts.push(`${e} erro`);
        return parts.length > 0 ? ` (${parts.join(", ")})` : "";
      };
      const bulletColor = (p) => {
        if (p.error) return theme.error;
        if (!p.noBilling) return theme.success;
        return theme.textMuted;
      };
      const dot = (color) => ({
        fg: color
      });
      return _$createComponent(Show, {
        get when() {
          return totalCount() > 0;
        },
        get children() {
          var _el$ = _$createElement("box"), _el$2 = _$createElement("box"), _el$6 = _$createElement("text"), _el$7 = _$createElement("b");
          _$insertNode(_el$, _el$2);
          _$insertNode(_el$2, _el$6);
          _$setProp(_el$2, "flexDirection", "row");
          _$setProp(_el$2, "gap", 1);
          _$setProp(_el$2, "onMouseDown", () => toggle());
          _$insert(_el$2, _$createComponent(Show, {
            get when() {
              return totalCount() > 2;
            },
            get children() {
              var _el$3 = _$createElement("text");
              _$insert(_el$3, () => open() ? "\u25BC" : "\u25B6");
              _$effect((_$p) => _$setProp(_el$3, "fg", theme.text, _$p));
              return _el$3;
            }
          }), _el$6);
          _$insert(_el$2, _$createComponent(Show, {
            get when() {
              return totalCount() <= 2;
            },
            get children() {
              var _el$4 = _$createElement("text");
              _$insertNode(_el$4, _$createTextNode(` `));
              _$setProp(_el$4, "style", {
                width: 1
              });
              return _el$4;
            }
          }), _el$6);
          _$insertNode(_el$6, _el$7);
          _$insertNode(_el$7, _$createTextNode(`Quota`));
          _$insert(_el$6, _$createComponent(Show, {
            get when() {
              return !open();
            },
            get children() {
              var _el$9 = _$createElement("span");
              _$insert(_el$9, summary);
              _$effect((_$p) => _$setProp(_el$9, "style", {
                fg: theme.textMuted
              }, _$p));
              return _el$9;
            }
          }), null);
          _$insert(_el$, _$createComponent(Show, {
            get when() {
              return totalCount() <= 2 || open();
            },
            get children() {
              return _$createComponent(For, {
                each: provs,
                children: (p) => (() => {
                  var _el$0 = _$createElement("box"), _el$1 = _$createElement("text");
                  _$insertNode(_el$0, _el$1);
                  _$setProp(_el$0, "flexDirection", "row");
                  _$setProp(_el$0, "gap", 1);
                  _$insertNode(_el$1, _$createTextNode(`\u2022`));
                  _$setProp(_el$1, "flexShrink", 0);
                  _$insert(_el$0, _$createComponent(Show, {
                    get when() {
                      return _$memo(() => !!!p.noBilling)() && !p.error;
                    },
                    get children() {
                      var _el$11 = _$createElement("text"), _el$12 = _$createTextNode(` `), _el$13 = _$createElement("span"), _el$14 = _$createElement("span"), _el$15 = _$createTextNode(` `), _el$16 = _$createElement("span");
                      _$insertNode(_el$11, _el$12);
                      _$insertNode(_el$11, _el$13);
                      _$insertNode(_el$11, _el$14);
                      _$insertNode(_el$11, _el$15);
                      _$insertNode(_el$11, _el$16);
                      _$setProp(_el$11, "wrapMode", "word");
                      _$insert(_el$11, () => p.name, _el$12);
                      _$insert(_el$13, () => barFull(p.usagePct ?? 0));
                      _$insert(_el$14, () => barEmpty(p.usagePct ?? 0));
                      _$insert(_el$16, () => p.usageLabel);
                      _$effect((_p$) => {
                        var _v$ = theme.text, _v$2 = {
                          fg: theme.success
                        }, _v$3 = {
                          fg: theme.textMuted
                        }, _v$4 = {
                          fg: theme.textMuted
                        };
                        _v$ !== _p$.e && (_p$.e = _$setProp(_el$11, "fg", _v$, _p$.e));
                        _v$2 !== _p$.t && (_p$.t = _$setProp(_el$13, "style", _v$2, _p$.t));
                        _v$3 !== _p$.a && (_p$.a = _$setProp(_el$14, "style", _v$3, _p$.a));
                        _v$4 !== _p$.o && (_p$.o = _$setProp(_el$16, "style", _v$4, _p$.o));
                        return _p$;
                      }, {
                        e: void 0,
                        t: void 0,
                        a: void 0,
                        o: void 0
                      });
                      return _el$11;
                    }
                  }), null);
                  _$insert(_el$0, _$createComponent(Show, {
                    get when() {
                      return p.noBilling;
                    },
                    get children() {
                      var _el$17 = _$createElement("text"), _el$18 = _$createTextNode(` `), _el$19 = _$createElement("span");
                      _$insertNode(_el$17, _el$18);
                      _$insertNode(_el$17, _el$19);
                      _$setProp(_el$17, "wrapMode", "word");
                      _$insert(_el$17, () => p.name, _el$18);
                      _$insertNode(_el$19, _$createTextNode(`N/A`));
                      _$effect((_p$) => {
                        var _v$5 = theme.text, _v$6 = {
                          fg: theme.textMuted
                        };
                        _v$5 !== _p$.e && (_p$.e = _$setProp(_el$17, "fg", _v$5, _p$.e));
                        _v$6 !== _p$.t && (_p$.t = _$setProp(_el$19, "style", _v$6, _p$.t));
                        return _p$;
                      }, {
                        e: void 0,
                        t: void 0
                      });
                      return _el$17;
                    }
                  }), null);
                  _$insert(_el$0, _$createComponent(Show, {
                    get when() {
                      return p.error;
                    },
                    get children() {
                      var _el$21 = _$createElement("text"), _el$22 = _$createTextNode(` `), _el$23 = _$createElement("span");
                      _$insertNode(_el$21, _el$22);
                      _$insertNode(_el$21, _el$23);
                      _$setProp(_el$21, "wrapMode", "word");
                      _$insert(_el$21, () => p.name, _el$22);
                      _$insert(_el$23, () => p.error);
                      _$effect((_p$) => {
                        var _v$7 = theme.text, _v$8 = {
                          fg: theme.error
                        };
                        _v$7 !== _p$.e && (_p$.e = _$setProp(_el$21, "fg", _v$7, _p$.e));
                        _v$8 !== _p$.t && (_p$.t = _$setProp(_el$23, "style", _v$8, _p$.t));
                        return _p$;
                      }, {
                        e: void 0,
                        t: void 0
                      });
                      return _el$21;
                    }
                  }), null);
                  _$effect((_$p) => _$setProp(_el$1, "style", dot(bulletColor(p)), _$p));
                  return _el$0;
                })()
              });
            }
          }), null);
          _$effect((_$p) => _$setProp(_el$6, "fg", theme.text, _$p));
          return _el$;
        }
      });
    }
    api.slots.register({
      order: 250,
      slots: {
        sidebar_content(_ctx, _props) {
          return _$createComponent(View, {});
        }
      }
    });
  });
};
var plugin = {
  id: "opencode-quota-sidebar",
  tui
};
var tui_default = plugin;
export {
  tui_default as default
};
