!function (e) {
    var t = {};

    function o(a) {
        if (t[a]) return t[a].exports;
        var i = t[a] = {i: a, l: !1, exports: {}};
        return e[a].call(i.exports, i, i.exports, o), i.l = !0, i.exports
    }

    o.m = e, o.c = t, o.d = function (e, t, a) {
        o.o(e, t) || Object.defineProperty(e, t, {enumerable: !0, get: a})
    }, o.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: !0})
    }, o.t = function (e, t) {
        if (1 & t && (e = o(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var a = Object.create(null);
        if (o.r(a), Object.defineProperty(a, "default", {
            enumerable: !0,
            value: e
        }), 2 & t && "string" != typeof e) for (var i in e) o.d(a, i, function (t) {
            return e[t]
        }.bind(null, i));
        return a
    }, o.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return o.d(t, "a", t), t
    }, o.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, o.p = "", o(o.s = 4)
}({
    4: function (e, t) {
        layui.define(["laytpl", "laypage", "form"], (function (e) {
            var t = layui.jquery, o = layui.laytpl, a = layui.laypage, i = layui.form, r = "ew-datagrid-loading",
                n = "ew-datagrid-item", l = "ew-loading", d = "ew-more-end",
                c = {limit: 10, layout: ["prev", "page", "next", "skip", "count", "limit"]}, s = {
                    first: !0,
                    curr: 1,
                    limit: 10,
                    text: "加载更多",
                    loadingText: "加载中...",
                    noMoreText: "没有更多数据了~",
                    errorText: "加载失败，请重试"
                }, p = function (e) {
                    this.options = t.extend(!0, {
                        method: "GET",
                        request: {pageName: "page", limitName: "limit"},
                        useAdmin: !1,
                        showError: function (e) {
                            t(this.elem).empty()
                        },
                        showEmpty: function (e) {
                            t(this.elem).empty()
                        },
                        showLoading: function () {
                            t(this.elem).addClass(r)
                        },
                        hideLoading: function () {
                            t(this.elem).removeClass(r)
                        }
                    }, e), e.page && (this.options.page = t.extend({}, c, !0 === e.page ? {} : e.page)), e.loadMore && (this.options.loadMore = t.extend({}, s, !0 === e.loadMore ? {} : e.loadMore)), "string" == typeof this.options.data && (this.options.url = this.options.data, this.options.data = void 0), this.init(), this.bindEvents()
                };
            p.prototype.init = function () {
                var e = this, o = this.options, a = this.getComponents();
                if ("static" === a.$elem.css("position") && a.$elem.css("position", "relative"), o.checkAllElem) {
                    var r = a.$checkAll.find('input[lay-filter="' + a.checkAllFilter + '"]');
                    r.next(".layui-form-checkbox").remove(), r.remove(), a.$checkAll.append(['<input type="checkbox"', ' lay-filter="', a.checkAllFilter, '"', ' lay-skin="primary" class="ew-datagrid-checkbox" />'].join("")), a.$checkAll.hasClass("layui-form") || a.$checkAll.addClass("layui-form"), a.$checkAll.attr("lay-filter") || a.$checkAll.attr("lay-filter", o.checkAllElem.substring(1)), i.render("checkbox", a.$checkAll.attr("lay-filter"))
                }
                o.url ? o.reqData = function (e, a) {
                    o.where || (o.where = {}), o.where[o.request.pageName] = e.page, o.where[o.request.limitName] = e.limit, (o.useAdmin ? layui.admin : t).ajax({
                        url: o.url,
                        data: o.contentType && 0 === o.contentType.indexOf("application/json") ? JSON.stringify(o.where) : o.where,
                        headers: o.headers,
                        type: o.method,
                        dataType: "json",
                        contentType: o.contentType,
                        success: function (e) {
                            a(o.parseData ? o.parseData(e) : e)
                        },
                        error: function (e) {
                            a({code: e.status, msg: e.statusText, xhr: e})
                        }
                    })
                } : o.data && (o.reqData = void 0, o.loadMore ? (e.renderLoadMore(), e.changeLoadMore(2), e.renderBody(o.data, 0, !1, !0), o.done && o.done(o.data, 1, o.data.length)) : o.page ? (o.page.count = o.data.length, o.page.jump = function (t, a) {
                    o.showLoading();
                    var i = (t.curr - 1) * o.page.limit, r = i + o.page.limit;
                    r > o.data.length && (r = o.data.length);
                    for (var n = [], l = i; l < r; l++) n.push(o.data[l]);
                    o.page.data = n, e.renderBody(n, (t.curr - 1) * t.limit, !1, !0), o.hideLoading(), 0 === o.data.length && o.showEmpty && o.showEmpty({}), o.done && o.done(n, t.curr, t.count)
                }, e.renderPage()) : (e.renderBody(o.data, 0, !1, !0), 0 === o.data.length && o.showEmpty && o.showEmpty({}), o.done && o.done(o.data, 1, o.data.length))), o.reqData && (o.loadMore ? e.renderLoadMore().click((function () {
                    t(this).hasClass(l) || (o.loadMore.first ? o.loadMore.first = !1 : o.loadMore.curr++, e.changeLoadMore(1), o.reqData({
                        page: o.loadMore.curr,
                        limit: o.loadMore.limit
                    }, (function (t) {
                        if (0 != t.code) return e.changeLoadMore(3), void o.loadMore.curr--;
                        e.changeLoadMore(0), e.renderBody(t.data, (o.loadMore.curr - 1) * o.loadMore.limit, 1 !== o.loadMore.curr), o.done && o.done(t.data, o.loadMore.curr, t.count || t.data.length), (!t.data || t.data.length < o.loadMore.limit) && e.changeLoadMore(2)
                    })))
                })).trigger("click") : o.page ? (o.showLoading(), o.reqData({
                    page: 1,
                    limit: o.page.limit
                }, (function (t) {
                    return o.hideLoading(), "string" != typeof t && t.data ? 0 === t.data.length ? o.showEmpty && o.showEmpty(t) : (o.page.count = t.count, o.page.jump = function (t, a) {
                        a || (o.showLoading(), o.reqData({page: t.curr, limit: t.limit}, (function (a) {
                            return o.hideLoading(), "string" != typeof a && a.data ? 0 === a.data.length ? o.showEmpty && o.showEmpty(a) : (e.renderBody(a.data, (t.curr - 1) * t.limit), void (o.done && o.done(a.data, t.curr, t.count))) : o.showError && o.showError(a)
                        })))
                    }, e.renderPage(), e.renderBody(t.data), void (o.done && o.done(t.data, 1, t.count))) : o.showError && o.showError(t)
                }))) : (o.showLoading(), o.reqData({}, (function (t) {
                    return o.hideLoading(), 0 != t.code ? o.showError && o.showError(t) : t.data && 0 !== t.data.length ? (e.renderBody(t.data), void (o.done && o.done(t.data, 1, t.data.length))) : o.showEmpty && o.showEmpty(t)
                }))))
            }, p.prototype.bindEvents = function () {
                var e = this, o = this.getComponents(), a = function (o) {
                    var a = t(this);
                    if (!a.hasClass(n)) {
                        var i = a.parent("." + n);
                        a = i.length > 0 ? i : a.parentsUntil("." + n).last().parent()
                    }
                    var r = a.data("index"), l = {
                        elem: a, data: e.getData(r), index: r, del: function () {
                            e.del(r)
                        }, update: function (t, o) {
                            e.update(r, t, o)
                        }
                    };
                    return t.extend(l, o)
                };
                o.$elem.off("click.item").on("click.item", ">." + n, (function () {
                    layui.event.call(this, "DataGrid", "item(" + o.filter + ")", a.call(this, {}))
                })), o.$elem.off("dblclick.itemDouble").on("click.itemDouble", ">." + n, (function () {
                    layui.event.call(this, "DataGrid", "itemDouble(" + o.filter + ")", a.call(this, {}))
                })), o.$elem.off("click.tool").on("click.tool", "[lay-event]", (function (e) {
                    layui.stope(e);
                    var i = t(this);
                    layui.event.call(this, "DataGrid", "tool(" + o.filter + ")", a.call(this, {event: i.attr("lay-event")}))
                })), i.on("radio(" + o.radioFilter + ")", (function (t) {
                    var a = e.getData(t.value);
                    a.LAY_CHECKED = !0, layui.event.call(this, "DataGrid", "checkbox(" + o.filter + ")", {
                        checked: !0,
                        data: a
                    })
                })), i.on("checkbox(" + o.checkboxFilter + ")", (function (t) {
                    var a = t.elem.checked, i = e.getData(t.value);
                    i.LAY_CHECKED = a, e.checkChooseAllCB(), layui.event.call(this, "DataGrid", "checkbox(" + o.filter + ")", {
                        checked: a,
                        data: i
                    })
                })), i.on("checkbox(" + o.checkAllFilter + ")", (function (a) {
                    var i = a.elem.checked, r = t(a.elem), n = r.next(".layui-form-checkbox");
                    if (!e.options.data || e.options.data.length <= 0) return r.prop("checked", !1), void n.removeClass("layui-form-checked");
                    o.$elem.find('input[name="' + o.checkboxFilter + '"]').each((function () {
                        var e = t(this);
                        e.prop("checked", i);
                        var o = e.next(".layui-form-checkbox");
                        i ? o.addClass("layui-form-checked") : o.removeClass("layui-form-checked")
                    }));
                    for (var l = 0; l < e.options.data.length; l++) e.options.data[l].LAY_CHECKED = i;
                    layui.event.call(this, "DataGrid", "checkbox(" + o.filter + ")", {checked: i, type: "all"})
                }))
            }, p.prototype.getComponents = function () {
                var e = t(this.options.elem), o = e.attr("lay-filter");
                return o || (o = this.options.elem.substring(1), e.attr("lay-filter", o)), {
                    $elem: e,
                    templetHtml: t(this.options.templet).html(),
                    $page: this.options.page && this.options.page.elem ? t("#" + this.options.page.elem) : void 0,
                    $loadMore: this.options.loadMore && this.options.loadMore.elem ? t("#" + this.options.loadMore.elem) : void 0,
                    filter: o,
                    checkboxFilter: "ew_tb_checkbox_" + o,
                    radioFilter: "ew_tb_radio_" + o,
                    checkAllFilter: "ew_tb_checkbox_all_" + o,
                    $checkAll: t(this.options.checkAllElem)
                }
            }, p.prototype.renderBody = function (e, t, a, r) {
                e || (e = []);
                var n = this.options, l = this.getComponents();
                t || (t = 0);
                for (var d = [], c = 0; c < e.length; c++) {
                    var s = e[c];
                    if (s.LAY_INDEX = c, s.LAY_NUMBER = c + t + 1, s.LAY_CHECKBOX_ELEM = ['<input type="checkbox" lay-skin="primary"', ' name="', l.checkboxFilter, '"', ' lay-filter="', l.checkboxFilter, '"', s.LAY_CHECKED ? ' checked="checked"' : "", ' class="ew-datagrid-checkbox"', ' value="' + c + '" />'].join(""), s.LAY_RADIO_ELEM = ['<input type="radio"', ' name="', l.radioFilter, '"', ' lay-filter="', l.radioFilter, '"', s.LAY_CHECKED ? ' checked="checked"' : "", ' class="ew-datagrid-radio"', ' value="', c, '" />'].join(""), void 0 === l.templetHtml) return console.error("DataGrid Error: Template [" + n.templet + "] not found");
                    o(l.templetHtml).render(s, (function (e) {
                        d.push(e)
                    }))
                }
                a ? (r || (n.data = n.data.concat(e)), l.$elem.append(d.join(""))) : (r || (n.data = e), l.$elem.html(d.join(""))), this.initChildren(t), i.render("checkbox", l.filter), i.render("radio", l.filter), this.checkChooseAllCB()
            }, p.prototype.initChildren = function (e) {
                e && this.options.page && this.options.page.data || (e = 0), this.getComponents().$elem.children().each((function (o) {
                    var a = t(this);
                    a.attr("data-index", o), a.attr("data-number", o + e + 1), a.addClass(n)
                }))
            }, p.prototype.renderPage = function () {
                var e = this.options, t = this.getComponents();
                t.$elem.next(".ew-datagrid-page,.ew-datagrid-loadmore").remove(), e.page.elem = "ew-datagrid-page-" + e.elem.substring(1), t.$elem.after('<div class="ew-datagrid-page ' + (e.page.class || "") + '" id="' + e.page.elem + '"></div>'), a.render(e.page)
            }, p.prototype.renderLoadMore = function () {
                var e = this.options, t = this.getComponents();
                return t.$elem.next(".ew-datagrid-page,.ew-datagrid-loadmore").remove(), e.loadMore.elem = "ew-datagrid-page-" + e.elem.substring(1), t.$elem.after(['<div id="', e.loadMore.elem, '" ', 'class="ew-datagrid-loadmore ', e.loadMore.class || "", '">', "   <div>", '      <span class="ew-icon-loading">', '         <i class="layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate layui-anim-loop"></i>', "      </span>", '      <span class="ew-loadmore-text">', e.loadMore.text, "</span>", "   </div>", "</div>"].join("")), t.$elem.next()
            }, p.prototype.changeLoadMore = function (e) {
                var t = this.options, o = this.getComponents(), a = o.$loadMore.find(".ew-loadmore-text");
                o.$loadMore.removeClass(l + " " + d), 0 === e ? a.html(t.loadMore.text) : 1 === e ? (a.html(t.loadMore.loadingText), o.$loadMore.addClass(l)) : 2 === e ? (a.html(t.loadMore.noMoreText), o.$loadMore.addClass(d)) : a.html(t.loadMore.errorText)
            }, p.prototype.update = function (e, a, i) {
                var r = this, n = this.getComponents(), l = n.$elem.children('[data-index="' + e + '"]'),
                    d = l.data("number");
                d - e != 1 ? t.extend(!0, this.options.data[d - 1], a) : t.extend(!0, this.options.data[e], a), 2 !== i && o(n.templetHtml).render(r.getData(e), (function (o) {
                    if (1 === i) return l.html(t(o).html());
                    l.before(o).remove(), r.initChildren(d - e - 1)
                }))
            }, p.prototype.del = function (e) {
                var t = this.getComponents().$elem.children('[data-index="' + e + '"]'), o = t.data("number");
                t.remove(), o - e != 1 ? this.options.data.splice(o - 1, 1) : this.options.data.splice(e, 1), this.initChildren(o - e - 1)
            }, p.prototype.getData = function (e) {
                if (void 0 === e) return this.options.data;
                var t = this.getComponents().$elem.children('[data-index="' + e + '"]').data("number");
                return t - e != 1 ? this.options.data[t - 1] : this.options.data[e]
            }, p.prototype.checkStatus = function () {
                var e = this, o = this.getComponents(), a = o.checkboxFilter, i = o.radioFilter, r = [],
                    n = o.$elem.find('input[name="' + i + '"]');
                if (n.length > 0) {
                    var l = n.filter(":checked").val();
                    if (void 0 !== l) {
                        var d = e.getData(l);
                        d && r.push(d)
                    }
                } else o.$elem.find('input[name="' + a + '"]:checked').each((function () {
                    var o = t(this).val();
                    if (void 0 !== o) {
                        var a = e.getData(o);
                        a && r.push(a)
                    }
                }));
                return r
            }, p.prototype.checkChooseAllCB = function () {
                for (var e = this.getComponents(), t = e.$checkAll.find('input[lay-filter="' + e.checkAllFilter + '"]'), o = 0 !== this.options.data.length, a = 0; a < this.options.data.length; a++) if (!this.options.data[a].LAY_CHECKED) {
                    o = !1;
                    break
                }
                o ? (t.prop("checked", !0), t.next(".layui-form-checkbox").addClass("layui-form-checked")) : (t.prop("checked", !1), t.next(".layui-form-checkbox").removeClass("layui-form-checked"))
            }, p.prototype.reload = function (e) {
                e && (e.page ? (this.options.page ? e.page = t.extend({}, this.options.page, e.page) : e.page = t.extend({}, c, e.page), this.options.loadMore && (this.options.loadMore = void 0)) : e.loadMore && (this.options.loadMore ? e.loadMore = t.extend({}, this.options.loadMore, e.loadMore, {
                    first: !0,
                    curr: 1
                }) : e.loadMore = t.extend({}, s, e.loadMore), this.options.page && (this.options.page = void 0)), t.extend(!0, this.options, e)), this.init()
            };
            var h = {
                render: function (e) {
                    return e.onItemClick && h.onItemClick(e.elem, e.onItemClick), e.onToolBarClick && h.onToolBarClick(e.elem, e.onToolBarClick), new p(e)
                }, on: function (e, t) {
                    return layui.onevent.call(this, "DataGrid", e, t)
                }, onItemClick: function (e, t) {
                    return 0 === e.indexOf("#") && (e = e.substring(1)), h.on("item(" + e + ")", t)
                }, onToolBarClick: function (e, t) {
                    return 0 === e.indexOf("#") && (e = e.substring(1)), h.on("tool(" + e + ")", t)
                }
            };
            h.autoRender = function (e) {
                t(e || "[data-grid]").each((function () {
                    try {
                        var e = t(this), o = e.attr("id");
                        o || (o = "ew-datagrid-" + (t('[id^="ew-datagrid-"]').length + 1), e.attr("id", o));
                        var a = e.children("[data-grid-tpl]");
                        if (a.length > 0) {
                            a.attr("id", o + "-tpl"), e.after(a);
                            var i = function (e) {
                                if (e) try {
                                    return new Function("return " + e)()
                                } catch (t) {
                                    console.error("element property data- configuration item has a syntax error: " + e)
                                }
                            }(e.attr("lay-data"));
                            i.elem = "#" + o, i.templet = "#" + o + "-tpl", h.render(i)
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }))
            }, h.autoRender(), t("head").append(['<style id="ew-css-datagrid">', ".ew-datagrid-loadmore, .ew-datagrid-page {", "    text-align: center;", "}", ".ew-datagrid-loadmore {", "    color: #666;", "    cursor: pointer;", "}", ".ew-datagrid-loadmore > div {", "    padding: 12px;", "}", ".ew-datagrid-loadmore > div:hover {", "    background-color: rgba(0, 0, 0, .03);", "}", ".ew-datagrid-loadmore .ew-icon-loading {", "    margin-right: 6px;", "    display: none;", "}", ".ew-datagrid-loadmore.", d, " {", "    pointer-events: none;", "}", ".ew-datagrid-loadmore.", l, " .ew-icon-loading {", "    display: inline;", "}", ".", r, ":before {", '    content: "\\e63d";', "    font-family: layui-icon !important;", "    font-size: 32px;", "    color: #C3C3C3;", "    position: absolute;", "    left: 50%;", "    top: 50%;", "    margin-left: -16px;", "    margin-top: -16px;", "    z-index: 999;", "    -webkit-animatione: layui-rotate 1s linear;", "    animation: layui-rotate 1s linear;", "    -webkit-animation-iteration-count: infinite;", "    animation-iteration-count: infinite;", "}", ".ew-datagrid-checkbox + .layui-form-checkbox {", "   padding-left: 18px;", "}", ".ew-datagrid-radio + .layui-form-radio {", "   margin: 0;", "   padding: 0;", "   line-height: 22px;", "}", ".ew-datagrid-radio + .layui-form-radio .layui-icon {", "   margin-right: 0;", "}", "</style>"].join("")), e("dataGrid", h)
        }))
    }
});