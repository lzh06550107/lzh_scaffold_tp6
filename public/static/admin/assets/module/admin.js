layui.define(["layer"], function (exports) {
    var jquery = layui.jquery,
        layer = layui.layer,
        cache = layui.cache,
        n = ".layui-layout-admin>.layui-body",
        o = n + ">.layui-tab",
        l = ".layui-layout-admin>.layui-side>.layui-side-scroll",
        s = ".layui-layout-admin>.layui-header",

        admin = {
            version: "3.1.8",
            layerData: {},

            // 折叠/展开侧导航
            flexible: function (isExpand) { // 扩展或收缩侧边栏
                if (window !== top && !admin.isTop() && top.layui && top.layui.admin) return top.layui.admin.flexible(isExpand);
                var a = jquery(".layui-layout-admin"), has_mini_css = a.hasClass("admin-nav-mini");
                undefined === isExpand && (isExpand = has_mini_css);

                if(has_mini_css === isExpand) {
                    window.sideFlexTimer && clearTimeout(window.sideFlexTimer);
                    a.addClass("admin-side-flexible");
                    window.sideFlexTimer = setTimeout((function () {
                        a.removeClass("admin-side-flexible")
                    }), 600);

                    if(isExpand) {
                        admin.hideTableScrollBar();
                        a.removeClass("admin-nav-mini");
                    }else {
                        a.addClass("admin-nav-mini");
                    }

                    layui.event.call(this, "admin", "flexible({*})", {expand: isExpand});
                }

            },

            // 设置侧导航栏选中状态，参数为a标签的lay-href值
            activeNav: function (tabPosition) {
                if (window !== top && !admin.isTop() && top.layui && top.layui.admin) {
                    return top.layui.admin.activeNav(tabPosition);
                }
                if (!tabPosition) {
                    return console.warn("active url is null");
                }
                // 去除以前菜单项选中状态
                jquery(l + ">.layui-nav .layui-nav-item .layui-nav-child dd.layui-this").removeClass("layui-this");
                jquery(l + ">.layui-nav .layui-nav-item.layui-this").removeClass("layui-this");
                // 获取当前需要选中的菜单项
                var current_selected_item = jquery(l + '>.layui-nav a[lay-href="' + tabPosition + '"]');
                if (0 === current_selected_item.length) {
                    return console.warn(tabPosition + " not found");
                }
                var i = jquery(".layui-layout-admin").hasClass("admin-nav-mini");
                if ("_all" === jquery(l + ">.layui-nav").attr("lay-shrink")) {
                    var n = current_selected_item.parent("dd").parents(".layui-nav-child");
                    i || jquery(l + ">.layui-nav .layui-nav-itemed>.layui-nav-child").not(n).css("display", "block").slideUp("fast", (function () {
                        jquery(this).css("display", "")
                    }));
                    jquery(l + ">.layui-nav .layui-nav-itemed").not(n.parent()).removeClass("layui-nav-itemed");
                }
                // 选中当前菜单项父菜单
                current_selected_item.parent().addClass("layui-this");
                var o = current_selected_item.parent("dd").parents(".layui-nav-child").parent();
                if (!i) {
                    var c = o.not(".layui-nav-itemed").children(".layui-nav-child");
                    // 以滑动方式显示隐藏的元素
                    c.slideDown("fast", function () {
                        if (jquery(this).is(c.last())) {
                            c.css("display", "");
                            var e = current_selected_item.offset().top + current_selected_item.outerHeight() + 30 - admin.getPageHeight(),
                                i = 115 - current_selected_item.offset().top;

                            if(e > 0) {
                                jquery(l).animate({
                                    scrollTop: jquery(l).scrollTop() + e
                                }, 300);
                            }else if(i > 0){
                                jquery(l).animate({
                                    scrollTop: jquery(l).scrollTop() - i
                                }, 300);
                            }
                        }
                    });
                }
                o.addClass("layui-nav-itemed");
                jquery('ul[lay-filter="admin-side-nav"]').addClass("layui-hide");
                var d = current_selected_item.parents(".layui-nav");
                d.removeClass("layui-hide");
                // 选中当前菜单项
                jquery(s + ">.layui-nav>.layui-nav-item").removeClass("layui-this");
                jquery(s + '>.layui-nav>.layui-nav-item>a[nav-bind="' + d.attr("nav-id") + '"]').parent().addClass("layui-this");
            },

            // 打开右侧弹窗
            popupRight: function (option) {
                return option.anim = -1, option.offset = "r", option.move = false, option.fixed = true, undefined === option.area && (option.area = "336px"), undefined === option.title && (option.title = false), undefined === option.closeBtn && (option.closeBtn = false), undefined === option.shadeClose && (option.shadeClose = true), undefined === option.skin && (option.skin = "layui-anim layui-anim-rl layui-layer-adminRight"), admin.open(option)
            },

            // 打开弹窗
            open: function (option) {
                option.content && 2 === option.type && (option.url = undefined);
                !option.url || 2 !== option.type && undefined !== option.type || (option.type = 1);
                undefined === option.area && (option.area = 2 === option.type ? ["360px", "300px"] : "360px");
                undefined === option.offset && (option.offset = "70px");
                undefined === option.shade && (option.shade = .1);
                undefined === option.fixed && (option.fixed = false);
                undefined === option.resize && (option.resize = false);
                undefined === option.skin && (option.skin = "layui-layer-admin");
                var end_func = option.end;
                option.end = function () {
                    layer.closeAll("tips");
                    end_func && end_func();
                };
                if (option.url) {
                    var success_func = option.success;
                    option.success = function (layero, dIndex) {
                        jquery(layero).data("tpl", option.tpl || "");
                        admin.reloadLayer(dIndex, option.url, success_func);
                    }
                } else {
                    option.tpl && option.content && (option.content = admin.util.tpl(option.content, option.data, cache.tplOpen, cache.tplClose));
                }
                var index = layer.open(option);
                option.data && (admin.layerData["d" + index] = option.data);
                return index;
            },

            // 获取弹窗传递数据
            getLayerData: function (index, key) {
                if (undefined === index) return undefined === (index = parent.layer.getFrameIndex(window.name)) ? null : parent.layui.admin.getLayerData(parseInt(index), key);
                if (isNaN(index) && (index = admin.getLayerIndex(index)), undefined !== index) {
                    var a = admin.layerData["d" + index];
                    return key && a ? a[key] : a
                }
            },

            // 弹窗传递数据
            putLayerData: function (key, value, index) {
                if (undefined === index) return undefined === (index = parent.layer.getFrameIndex(window.name)) ? undefined : parent.layui.admin.putLayerData(key, value, parseInt(index));
                if (isNaN(index) && (index = admin.getLayerIndex(index)), undefined !== index) {
                    var i = admin.getLayerData(index);
                    i || (i = {}), i[key] = value, admin.layerData["d" + index] = i
                }
            },

            // 刷新url方式弹窗
            reloadLayer: function (index, url, success) {
                if ("function" == typeof url && (success = url, url = undefined), isNaN(index) && (index = admin.getLayerIndex(index)), undefined !== index) {
                    var o = jquery("#layui-layer" + index);
                    undefined === url && (url = o.data("url")), url && (o.data("url", url), admin.showLoading(o), admin.ajax({
                        url: url,
                        dataType: "html",
                        success: function (a) {
                            admin.removeLoading(o, false), "string" != typeof a && (a = JSON.stringify(a));
                            var l = o.data("tpl");
                            if (true === l || "true" === l) {
                                var s = admin.getLayerData(index) || {};
                                s.layerIndex = index;
                                var c = jquery("<div>" + a + "</div>"), d = {};
                                for (var u in c.find("script,[tpl-ignore]").each((function (e) {
                                    var a = jquery(this);
                                    d["temp_" + e] = a[0].outerHTML, a.after("${temp_" + e + "}").remove()
                                })), a = admin.util.tpl(c.html(), s, cache.tplOpen, cache.tplClose), d) a = a.replace("${" + u + "}", d[u])
                            }
                            o.children(".layui-layer-content").html(a), admin.renderTpl("#layui-layer" + index + " [ew-tpl]"), success && success(o[0], index)
                        }
                    }))
                }
            },

            alert: function (content, options, yes) {
                return "function" == typeof options && (yes = options, options = {}), undefined === options.skin && (options.skin = "layui-layer-admin"), undefined === options.shade && (options.shade = .1), layer.alert(content, options, yes)
            },

            confirm: function (content, options, yes, cancel) {
                return "function" == typeof options && (cancel = yes, yes = options, options = {}), undefined === options.skin && (options.skin = "layui-layer-admin"), undefined === options.shade && (options.shade = .1), layer.confirm(content, options, yes, cancel)
            },

            prompt: function (options, yes) {
                return "function" == typeof options && (yes = options, options = {}), undefined === options.skin && (options.skin = "layui-layer-admin layui-layer-prompt"), undefined === options.shade && (options.shade = .1), layer.prompt(options, yes)
            },

            // 封装ajax
            req: function (url, data, success, method, option) {
                "function" == typeof data && (option = method, method = success, success = data, data = {});
                undefined !== method && "string" != typeof method && (option = method, method = undefined);
                method || (method = "GET");
                "string" == typeof data ? (option || (option = {}), option.contentType || (option.contentType = "application/json;charset=UTF-8")) : cache.reqPutToPost && ("put" === method.toLowerCase() ? (method = "POST", data._method = "PUT") : "delete" === method.toLowerCase() && (method = "GET", data._method = "DELETE"));

                return admin.ajax(jquery.extend({
                    url: (cache.baseServer || "") + url,
                    data: data,
                    type: method,
                    dataType: "json",
                    success: success
                }, option));
            },

            // 封装ajax,同$.ajax
            ajax: function (option) {
                var a = admin.util.deepClone(option);
                option.dataType || (option.dataType = "json");
                option.headers || (option.headers = {});
                var headers = cache.getAjaxHeaders(option.url); // 在这个函数中配置需要自动传递的header
                if (headers) for (var i = 0; i < headers.length; i++) undefined === option.headers[headers[i].name] && (option.headers[headers[i].name] = headers[i].value);
                var l = option.success;

                option.success = function (n, o, s) {
                    // 在这个函数中请求完成后的数据
                    false !== cache.ajaxSuccessBefore(admin.parseJSON(n), option.url, {
                        param: a, reload: function (e) {
                            admin.ajax(jquery.extend(true, a, e))
                        }, update: function (e) {
                            n = e
                        }, xhr: s
                    }) ? l && l(n, o, s) : option.cancel && option.cancel()
                };

                option.error = function (t, a) {
                    option.success({code: t.status, msg: t.statusText}, a, t)
                };

                !layui.cache.version || cache.apiNoCache && "json" === option.dataType.toLowerCase() || (-1 === option.url.indexOf("?") ? option.url += "?v=" : option.url += "&v=", true === layui.cache.version ? option.url += (new Date).getTime() : option.url += layui.cache.version);
                return jquery.ajax(option);
            },

            parseJSON: function (e) {
                if ("string" == typeof e) try {
                    return JSON.parse(e)
                } catch (e) {
                }
                return e
            },

            // 显示加载动画
            showLoading: function (elem, type, opacity, size) {
                undefined === elem || "string" == typeof elem || elem instanceof jquery || (type = elem.type, opacity = elem.opacity, size = elem.size, elem = elem.elem), undefined === type && (type = cache.defaultLoading || 1), undefined === size && (size = "sm"), undefined === elem && (elem = "body");
                var l = ['<div class="ball-loader ' + size + '"><span></span><span></span><span></span><span></span></div>', '<div class="rubik-loader ' + size + '"></div>', '<div class="signal-loader ' + size + '"><span></span><span></span><span></span><span></span></div>', '<div class="layui-loader ' + size + '"><i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i></div>'];
                jquery(elem).addClass("page-no-scroll"), jquery(elem).scrollTop(0);
                var s = jquery(elem).children(".page-loading");
                s.length <= 0 && (jquery(elem).append('<div class="page-loading">' + l[type - 1] + "</div>"), s = jquery(elem).children(".page-loading")), undefined !== opacity && s.css("background-color", "rgba(255,255,255," + opacity + ")"), s.show()
            },

            // 移除加载动画
            removeLoading: function (elem, fade, del) {
                undefined === elem && (elem = "body");
                undefined === fade && (fade = true);
                var n = jquery(elem).children(".page-loading");
                del ? n.remove() : fade ? n.fadeOut("fast") : n.hide(), jquery(elem).removeClass("page-no-scroll")
            },

            // 缓存数据
            putTempData: function (key, value, local) {
                var tableName = local ? cache.tableName : cache.tableName + "_tempData";
                null == value ? local ? layui.data(tableName, {key: key, remove: true}) : layui.sessionData(tableName, {
                    key: key,
                    remove: true
                }) : local ? layui.data(tableName, {key: key, value: value}) : layui.sessionData(tableName, {key: key, value: value})
            },

            // 获取缓存数据
            getTempData: function (key, isLocalStorage) {
                if("boolean" == typeof key) {
                    isLocalStorage = key;
                    key = undefined;
                }
                var table_name = isLocalStorage ? cache.tableName : cache.tableName + "_tempData",
                    table_values = isLocalStorage ? layui.data(table_name) : layui.sessionData(table_name);

                if(key) {
                    if(table_values) {
                        return table_values[key];
                    } else {
                        return undefined;
                    }
                } else {
                    return table_values;
                }
            },

            // 滚动选项卡tab
            rollPage: function (direction) {
                if (window !== top && !admin.isTop() && top.layui && top.layui.admin) return top.layui.admin.rollPage(direction);
                var a = jquery(o + ">.layui-tab-title"), i = a.scrollLeft();
                if ("left" === direction) a.animate({scrollLeft: i - 120}, 100); else if ("auto" === direction) {
                    var n = 0;
                    a.children("li").each((function () {
                        if (jquery(this).hasClass("layui-this")) return false;
                        n += jquery(this).outerWidth()
                    })), a.animate({scrollLeft: n - 120}, 100)
                } else a.animate({scrollLeft: i + 120}, 100)
            },

            // 刷新指定Tab或当前Tab
            refresh: function (href_url, a) {
                if (window !== top && !admin.isTop() && top.layui && top.layui.admin) return top.layui.admin.refresh(href_url);
                var iframes;

                if (href_url) {
                    (!(iframes = jquery(o + '>.layui-tab-content>.layui-tab-item>.admin-iframe[lay-id="' + href_url + '"]')) || iframes.length <= 0) && (iframes = jquery(n + ">.admin-iframe"));
                } else {
                    (!(iframes = jquery(o + ">.layui-tab-content>.layui-tab-item.layui-show>.admin-iframe")) || iframes.length <= 0) && (iframes = jquery(n + ">div>.admin-iframe"));
                }

                if (!iframes || !iframes[0]) return console.warn(href_url + " is not found");
                try {

                    if (a && iframes[0].contentWindow.refreshTab) { // ??
                        iframes[0].contentWindow.refreshTab();
                    } else {
                        admin.showLoading({
                            elem: iframes.parent(),
                            size: ""
                        });
                        iframes[0].contentWindow.location.reload();
                    }

                } catch (e) {
                    console.warn(e);
                    iframes.attr("src", iframes.attr("src"));
                }
            },

            // 关闭url或当前选项卡
            closeThisTabs: function (href_url) {
                if (window !== top && !admin.isTop() && top.layui && top.layui.admin) return top.layui.admin.closeThisTabs(href_url);
                admin.closeTabOperNav();
                var i = jquery(o + ">.layui-tab-title");
                if (href_url) {
                    if (href_url === i.find("li").first().attr("lay-id")) return layer.msg("主页不能关闭", {icon: 2});
                    i.find('li[lay-id="' + href_url + '"]').find(".layui-tab-close").trigger("click")
                } else {
                    if (i.find("li").first().hasClass("layui-this")) return layer.msg("主页不能关闭", {icon: 2});
                    i.find("li.layui-this").find(".layui-tab-close").trigger("click")
                }
            },

            // 关闭除url外所有选项卡
            closeOtherTabs: function (href_url) {
                if (window !== top && !admin.isTop() && top.layui && top.layui.admin) return top.layui.admin.closeOtherTabs(href_url);
                href_url ? jquery(o + ">.layui-tab-title li:gt(0)").each((function () {
                    href_url !== jquery(this).attr("lay-id") && jquery(this).find(".layui-tab-close").trigger("click")
                })) : jquery(o + ">.layui-tab-title li:gt(0):not(.layui-this)").find(".layui-tab-close").trigger("click"), admin.closeTabOperNav()
            },

            // 关闭所有选项卡
            closeAllTabs: function () {
                if (window !== top && !admin.isTop() && top.layui && top.layui.admin) return top.layui.admin.closeAllTabs();
                jquery(o + ">.layui-tab-title li:gt(0)").find(".layui-tab-close").trigger("click"), jquery(o + ">.layui-tab-title li:eq(0)").trigger("click"), admin.closeTabOperNav()
            },

            closeTabOperNav: function () {
                if (window !== top && !admin.isTop() && top.layui && top.layui.admin) return top.layui.admin.closeTabOperNav();
                jquery(".layui-icon-down .layui-nav .layui-nav-child").removeClass("layui-show")
            },

            // 切换主题
            changeTheme: function (theme, win, noCache, noChild) {
                if (noCache || admin.putSetting("defaultTheme", theme), win || (win = top), admin.removeTheme(win), theme) try {
                    var n = win.layui.jquery("body");
                    n.addClass(theme), n.data("theme", theme)
                } catch (e) {
                }
                if (!noChild) for (var o = win.frames, l = 0; l < o.length; l++) admin.changeTheme(theme, o[l], true, false)
            },

            removeTheme: function (e) {
                e || (e = window);
                try {
                    var t = e.layui.jquery("body"), a = t.data("theme");
                    a && t.removeClass(a), t.removeData("theme")
                } catch (e) {
                }
            },

            // 关闭当前iframe弹窗
            closeThisDialog: function () {
                return admin.closeDialog()
            },

            // 关闭elem元素所在的页面层弹窗
            closeDialog: function (elem) {
                elem ? layer.close(admin.getLayerIndex(elem)) : parent.layer.close(parent.layer.getFrameIndex(window.name))
            },

            // 获取页面层弹窗index
            getLayerIndex: function (selector) {
                if (!selector) return parent.layer.getFrameIndex(window.name);
                var a = jquery(selector).parents(".layui-layer").first().attr("id");
                return a && a.length >= 11 ? a.substring(11) : undefined
            },

            // 让当前的iframe弹层自适应高度
            iframeAuto: function () {
                return parent.layer.iframeAuto(parent.layer.getFrameIndex(window.name))
            },

            // 获取浏览器高度
            getPageHeight: function () {
                return document.documentElement.clientHeight || document.body.clientHeight
            },

            // 获取浏览器宽度
            getPageWidth: function () {
                return document.documentElement.clientWidth || document.body.clientWidth
            },

            // 把弹窗自带按钮跟表单绑定一起
            modelForm: function (layero, btnFilter, formFilter) {
                var n = jquery(layero);
                n.addClass("layui-form"), formFilter && n.attr("lay-filter", formFilter);
                var o = n.find(".layui-layer-btn .layui-layer-btn0");
                o.attr("lay-submit", ""), o.attr("lay-filter", btnFilter)
            },

            // 设置按钮为加载状态
            btnLoading: function (elem, text, loading) {
                undefined !== text && "boolean" == typeof text && (loading = text, text = undefined), undefined === text && (text = "&nbsp;加载中"), undefined === loading && (loading = true);
                var n = jquery(elem);
                loading ? (n.addClass("ew-btn-loading"), n.prepend('<span class="ew-btn-loading-text"><i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>' + text + "</span>"), n.attr("disabled", "disabled").prop("disabled", true)) : (n.removeClass("ew-btn-loading"), n.children(".ew-btn-loading-text").remove(), n.removeProp("disabled").removeAttr("disabled"))
            },

            // 开启鼠标移入侧边栏自动展开
            openSideAutoExpand: function () {
                var e = jquery(".layui-layout-admin>.layui-side");
                e.off("mouseenter.openSideAutoExpand").on("mouseenter.openSideAutoExpand", (function () {
                    jquery(this).parent().hasClass("admin-nav-mini") && (admin.flexible(true), jquery(this).addClass("side-mini-hover"))
                })), e.off("mouseleave.openSideAutoExpand").on("mouseleave.openSideAutoExpand", (function () {
                    jquery(this).hasClass("side-mini-hover") && (admin.flexible(false), jquery(this).removeClass("side-mini-hover"))
                }))
            },

            // 开启鼠标移入单元格超出自动展开
            openCellAutoExpand: function () {
                var e = jquery("body");
                e.off("mouseenter.openCellAutoExpand").on("mouseenter.openCellAutoExpand", ".layui-table-view td", (function () {
                    jquery(this).find(".layui-table-grid-down").trigger("click")
                })), e.off("mouseleave.openCellAutoExpand").on("mouseleave.openCellAutoExpand", ".layui-table-tips>.layui-layer-content", (function () {
                    jquery(".layui-table-tips-c").trigger("click")
                }))
            },

            parseLayerOption: function (e) {
                for (var a in e) e.hasOwnProperty(a) && e[a] && -1 !== e[a].toString().indexOf(",") && (e[a] = e[a].toString().split(","));
                var i = {success: "layero,index", cancel: "index,layero", end: "", full: "", min: "", restore: ""};
                for (var n in i) if (i.hasOwnProperty(n) && e[n]) try {
                    /^[a-zA-Z_]+[a-zA-Z0-9_]+$/.test(e[n]) && (e[n] += "()"), e[n] = new Function(i[n], e[n])
                } catch (t) {
                    e[n] = undefined
                }
                return e.content && "string" == typeof e.content && 0 === e.content.indexOf("#") && (jquery(e.content).is("script") ? e.content = jquery(e.content).html() : e.content = jquery(e.content)), undefined === e.type && undefined === e.url && (e.type = 2), e
            },

            // 字符的parent.parent转对象
            strToWin: function (win_str) { // 窗口名称字符串，转换为窗口对象
                var t = window;
                if (!win_str) return t;
                for (var a = win_str.split("."), i = 0; i < a.length; i++) t = t[a[i]];
                return t
            },

            hideTableScrollBar: function (e) {
                if (!(admin.getPageWidth() <= 768)) {
                    if (!e) {
                        var a = jquery(o + ">.layui-tab-content>.layui-tab-item.layui-show>.admin-iframe");
                        a.length <= 0 && (a = jquery(n + ">div>.admin-iframe")), a.length > 0 && (e = a[0].contentWindow)
                    }
                    try {
                        window.hsbTimer && clearTimeout(window.hsbTimer), e.layui.jquery(".layui-table-body.layui-table-main").addClass("no-scrollbar"), window.hsbTimer = setTimeout((function () {
                            e.layui.jquery(".layui-table-body.layui-table-main").removeClass("no-scrollbar")
                        }), 800)
                    } catch (e) {
                    }
                }
            },

            isTop: function () { // 判断是否是顶层窗口
                return jquery(n).length > 0
            }
        };

    admin.events = {
        // 折叠侧导航
        flexible: function () {
            admin.strToWin(jquery(this).data("window")).layui.admin.flexible();
        },

        // 刷新主体部分
        refresh: function () {
            admin.strToWin(jquery(this).data("window")).layui.admin.refresh();
        },

        // 浏览器后退
        back: function () {
            admin.strToWin(jquery(this).data("window")).history.back();
        },

        // 打开主题设置弹窗
        theme: function () {
            var e = admin.util.deepClone(jquery(this).data());
            admin.strToWin(e.window).layui.admin.popupRight(jquery.extend({
                id: "layer-theme",
                url: e.url || "/static/admin/assets/libs/templets/tpl-theme.html"
            }, admin.parseLayerOption(e)));
        },

        // 打开便签弹窗
        note: function () {
            var e = admin.util.deepClone(jquery(this).data());
            admin.strToWin(e.window).layui.admin.popupRight(jquery.extend({
                id: "layer-note",
                url: e.url || "/static/admin/assets/libs/templets/tpl-note.html"
            }, admin.parseLayerOption(e)));
        },

        // 打开消息弹窗
        message: function () {
            var e = admin.util.deepClone(jquery(this).data());
            admin.strToWin(e.window).layui.admin.popupRight(jquery.extend({
                id: "layer-notice",
                url: e.url || "/static/admin/assets/libs/templets/tpl-message.html"
            }, admin.parseLayerOption(e)));
        },

        // 打开修改密码弹窗
        psw: function () {
            var e = admin.util.deepClone(jquery(this).data());
            admin.strToWin(e.window).layui.admin.open(jquery.extend({
                id: "layer-psw",
                title: "修改密码",
                shade: 0,
                url: e.url || "/static/admin/assets/libs/templets/tpl-password.html"
            }, admin.parseLayerOption(e)))
        },

        // 退出登录
        logout: function () {
            var e = admin.util.deepClone(jquery(this).data());

            function n() {
                if (e.ajax) {
                    var t = layer.load(2);
                    admin.req(e.ajax, (function (n) {
                        if (layer.close(t), e.parseData) try {
                            n = new Function("res", e.parseData)(n)
                        } catch (e) {
                            console.error(e)
                        }
                        n.code == (e.code || 0) ? (cache.removeToken && cache.removeToken(), location.replace(e.url || "/")) : layer.msg(n.msg, {icon: 2})
                    }), e.method || "delete")
                } else cache.removeToken && cache.removeToken(), location.replace(e.url || "/")
            }

            if (admin.unlockScreen(), false === e.confirm || "false" === e.confirm) return n();
            admin.strToWin(e.window).layui.layer.confirm(e.content || "确定要退出登录吗？", jquery.extend({
                title: "温馨提示",
                skin: "layui-layer-admin",
                shade: .1
            }, admin.parseLayerOption(e)), (function () {
                n()
            }))
        },

        // 打开弹窗
        open: function () {
            var e = admin.util.deepClone(jquery(this).data());
            admin.strToWin(e.window).layui.admin.open(admin.parseLayerOption(e))
        },

        // 打开右侧弹窗
        popupRight: function () {
            var e = admin.util.deepClone(jquery(this).data());
            admin.strToWin(e.window).layui.admin.popupRight(admin.parseLayerOption(e))
        },

        // 全屏切换
        fullScreen: function () {
            var e = "layui-icon-screen-full", a = "layui-icon-screen-restore", i = jquery(this).find("i");
            if (document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || false) {
                var n = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
                if (n) n.call(document); else if (window.ActiveXObject) {
                    var o = new ActiveXObject("WScript.Shell");
                    o && o.SendKeys("{F11}")
                }
                i.addClass(e).removeClass(a)
            } else {
                var l = document.documentElement,
                    s = l.requestFullscreen || l.webkitRequestFullscreen || l.mozRequestFullScreen || l.msRequestFullscreen;
                if (s) s.call(l); else if (window.ActiveXObject) {
                    var r = new ActiveXObject("WScript.Shell");
                    r && r.SendKeys("{F11}")
                }
                i.addClass(a).removeClass(e)
            }
        },

        // 左滚动选项卡
        leftPage: function () {
            admin.strToWin(jquery(this).data("window")).layui.admin.rollPage("left")
        },

        // 右滚动选项卡
        rightPage: function () {
            admin.strToWin(jquery(this).data("window")).layui.admin.rollPage()
        },

        // 关闭当前选项卡
        closeThisTabs: function () {
            var e = jquery(this).data("url");
            admin.strToWin(jquery(this).data("window")).layui.admin.closeThisTabs(e)
        },

        // 关闭其它选项卡
        closeOtherTabs: function () {
            admin.strToWin(jquery(this).data("window")).layui.admin.closeOtherTabs()
        },

        // 关闭全部选项卡
        closeAllTabs: function () {
            admin.strToWin(jquery(this).data("window")).layui.admin.closeAllTabs()
        },

        // 关闭当前弹窗(智能)
        closeDialog: function () {
            jquery(this).parents(".layui-layer").length > 0 ? admin.closeDialog(this) : admin.closeDialog()
        },

        // 关闭当前iframe层弹窗
        closeIframeDialog: function () {
            admin.closeDialog()
        },

        // 关闭当前页面层弹窗
        closePageDialog: function () {
            admin.closeDialog(this)
        },

        // 锁屏
        lockScreen: function () {
            admin.strToWin(jquery(this).data("window")).layui.admin.lockScreen(jquery(this).data("url"))
        }
    };

    // 地图选择位置
    admin.chooseLocation = function (option) {
        var i = option.title, n = option.onSelect, o = option.needCity, l = option.center, s = option.defaultZoom, c = option.pointZoom,
            d = option.keywords, u = option.pageSize, p = option.mapJsUrl;
        undefined === i && (i = "选择位置"), undefined === s && (s = 11), undefined === c && (c = 17), undefined === d && (d = ""), undefined === u && (u = 30), undefined === p && (p = "https://webapi.amap.com/maps?v=1.4.14&key=006d995d433058322319fa797f2876f5");
        var y, m = false, f = function (e, a) {
                AMap.service(["AMap.PlaceSearch"], (function () {
                    var i = new AMap.PlaceSearch({type: "", pageSize: u, pageIndex: 1}), n = [a, e];
                    i.searchNearBy(d, n, 1e3, (function (e, a) {
                        if ("complete" === e) {
                            for (var i = a.poiList.pois, n = "", o = 0; o < i.length; o++) {
                                var l = i[o];
                                undefined !== l.location && (n += '<div data-lng="' + l.location.lng + '" data-lat="' + l.location.lat + '" class="ew-map-select-search-list-item">', n += '     <div class="ew-map-select-search-list-item-title">' + l.name + "</div>", n += '     <div class="ew-map-select-search-list-item-address">' + l.address + "</div>", n += '     <div class="ew-map-select-search-list-item-icon-ok layui-hide"><i class="layui-icon layui-icon-ok-circle"></i></div>', n += "</div>")
                            }
                            jquery("#ew-map-select-pois").html(n)
                        }
                    }))
                }))
            }, 
            
            v = function () {
                var e = {resizeEnable: true, zoom: s};
                l && (e.center = l);
                var i = new AMap.Map("ew-map-select-map", e);
                i.on("complete", (function () {
                    var e = i.getCenter();
                    f(e.lat, e.lng)
                })), i.on("moveend", (function () {
                    if (m) m = false; else {
                        jquery("#ew-map-select-tips").addClass("layui-hide"), jquery("#ew-map-select-center-img").removeClass("bounceInDown"), setTimeout((function () {
                            jquery("#ew-map-select-center-img").addClass("bounceInDown")
                        }));
                        var e = i.getCenter();
                        f(e.lat, e.lng)
                    }
                })), jquery("#ew-map-select-pois").off("click").on("click", ".ew-map-select-search-list-item", (function () {
                    jquery("#ew-map-select-tips").addClass("layui-hide"), jquery("#ew-map-select-pois .ew-map-select-search-list-item-icon-ok").addClass("layui-hide"), jquery(this).find(".ew-map-select-search-list-item-icon-ok").removeClass("layui-hide"), jquery("#ew-map-select-center-img").removeClass("bounceInDown"), setTimeout((function () {
                        jquery("#ew-map-select-center-img").addClass("bounceInDown")
                    }));
                    var e = jquery(this).data("lng"), a = jquery(this).data("lat"),
                        n = jquery(this).find(".ew-map-select-search-list-item-title").text(),
                        o = jquery(this).find(".ew-map-select-search-list-item-address").text();
                    y = {name: n, address: o, lat: a, lng: e}, m = true, i.setZoomAndCenter(c, [e, a])
                })), jquery("#ew-map-select-btn-ok").click((function () {
                    if (undefined === y) layer.msg("请点击位置列表选择", {icon: 2, anim: 6}); else if (n) if (o) {
                        var e = layer.load(2);
                        i.setCenter([y.lng, y.lat]), i.getCity((function (t) {
                            layer.close(e), y.city = t, admin.closeDialog("#ew-map-select-btn-ok"), n(y)
                        }))
                    } else admin.closeDialog("#ew-map-select-btn-ok"), n(y); else admin.closeDialog("#ew-map-select-btn-ok")
                }));
                var d = jquery("#ew-map-select-input-search");
                d.off("input").on("input", (function () {
                    var e = jquery(this).val(), a = jquery("#ew-map-select-tips");
                    e || (a.html(""), a.addClass("layui-hide")), AMap.plugin("AMap.Autocomplete", (function () {
                        new AMap.Autocomplete({city: "全国"}).search(e, (function (e, i) {
                            if (i.tips) {
                                for (var n = i.tips, o = "", l = 0; l < n.length; l++) {
                                    var s = n[l];
                                    undefined !== s.location && (o += '<div data-lng="' + s.location.lng + '" data-lat="' + s.location.lat + '" class="ew-map-select-search-list-item">', o += '     <div class="ew-map-select-search-list-item-icon-search"><i class="layui-icon layui-icon-search"></i></div>', o += '     <div class="ew-map-select-search-list-item-title">' + s.name + "</div>", o += '     <div class="ew-map-select-search-list-item-address">' + s.address + "</div>", o += "</div>")
                                }
                                a.html(o), 0 === n.length ? jquery("#ew-map-select-tips").addClass("layui-hide") : jquery("#ew-map-select-tips").removeClass("layui-hide")
                            } else a.html(""), a.addClass("layui-hide")
                        }))
                    }))
                })), d.off("blur").on("blur", (function () {
                    var e = jquery(this).val(), a = jquery("#ew-map-select-tips");
                    e || (a.html(""), a.addClass("layui-hide"))
                })), d.off("focus").on("focus", (function () {
                    jquery(this).val() && jquery("#ew-map-select-tips").removeClass("layui-hide")
                })), jquery("#ew-map-select-tips").off("click").on("click", ".ew-map-select-search-list-item", (function () {
                    jquery("#ew-map-select-tips").addClass("layui-hide");
                    var e = jquery(this).data("lng"), a = jquery(this).data("lat");
                    y = undefined, i.setZoomAndCenter(c, [e, a])
                }))
            },
            h = ['<div class="ew-map-select-tool" style="position: relative;">', '     搜索：<input id="ew-map-select-input-search" class="layui-input icon-search inline-block" style="width: 190px;" placeholder="输入关键字搜索" autocomplete="off" />', '     <button id="ew-map-select-btn-ok" class="layui-btn icon-btn pull-right" type="button"><i class="layui-icon">&#xe605;</i>确定</button>', '     <div id="ew-map-select-tips" class="ew-map-select-search-list layui-hide">', "     </div>", "</div>", '<div class="layui-row ew-map-select">', '     <div class="layui-col-sm7 ew-map-select-map-group" style="position: relative;">', '          <div id="ew-map-select-map"></div>', '          <i id="ew-map-select-center-img2" class="layui-icon layui-icon-add-1"></i>', '          <img id="ew-map-select-center-img" src="https://3gimg.qq.com/lightmap/components/locationPicker2/image/marker.png" alt=""/>', "     </div>", '     <div id="ew-map-select-pois" class="layui-col-sm5 ew-map-select-search-list">', "     </div>", "</div>"].join("");
        admin.open({
            id: "ew-map-select", type: 1, title: i, area: "750px", content: h, success: function (e, a) {
                var i = jquery(e).children(".layui-layer-content");
                i.css("overflow", "visible"), admin.showLoading(i), undefined === window.AMap ? jquery.getScript(p, (function () {
                    v(), admin.removeLoading(i)
                })) : (v(), admin.removeLoading(i))
            }
        });
    };

    // 裁剪图片
    admin.cropImg = function (option) {
        var i = "image/jpeg", n = option.aspectRatio, o = option.imgSrc, l = option.imgType, s = option.onCrop, c = option.limitSize,
            d = option.acceptMime, u = option.exts, p = option.title;
        undefined === n && (n = 1), undefined === p && (p = "裁剪图片"), l && (i = l), layui.use(["Cropper", "upload"], (function () {
            var e = layui.Cropper, l = layui.upload;
            var y = ['<div class="layui-row">', '     <div class="layui-col-sm8" style="min-height: 9rem;">', '          <img id="ew-crop-img" src="', o || "", '" style="max-width:100%;" alt=""/>', "     </div>", '     <div class="layui-col-sm4 layui-hide-xs" style="padding: 15px;text-align: center;">', '          <div id="ew-crop-img-preview" style="width: 100%;height: 9rem;overflow: hidden;display: inline-block;border: 1px solid #dddddd;"></div>', "     </div>", "</div>", '<div class="text-center ew-crop-tool" style="padding: 15px 10px 5px 0;">', '     <div class="layui-btn-group" style="margin-bottom: 10px;margin-left: 10px;">', '          <button title="放大" data-method="zoom" data-option="0.1" class="layui-btn icon-btn" type="button"><i class="layui-icon layui-icon-add-1"></i></button>', '          <button title="缩小" data-method="zoom" data-option="-0.1" class="layui-btn icon-btn" type="button"><span style="display: inline-block;width: 12px;height: 2.5px;background: rgba(255, 255, 255, 0.9);vertical-align: middle;margin: 0 4px;"></span></button>', "     </div>", '     <div class="layui-btn-group layui-hide-xs" style="margin-bottom: 10px;">', '          <button title="向左旋转" data-method="rotate" data-option="-45" class="layui-btn icon-btn" type="button"><i class="layui-icon layui-icon-refresh-1" style="transform: rotateY(180deg) rotate(40deg);display: inline-block;"></i></button>', '          <button title="向右旋转" data-method="rotate" data-option="45" class="layui-btn icon-btn" type="button"><i class="layui-icon layui-icon-refresh-1" style="transform: rotate(30deg);display: inline-block;"></i></button>', "     </div>", '     <div class="layui-btn-group" style="margin-bottom: 10px;">', '          <button title="左移" data-method="move" data-option="-10" data-second-option="0" class="layui-btn icon-btn" type="button"><i class="layui-icon layui-icon-left"></i></button>', '          <button title="右移" data-method="move" data-option="10" data-second-option="0" class="layui-btn icon-btn" type="button"><i class="layui-icon layui-icon-right"></i></button>', '          <button title="上移" data-method="move" data-option="0" data-second-option="-10" class="layui-btn icon-btn" type="button"><i class="layui-icon layui-icon-up"></i></button>', '          <button title="下移" data-method="move" data-option="0" data-second-option="10" class="layui-btn icon-btn" type="button"><i class="layui-icon layui-icon-down"></i></button>', "     </div>", '     <div class="layui-btn-group" style="margin-bottom: 10px;">', '          <button title="左右翻转" data-method="scaleX" data-option="-1" class="layui-btn icon-btn" type="button" style="position: relative;width: 41px;"><i class="layui-icon layui-icon-triangle-r" style="position: absolute;left: 9px;top: 0;transform: rotateY(180deg);font-size: 16px;"></i><i class="layui-icon layui-icon-triangle-r" style="position: absolute; right: 3px; top: 0;font-size: 16px;"></i></button>', '          <button title="上下翻转" data-method="scaleY" data-option="-1" class="layui-btn icon-btn" type="button" style="position: relative;width: 41px;"><i class="layui-icon layui-icon-triangle-d" style="position: absolute;left: 11px;top: 6px;transform: rotateX(180deg);line-height: normal;font-size: 16px;"></i><i class="layui-icon layui-icon-triangle-d" style="position: absolute; left: 11px; top: 14px;line-height: normal;font-size: 16px;"></i></button>', "     </div>", '     <div class="layui-btn-group" style="margin-bottom: 10px;">', '          <button title="重新开始" data-method="reset" class="layui-btn icon-btn" type="button"><i class="layui-icon layui-icon-refresh"></i></button>', '          <button title="选择图片" id="ew-crop-img-upload" class="layui-btn icon-btn" type="button" style="border-radius: 0 2px 2px 0;"><i class="layui-icon layui-icon-upload-drag"></i></button>', "     </div>", '     <button data-method="getCroppedCanvas" data-option="{ &quot;maxWidth&quot;: 4096, &quot;maxHeight&quot;: 4096 }" class="layui-btn icon-btn" type="button" style="margin-left: 10px;margin-bottom: 10px;"><i class="layui-icon">&#xe605;</i>完成</button>', "</div>"].join("");
            admin.open({
                title: p, area: "665px", type: 1, content: y, success: function (p, y) {
                    jquery(p).children(".layui-layer-content").css("overflow", "visible"), function p() {
                        var y, m = jquery("#ew-crop-img"), f = {
                            elem: "#ew-crop-img-upload", auto: false, drag: false, choose: function (t) {
                                t.preview((function (t, a, n) {
                                    i = a.type, m.attr("src", n), o && y ? (y.destroy(), y = new e(m[0], v)) : (o = n, p())
                                }))
                            }
                        };
                        if (undefined !== c && (f.size = c), undefined !== d && (f.acceptMime = d), undefined !== u && (f.exts = u), l.render(f), !o) return jquery("#ew-crop-img-upload").trigger("click");
                        var v = {aspectRatio: n, preview: "#ew-crop-img-preview"};
                        y = new e(m[0], v), jquery(".ew-crop-tool").on("click", "[data-method]", (function () {
                            var e, n, o = jquery(this).data();
                            if (y && o.method) {
                                switch (o = jquery.extend({}, o), e = y.cropped, o.method) {
                                    case"rotate":
                                        e && v.viewMode > 0 && y.clear();
                                        break;
                                    case"getCroppedCanvas":
                                        "image/jpeg" === i && (o.option || (o.option = {}), o.option.fillColor = "#fff")
                                }
                                switch (n = y[o.method](o.option, o.secondOption), o.method) {
                                    case"rotate":
                                        e && v.viewMode > 0 && y.crop();
                                        break;
                                    case"scaleX":
                                    case"scaleY":
                                        jquery(this).data("option", -o.option);
                                        break;
                                    case"getCroppedCanvas":
                                        n ? (s && s(n.toDataURL(i)), admin.closeDialog("#ew-crop-img")) : layer.msg("裁剪失败", {
                                            icon: 2,
                                            anim: 6
                                        })
                                }
                            }
                        }))
                    }()
                }
            })
        }))
    };
    
    admin.util = {
        // 百度地图坐标转高德地图坐标
        Convert_BD09_To_GCJ02: function (point) {
            var t = 52.35987755982988, a = point.lng - .0065, i = point.lat - .006,
                n = Math.sqrt(a * a + i * i) - 2e-5 * Math.sin(i * t),
                o = Math.atan2(i, a) - 3e-6 * Math.cos(a * t);
            return {lng: n * Math.cos(o), lat: n * Math.sin(o)}
        },

        // 高德地图坐标转百度地图坐标
        Convert_GCJ02_To_BD09: function (point) {
            var t = 52.35987755982988, a = point.lng, i = point.lat, n = Math.sqrt(a * a + i * i) + 2e-5 * Math.sin(i * t),
                o = Math.atan2(i, a) + 3e-6 * Math.cos(a * t);
            return {lng: n * Math.cos(o) + .0065, lat: n * Math.sin(o) + .006}
        },

        // 动态数字
        animateNum: function (elem, isThd, delay, grain) {
            isThd = null == isThd || true === isThd || "true" === isThd, delay = isNaN(delay) ? 500 : delay, grain = isNaN(grain) ? 100 : grain;
            var o = function (e, t) {
                return t && /^[0-9]+.?[0-9]*$/.test(e) ? (e = e.toString()).replace(e.indexOf(".") > 0 ? /(\d)(?=(\d{3})+(?:\.))/g : /(\d)(?=(\d{3})+(?:$))/g, "$1,") : e
            };
            jquery(elem).each((function () {
                var e = jquery(this), l = e.data("num");
                l || (l = e.text().replace(/,/g, ""), e.data("num", l));
                var s = "INPUT,TEXTAREA".indexOf(e.get(0).tagName) >= 0, r = function (e) {
                    for (var t = "", a = 0; a < e.length; a++) {
                        if (!isNaN(e.charAt(a))) return t;
                        t += e.charAt(a)
                    }
                }(l.toString()), c = function (e) {
                    for (var t = "", a = e.length - 1; a >= 0; a--) {
                        if (!isNaN(e.charAt(a))) return t;
                        t = e.charAt(a) + t
                    }
                }(l.toString()), d = l.toString().replace(r, "").replace(c, "");
                if (isNaN(1 * d) || "0" === d) return s ? e.val(l) : e.html(l), console.error("not a number");
                var u = d.split("."), p = u[1] ? u[1].length : 0, y = 0, m = d;
                Math.abs(1 * m) > 10 && (y = parseFloat(u[0].substring(0, u[0].length - 1) + (u[1] ? ".0" + u[1] : "")));
                var f = (m - y) / grain, v = 0, h = setInterval((function () {
                    var t = r + o(y.toFixed(p), isThd) + c;
                    s ? e.val(t) : e.html(t), y += f, v++, (Math.abs(y) >= Math.abs(1 * m) || v > 5e3) && (t = r + o(m, isThd) + c, s ? e.val(t) : e.html(t), clearInterval(h))
                }), delay / grain)
            }))
        },

        // 深度克隆对象
        deepClone: function (obj) {
            var t, a = admin.util.isClass(obj);
            if ("Object" === a) t = {}; else {
                if ("Array" !== a) return obj;
                t = []
            }
            for (var i in obj) if (obj.hasOwnProperty(i)) {
                var n = obj[i], o = admin.util.isClass(n);
                t[i] = "Object" === o || "Array" === o ? arguments.callee(n) : obj[i]
            }
            return t
        },

        isClass: function (e) {
            return null === e ? "Null" : undefined === e ? "Undefined" : Object.prototype.toString.call(e).slice(8, -1)
        },

        // 判断富文本是否为空
        fullTextIsEmpty: function (text) {
            if (!text) return true;
            for (var t = ["img", "audio", "video", "iframe", "object"], a = 0; a < t.length; a++) if (text.indexOf("<" + t[a]) > -1) return false;
            var i = text.replace(/\s*/g, "");
            return !i || (!(i = i.replace(/&nbsp;/gi, "")) || !(i = i.replace(/<[^>]+>/g, "")))
        },

        // 移除元素的style
        removeStyle: function (elem, options) {
            "string" == typeof options && (options = [options]);
            for (var i = 0; i < options.length; i++) jquery(elem).css(options[i], "")
        },

        // 滚动到顶部
        scrollTop: function (elem) {
            jquery(elem || "html,body").animate({scrollTop: 0}, 300)
        },

        // 模板解析
        tpl: function (html, data, openCode, closeCode) {
            if (null == html || "string" != typeof html) return html;
            data || (data = {}), openCode || (openCode = "{{"), closeCode || (closeCode = "}}");
            var n = {
                exp: function (e) {
                    return new RegExp(e, "g")
                }, query: function (e, t, o) {
                    var l = ["#([\\s\\S])+?", "([^{#}])*?"][e || 0];
                    return n.exp((t || "") + openCode + l + closeCode + (o || ""))
                }, escape: function (e) {
                    return String(e || "").replace(/&(?!#?[a-zA-Z0-9]+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;").replace(/"/g, "&quot;")
                }, error: function (e, t) {
                    console.error("Laytpl Error：" + e + "\n" + (t || ""))
                }, parse: function (e, t) {
                    var o = e;
                    try {
                        var l = n.exp("^" + openCode + "#"), s = n.exp(closeCode + "$");
                        return e = '"use strict";var view = "' + (e = e.replace(n.exp(openCode + "#"), openCode + "# ").replace(n.exp(closeCode + "}"), "} " + closeCode).replace(/\\/g, "\\\\").replace(n.exp(openCode + "!(.+?)!" + closeCode), (function (e) {
                            return e = e.replace(n.exp("^" + openCode + "!"), "").replace(n.exp("!" + closeCode), "").replace(n.exp(openCode + "|" + closeCode), (function (e) {
                                return e.replace(/(.)/g, "\\$1")
                            }))
                        })).replace(/(?="|')/g, "\\").replace(n.query(), (function (e) {
                            return '";' + (e = e.replace(l, "").replace(s, "")).replace(/\\/g, "") + ';view+="'
                        })).replace(n.query(1), (function (e) {
                            var t = '"+(';
                            return e.replace(/\s/g, "") === openCode + closeCode ? "" : (e = e.replace(n.exp(openCode + "|" + closeCode), ""), /^=/.test(e) && (e = e.replace(/^=/, ""), t = '"+_escape_('), t + e.replace(/\\/g, "") + ')+"')
                        })).replace(/\r\n/g, '\\r\\n" + "').replace(/\n/g, '\\n" + "').replace(/\r/g, '\\r" + "')) + '";return view;', (e = new Function("d, _escape_", e))(t, n.escape)
                    } catch (e) {
                        return n.error(e, o), o
                    }
                }
            };
            return n.parse(html, data)
        },

        render: function (e) {
            if ("string" == typeof e.url) return e.success = function (a) {
                admin.util.render(jquery.extend({}, e, {url: a}))
            }, void ("ajax" === e.ajax ? admin.ajax(e) : admin.req(e.url, e.where, e.success, e.method, e));
            var a = admin.util.tpl(e.tpl, e.url, e.open || cache.tplOpen, e.close || cache.tplClose);
            jquery(e.elem).next("[ew-tpl-rs]").remove(), jquery(e.elem).after(a), jquery(e.elem).next().attr("ew-tpl-rs", ""), e.done && e.done(e.url)
        }
    };

    // 锁屏
    admin.lockScreen = function (e) {
        if (window !== top && !admin.isTop() && top.layui && top.layui.admin) return top.layui.admin.lockScreen(e);
        e || (e = "/static/admin/assets/libs/templets/tpl-lock-screen.html");
        var i = jquery("#ew-lock-screen-group");
        if (i.length > 0) i.fadeIn("fast"), admin.isLockScreen = true, admin.putTempData("isLockScreen", admin.isLockScreen, true); else {
            var n = layer.load(2);
            admin.ajax({
                url: e, dataType: "html", success: function (i) {
                    layer.close(n), "string" == typeof i ? (jquery("body").append('<div id="ew-lock-screen-group">' + i + "</div>"), admin.isLockScreen = true, admin.putTempData("isLockScreen", admin.isLockScreen, true), admin.putTempData("lockScreenUrl", e, true)) : (console.error(i), layer.msg(JSON.stringify(i), {
                        icon: 2,
                        anim: 6
                    }))
                }
            })
        }
    };

    // 解除锁屏
    admin.unlockScreen = function (isRemove) {
        if (window !== top && !admin.isTop() && top.layui && top.layui.admin) return top.layui.admin.unlockScreen(isRemove);
        var a = jquery("#ew-lock-screen-group");
        isRemove ? a.remove() : a.fadeOut("fast"), admin.isLockScreen = false, admin.putTempData("isLockScreen", null, true)
    };
    
    admin.tips = function (options) {
        return layer.tips(options.text, options.elem, {
            tips: [options.direction || 1, options.bg || "#191a23"],
            tipsMore: options.tipsMore,
            time: options.time || -1,
            success: function (a) {
                var i = jquery(a).children(".layui-layer-content");
                if ((options.padding || 0 === options.padding) && i.css("padding", options.padding), options.color && i.css("color", options.color), options.bgImg && i.css("background-image", options.bgImg).children(".layui-layer-TipsG").css("z-index", "-1"), options.fontSize && i.css("font-size", options.fontSize), options.offset) {
                    var n = options.offset.split(","), o = n[0], l = n.length > 1 ? n[1] : undefined;
                    o && jquery(a).css("margin-top", o), l && jquery(a).css("margin-left", l)
                }
            }
        });
    };
    
    admin.renderTpl = function (e) {
        function a(e) {
            if (e) try {
                return new Function("return " + e + ";")();
            } catch (t) {
                console.error(t + "\nlay-data: " + e);
            }
        }

        layui.admin || (layui.admin = admin), jquery(e || "[ew-tpl]").each((function () {
            var e = jquery(this), i = jquery(this).data();
            if (i.elem = e, i.tpl = e.html(), i.url = a(e.attr("ew-tpl")), i.headers = a(i.headers), i.where = a(i.where), i.done) try {
                i.done = new Function("res", i.done)
            } catch (e) {
                console.error(e + "\nlay-data:" + i.done), i.done = undefined
            }
            admin.util.render(i)
        }))
    };
    
    admin.on = function (events, params) {
        return layui.onevent.call(this, "admin", events, params)
    };

    // 修改配置信息
    admin.putSetting = function (key, value) {
        cache[key] = value;
        admin.putTempData(key, value, true);
    };

    // 恢复配置信息
    admin.recoverState = function () {
        if (admin.getTempData("isLockScreen", true) && admin.lockScreen(admin.getTempData("lockScreenUrl", true)), cache.defaultTheme && admin.changeTheme(cache.defaultTheme, window, true, true), cache.closeFooter && jquery("body").addClass("close-footer"), undefined !== cache.navArrow) {
            var e = jquery(l + ">.layui-nav-tree");
            e.removeClass("arrow2 arrow3"), cache.navArrow && e.addClass(cache.navArrow)
        }
        cache.pageTabs && "true" == cache.tabAutoRefresh && jquery(o).attr("lay-autoRefresh", "true")
    };
    
    var c = ".layui-layout-admin.admin-nav-mini>.layui-side .layui-nav .layui-nav-item";
    jquery(document).on("mouseenter", c + "," + c + " .layui-nav-child>dd", (function () {
        if (admin.getPageWidth() > 768) {
            var e = jquery(this), a = e.find(">.layui-nav-child");
            if (a.length > 0) {
                e.addClass("admin-nav-hover"), a.css("left", e.offset().left + e.outerWidth());
                var i = e.offset().top;
                i + a.outerHeight() > admin.getPageHeight() && ((i = i - a.outerHeight() + e.outerHeight()) < 60 && (i = 60), a.addClass("show-top")), a.css("top", i), a.addClass("ew-anim-drop-in")
            } else e.hasClass("layui-nav-item") && admin.tips({
                elem: e,
                text: e.find("cite").text(),
                direction: 2,
                offset: "12px"
            })
        }
    })).on("mouseleave", c + "," + c + " .layui-nav-child>dd", (function () {
        layer.closeAll("tips");
        var e = jquery(this);
        e.removeClass("admin-nav-hover");
        var i = e.find(">.layui-nav-child");
        i.removeClass("show-top ew-anim-drop-in"), i.css({left: "auto", top: "auto"})
    }));
    
    jquery(document).on("click", "*[ew-event]", (function () {
        var event_func = admin.events[jquery(this).attr("ew-event")];
        event_func && event_func.call(this, jquery(this))
    }));
    
    jquery(document).on("mouseenter", "*[lay-tips]", (function () {
        var e = jquery(this);
        admin.tips({
            elem: e,
            text: e.attr("lay-tips"),
            direction: e.attr("lay-direction"),
            bg: e.attr("lay-bg"),
            offset: e.attr("lay-offset"),
            padding: e.attr("lay-padding"),
            color: e.attr("lay-color"),
            bgImg: e.attr("lay-bgImg"),
            fontSize: e.attr("lay-fontSize")
        })
    })).on("mouseleave", "*[lay-tips]", (function () {
        layer.closeAll("tips")
    }));
    
    jquery(document).on("click", ".form-search-expand,[search-expand]", (function () {
        var e = jquery(this), a = e.parents(".layui-form").first(), i = e.data("expand"), n = e.attr("search-expand");
        if (undefined === i || true === i) {
            i = true, e.data("expand", false), e.html('收起 <i class="layui-icon layui-icon-up"></i>');
            var o = a.find(".form-search-show-expand");
            o.attr("expand-show", ""), o.removeClass("form-search-show-expand")
        } else i = false, e.data("expand", true), e.html('展开 <i class="layui-icon layui-icon-down"></i>'), a.find("[expand-show]").addClass("form-search-show-expand");
        n && new Function("d", n)({expand: i, elem: e})
    }));
    
    jquery(document).on("click.ew-sel-fixed", ".ew-select-fixed .layui-form-select .layui-select-title", (function () {
        var e = jquery(this), a = e.parent().children("dl"), i = e.offset().top, n = e.outerWidth(),
            o = e.outerHeight(),
            l = jquery(document).scrollTop(), s = a.outerWidth(), c = a.outerHeight(), d = i + o + 5 - l,
            u = e.offset().left;
        d + c > admin.getPageHeight() && (d = d - c - o - 10), u + s > admin.getPageWidth() && (u = u - s + n), a.css({
            left: u,
            top: d,
            "min-width": n
        })
    }));
    
    admin.hideFixedEl = function () {
        jquery(".ew-select-fixed .layui-form-select").removeClass("layui-form-selected layui-form-selectup"), jquery("body>.layui-laydate").remove()
    };
    
    jquery(document).on("click", ".layui-nav-tree>.layui-nav-item a", (function () {
        var e = jquery(this), a = e.siblings(".layui-nav-child"), i = e.parent();
        if (0 !== a.length && !i.hasClass("admin-nav-hover") && (i.hasClass("layui-nav-itemed") ? a.css("display", "none").slideDown("fast", (function () {
            jquery(this).css("display", "")
        })) : a.css("display", "block").slideUp("fast", (function () {
            jquery(this).css("display", "")
        })), "_all" === e.parents(".layui-nav").attr("lay-shrink"))) {
            var n = e.parent().siblings(".layui-nav-itemed");
            n.children(".layui-nav-child").css("display", "block").slideUp("fast", (function () {
                jquery(this).css("display", "")
            })), n.removeClass("layui-nav-itemed")
        }
    }));
    
    jquery('.layui-nav-tree[lay-shrink="all"]').attr("lay-shrink", "_all");
    
    jquery(document).on("click", ".layui-collapse>.layui-colla-item>.layui-colla-title", (function () {
        var e = jquery(this), a = e.siblings(".layui-colla-content"), i = e.parent().parent(),
            n = a.hasClass("layui-show");
        if (n ? a.removeClass("layui-show").slideDown("fast").addClass("layui-show") : a.css("display", "block").slideUp("fast", (function () {
            jquery(this).css("display", "")
        })), e.children(".layui-colla-icon").html("&#xe602;").css({
            transition: "all .3s",
            transform: "rotate(" + (n ? "90deg" : "0deg") + ")"
        }), "_all" === i.attr("lay-shrink")) {
            var o = i.children(".layui-colla-item").children(".layui-colla-content.layui-show").not(a);
            o.css("display", "block").slideUp("fast", (function () {
                jquery(this).css("display", "")
            })), o.removeClass("layui-show"), o.siblings(".layui-colla-title").children(".layui-colla-icon").html("&#xe602;").css({
                transition: "all .3s",
                transform: "rotate(0deg)"
            })
        }
    }));
    
    jquery(".layui-collapse[lay-accordion]").attr("lay-shrink", "_all").removeAttr("lay-accordion");
    layer.oldTips = layer.tips;
    layer.tips = function (e, i, n) {
        var o;
        if (jquery(i).length > 0 && jquery(i).parents(".layui-form").length > 0 && (jquery(i).is("input") || jquery(i).is("textarea") ? o = jquery(i) : (jquery(i).hasClass("layui-form-select") || jquery(i).hasClass("layui-form-radio") || jquery(i).hasClass("layui-form-checkbox") || jquery(i).hasClass("layui-form-switch")) && (o = jquery(i).prev())), !o) return layer.oldTips(e, i, n);
        n.tips = [o.attr("lay-direction") || 3, o.attr("lay-bg") || "#ff4c4c"], setTimeout((function () {
            n.success = function (e) {
                jquery(e).children(".layui-layer-content").css("padding", "6px 12px")
            }, layer.oldTips(e, i, n)
        }), 100)
    };
    
    jquery(document).on("click", "*[ew-href]", (function () {
        var e = jquery(this), url = e.attr("ew-href");
        if (url && "#" !== url) {
            if (0 === url.indexOf("javascript:")) return new Function(url.substring(11))();
            var title = e.attr("ew-title") || e.text(), n = e.data("window");
            n = n ? admin.strToWin(n) : top;
            var o = e.attr("ew-end");
            try {
                o = o ? new Function(o) : undefined
            } catch (e) {
                console.error(e)
            }
            n.layui && n.layui.index ? n.layui.index.openTab({title: title || "", url: url, end: o}) : location.href = url
        }
    }));
    
    layui.contextMenu || jquery(document).off("click.ctxMenu").on("click.ctxMenu", (function () {
        try {
            for (var e = top.window.frames, t = 0; t < e.length; t++) {
                var a = e[t];
                try {
                    a.layui && a.layui.jquery && a.layui.jquery("body>.ctxMenu").remove()
                } catch (e) {
                }
            }
            try {
                top.layui && top.layui.jquery && top.layui.jquery("body>.ctxMenu").remove()
            } catch (e) {
            }
        } catch (e) {
        }
    }));
    
    cache = jquery.extend({
        pageTabs: true,
        cacheTab: true,
        openTabCtxMenu: true,
        maxTabNum: 20,
        tableName: "easyweb-iframe",
        apiNoCache: true,
        ajaxSuccessBefore: function (e, t, a) {
            return !admin.ajaxSuccessBefore || admin.ajaxSuccessBefore(e, t, a)
        },
        getAjaxHeaders: function (e, t, a) {
            return admin.getAjaxHeaders ? admin.getAjaxHeaders(e, t, a) : []
        }
    }, cache);
    
    var localStorge = admin.getTempData(true);
    var u = ["pageTabs", "cacheTab", "defaultTheme", "navArrow", "closeFooter", "tabAutoRefresh"];
    var p;
    if (localStorge) {
        for (p = 0; p < u.length; p++) {
            undefined !== localStorge[u[p]] && (cache[u[p]] = localStorge[u[p]]);
        }
    }
    admin.recoverState();
    admin.renderTpl();
    admin.setter = cache; // 把layui的配置赋值给setter对象
    layui.device().ios && jquery("body").addClass("ios-iframe-body");
    exports("admin", admin);
});