!function (e) {
    var t = {};

    function o(n) {
        if (t[n]) return t[n].exports;
        var i = t[n] = {i: n, l: !1, exports: {}};
        return e[n].call(i.exports, i, i.exports, o), i.l = !0, i.exports
    }

    o.m = e, o.c = t, o.d = function (e, t, n) {
        o.o(e, t) || Object.defineProperty(e, t, {enumerable: !0, get: n})
    }, o.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: !0})
    }, o.t = function (e, t) {
        if (1 & t && (e = o(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var n = Object.create(null);
        if (o.r(n), Object.defineProperty(n, "default", {
            enumerable: !0,
            value: e
        }), 2 & t && "string" != typeof e) for (var i in e) o.d(n, i, function (t) {
            return e[t]
        }.bind(null, i));
        return n
    }, o.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return o.d(t, "a", t), t
    }, o.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, o.p = "", o(o.s = 3)
}({
    3: function (e, t) {
        layui.define(["jquery"], (function (e) {
            var t = layui.jquery, o = {
                bind: function (e, n) {
                    t(e).bind("contextmenu", (function (e) {
                        return o.show(n, e.clientX, e.clientY, e), !1
                    }))
                }, show: function (e, n, i, r) {
                    var c = '<div class="ctxMenu" style="' + ("left: " + n + "px; top: " + i + "px;") + '">';
                    c += o.getHtml(e, ""), c += "   </div>", o.remove(), t("body").append(c);
                    var u = t(".ctxMenu");
                    n + u.outerWidth() > o.getPageWidth() && (n -= u.outerWidth()), i + u.outerHeight() > o.getPageHeight() && (i -= u.outerHeight()) < 0 && (i = 0), u.css({
                        top: i,
                        left: n
                    }), o.setEvents(e, r), t(".ctxMenu-item").on("mouseenter", (function (e) {
                        if (e.stopPropagation(), t(this).parent().find(".ctxMenu-sub").css("display", "none"), t(this).hasClass("haveMore")) {
                            var n = t(this).find(">a"), i = t(this).find(">.ctxMenu-sub"),
                                r = n.offset().top - t("body,html").scrollTop(),
                                c = n.offset().left + n.outerWidth() - t("body,html").scrollLeft();
                            c + i.outerWidth() > o.getPageWidth() && (c = n.offset().left - i.outerWidth()), r + i.outerHeight() > o.getPageHeight() && (r = r - i.outerHeight() + n.outerHeight()) < 0 && (r = 0), t(this).find(">.ctxMenu-sub").css({
                                top: r,
                                left: c,
                                display: "block"
                            })
                        }
                    }))
                }, remove: function () {
                    for (var e = parent.window.frames, t = 0; t < e.length; t++) {
                        var o = e[t];
                        try {
                            o.layui.jquery("body>.ctxMenu").remove()
                        } catch (e) {
                        }
                    }
                    try {
                        parent.layui.jquery("body>.ctxMenu").remove()
                    } catch (e) {
                    }
                }, setEvents: function (e, o) {
                    t(".ctxMenu").off("click").on("click", "[lay-id]", (function (n) {
                        var i = function e(t, o) {
                            for (var n = 0; n < o.length; n++) {
                                var i = o[n];
                                if (t == i.itemId) return i;
                                if (i.subs && i.subs.length > 0) {
                                    var r = e(t, i.subs);
                                    if (r) return r
                                }
                            }
                        }(t(this).attr("lay-id"), e);
                        i.click && i.click(n, o)
                    }))
                }, getHtml: function (e, t) {
                    for (var n = "", i = 0; i < e.length; i++) {
                        var r = e[i];
                        r.itemId = "ctxMenu-" + t + i, r.subs && r.subs.length > 0 ? (n += '<div class="ctxMenu-item haveMore" lay-id="' + r.itemId + '">', n += "<a>", r.icon && (n += '<i class="' + r.icon + ' ctx-icon"></i>'), n += r.name, n += '<i class="layui-icon layui-icon-right icon-more"></i>', n += "</a>", n += '<div class="ctxMenu-sub" style="display: none;">', n += o.getHtml(r.subs, t + i), n += "</div>") : (n += '<div class="ctxMenu-item" lay-id="' + r.itemId + '">', n += "<a>", r.icon && (n += '<i class="' + r.icon + ' ctx-icon"></i>'), n += r.name, n += "</a>"), n += "</div>", 1 == r.hr && (n += "<hr/>")
                    }
                    return n
                }, getCommonCss: function () {
                    return "        max-width: 250px;", "        min-width: 110px;", "        background: white;", "        border-radius: 2px;", "        padding: 5px 0;", "        white-space: nowrap;", "        position: fixed;", "        z-index: 2147483647;", "        box-shadow: 0 2px 4px rgba(0, 0, 0, .12);", "        border: 1px solid #d2d2d2;", "        overflow: visible;", "   }", "   .ctxMenu-item {", "        position: relative;", "   }", "   .ctxMenu-item > a {", "        font-size: 14px;", "        color: #666;", "        padding: 0 26px 0 35px;", "        cursor: pointer;", "        display: block;", "        line-height: 36px;", "        text-decoration: none;", "        position: relative;", "   }", "   .ctxMenu-item > a:hover {", "        background: #f2f2f2;", "        color: #666;", "   }", "   .ctxMenu-item > a > .icon-more {", "        position: absolute;", "        right: 5px;", "        top: 0;", "        font-size: 12px;", "        color: #666;", "   }", "   .ctxMenu-item > a > .ctx-icon {", "        position: absolute;", "        left: 12px;", "        top: 0;", "        font-size: 15px;", "        color: #666;", "   }", "   .ctxMenu hr {", "        background-color: #e6e6e6;", "        clear: both;", "        margin: 5px 0;", "        border: 0;", "        height: 1px;", "   }", "   .ctx-ic-lg {", "        font-size: 18px !important;", "        left: 11px !important;", "    }", ".ctxMenu, .ctxMenu-sub {        max-width: 250px;        min-width: 110px;        background: white;        border-radius: 2px;        padding: 5px 0;        white-space: nowrap;        position: fixed;        z-index: 2147483647;        box-shadow: 0 2px 4px rgba(0, 0, 0, .12);        border: 1px solid #d2d2d2;        overflow: visible;   }   .ctxMenu-item {        position: relative;   }   .ctxMenu-item > a {        font-size: 14px;        color: #666;        padding: 0 26px 0 35px;        cursor: pointer;        display: block;        line-height: 36px;        text-decoration: none;        position: relative;   }   .ctxMenu-item > a:hover {        background: #f2f2f2;        color: #666;   }   .ctxMenu-item > a > .icon-more {        position: absolute;        right: 5px;        top: 0;        font-size: 12px;        color: #666;   }   .ctxMenu-item > a > .ctx-icon {        position: absolute;        left: 12px;        top: 0;        font-size: 15px;        color: #666;   }   .ctxMenu hr {        background-color: #e6e6e6;        clear: both;        margin: 5px 0;        border: 0;        height: 1px;   }   .ctx-ic-lg {        font-size: 18px !important;        left: 11px !important;    }"
                }, getPageHeight: function () {
                    return document.documentElement.clientHeight || document.body.clientHeight
                }, getPageWidth: function () {
                    return document.documentElement.clientWidth || document.body.clientWidth
                }
            };
            t(document).off("click.ctxMenu").on("click.ctxMenu", (function () {
                o.remove()
            })), t(document).off("click.ctxMenuMore").on("click.ctxMenuMore", ".ctxMenu-item", (function (e) {
                t(this).hasClass("haveMore") ? void 0 !== e && (e.preventDefault(), e.stopPropagation()) : o.remove()
            })), t("head").append('<style id="ew-css-ctx">' + o.getCommonCss() + "</style>"), e("contextMenu", o)
        }))
    }
});