layui.define(["layer", "element", "admin"], function (exports) {

    var jquery = layui.jquery,
        layer = layui.layer,
        element = layui.element,
        admin = layui.admin,
        setter = admin.setter,
        o = ".layui-layout-admin>.layui-header",
        u = ".layui-layout-admin>.layui-side>.layui-side-scroll",
        r = ".layui-layout-admin>.layui-body",
        s = r + ">.layui-tab",
        d = r + ">.layui-body-header",
        filter = "admin-pagetabs",
        listener = {}, // 保存注册的监听器
        y = false,

        index = {
            homeUrl: undefined,
            mTabPosition: undefined,
            mTabList: [], // 保存已经打开tab

            loadView: function (obj) {
                if (!obj.menuPath) {
                    return layer.msg("url不能为空", {icon: 2, anim: 6});
                }
                if (setter.pageTabs) { // 如果开启多标签页
                    var isOpen;
                    // 判断标签页是否已经打开
                    jquery(s + ">.layui-tab-title>li").each(function () {
                        if(jquery(this).attr("lay-id") === obj.menuPath) {
                            isOpen = true; // 如果已经打开，则标记为打开
                        }
                    });
                    if (!isOpen) { // 如果没有打开且超过最大打开标签页数，则提示
                        if (index.mTabList.length + 1 >= setter.maxTabNum) {
                            return layer.msg("最多打开" + setter.maxTabNum + "个选项卡", {
                                icon: 2,
                                anim: 6
                            });
                        }

                        admin.activeNav(index.mTabPosition);

                        y = true;

                        // 添加面板，就是用于新增一个Tab选项
                        element.tabAdd(filter, {
                            id: obj.menuPath,
                            title: '<span class="title">' + (obj.menuName || "") + "</span>",
                            content: '<iframe class="admin-iframe" lay-id="' + obj.menuPath + '" src="' + obj.menuPath + '" onload="layui.index.hideLoading(this);" frameborder="0"></iframe>'
                        });

                        // 显示加载
                        admin.showLoading({
                            elem: jquery('iframe[lay-id="' + obj.menuPath + '"]').parent(),
                            size: ""
                        });

                        // 不是首页，则加入到tab列表
                        obj.menuPath !== index.homeUrl && index.mTabList.push(obj);

                        // 刷新页面是否恢复已经打开的Tab，如果需要，则缓存tab信息
                        setter.cacheTab && admin.putTempData("indexTabs", index.mTabList);
                    }
                    obj.noChange || element.tabChange(filter, obj.menuPath); // 切换到指定的tab面板
                } else {
                    // 如果只支持单标签页
                    admin.activeNav(obj.menuPath);
                    var d = jquery(r + ">div>.admin-iframe");

                    if(0 === d.length) {
                        jquery(r).html(['<div class="layui-body-header">', '   <span class="layui-body-header-title"></span>', '   <span class="layui-breadcrumb pull-right" lay-filter="admin-body-breadcrumb" style="visibility: visible;"></span>', "</div>", '<div style="-webkit-overflow-scrolling: touch;">', '   <iframe class="admin-iframe" lay-id="', obj.menuPath, '" src="', obj.menuPath, '"', '      onload="layui.index.hideLoading(this);" frameborder="0"></iframe>', "</div>"].join(""));

                        admin.showLoading({
                            elem: jquery('iframe[lay-id="' + obj.menuPath + '"]').parent(),
                            size: ""
                        });
                    } else {
                        admin.showLoading({
                            elem: d.parent(),
                            size: ""
                        });
                        d.attr("lay-id", obj.menuPath).attr("src", obj.menuPath);
                    }

                    jquery('[lay-filter="admin-body-breadcrumb"]').html(index.getBreadcrumbHtml(obj.menuPath));
                    index.mTabList.splice(0, index.mTabList.length);

                    if(obj.menuPath === index.homeUrl) {
                        index.mTabPosition = undefined;
                        index.setTabTitle(jquery(obj.menuName).text() || jquery(u + ' [lay-href="' + index.homeUrl + '"]').text() || "主页");
                    } else {
                        index.mTabPosition = obj.menuPath;
                        index.mTabList.push(obj);
                        index.setTabTitle(obj.menuName);
                    }
                    if (!setter.cacheTab) return;
                    admin.putTempData("indexTabs", index.mTabList);
                    admin.putTempData("tabPosition", index.mTabPosition);
                }
                admin.getPageWidth() <= 768 && admin.flexible(true);
            },

            loadHome: function (obj) {
                var indexTabs = admin.getTempData("indexTabs"), // 获取所有已经打开tab信息
                    tabPosition = admin.getTempData("tabPosition"), // ?? 当前标签
                    // loadSetting 是否恢复记忆的Tab;cacheTab 刷新页面是否恢复已经打开的Tab
                    is_need_open_exist_tab = (undefined === obj.loadSetting || obj.loadSetting) && setter.cacheTab && indexTabs && indexTabs.length > 0;

                index.homeUrl = obj.menuPath;
                obj.noChange = !!tabPosition && is_need_open_exist_tab;
                if(setter.pageTabs || is_need_open_exist_tab) {
                    index.loadView(obj);
                }

                if (is_need_open_exist_tab) {
                    for (var i = 0; i < indexTabs.length; i++) {
                        indexTabs[i].noChange = indexTabs[i].menuPath !== tabPosition;
                        // onlyLast  是否仅恢复最后一个Tab
                        (!indexTabs[i].noChange || setter.pageTabs && !obj.onlyLast) && index.loadView(indexTabs[i]);
                    }
                }

                admin.removeLoading(undefined, false);
            },

            /**
             * 打开新的页签
             * @param obj
             *       title 选项卡的标题
             *       url 打开的页面地址
             *       end Tab关闭的回调事件(非必填)
             * @returns {*}
             */
            openTab: function (obj) {
                if (window !== top && !admin.isTop() && top.layui && top.layui.index) {
                    return top.layui.index.openTab(obj);
                }
                obj.end && (listener[obj.url] = obj.end);
                index.loadView({menuPath: obj.url, menuName: obj.title});
            },

            // 关闭指定页签
            closeTab: function (url) {
                if (window !== top && !admin.isTop() && top.layui && top.layui.index) {
                    return top.layui.index.closeTab(url);
                }
                element.tabDelete(filter, url);
            },

            setTabCache: function (a) {

                if(window !== top && !admin.isTop() && top.layui && top.layui.index) {
                    return top.layui.index.setTabCache(a);
                }else {
                    admin.putSetting("cacheTab", a);
                    if(a) {
                        admin.putTempData("indexTabs", index.mTabList);
                        admin.putTempData("tabPosition", index.mTabPosition);
                    }else {
                        index.clearTabCache();
                    }
                }
            },

            // 清除页签缓存
            clearTabCache: function () {
                admin.putTempData("indexTabs", null);
                admin.putTempData("tabPosition", null);
            },

            // 修改指定Tab标题文字，单标签模式始终是修改当前
            setTabTitle: function (title, tabId) {
                if (window !== top && !admin.isTop() && top.layui && top.layui.index) {
                    return top.layui.index.setTabTitle(title, tabId);
                }

                if(setter.pageTabs) {
                    tabId || (tabId = jquery(s + ">.layui-tab-title>li.layui-this").attr("lay-id"));
                    tabId && jquery(s + '>.layui-tab-title>li[lay-id="' + tabId + '"] .title').html(title || "");
                }else if(title) {
                    jquery(d + ">.layui-body-header-title").html(title);
                    jquery(d).addClass("show");
                    jquery(o).css("box-shadow", "0 1px 0 0 rgba(0, 0, 0, .03)");
                } else {
                    jquery(d).removeClass("show");
                    jquery(o).css("box-shadow", "");
                }
            },

            // 修改整个标题栏的html，只在单标签模式有效
            setTabTitleHtml: function (html) {
                if (window !== top && !admin.isTop() && top.layui && top.layui.index) {
                    return top.layui.index.setTabTitleHtml(html);
                }
                if (!setter.pageTabs) {
                    if (!html) return jquery(d).removeClass("show");
                    jquery(d).html(html);
                    jquery(d).addClass("show");
                }
            },

            getBreadcrumb: function (a) {
                a || (a = jquery(r + ">div>.admin-iframe").attr("lay-id"));
                var i = [], t = jquery(u).find('[lay-href="' + a + '"]');
                for (t.length > 0 && i.push(t.text().replace(/(^\s*)|(\s*$)/g, "")); 0 !== (t = t.parent("dd").parent("dl").prev("a")).length;) i.unshift(t.text().replace(/(^\s*)|(\s*$)/g, ""));
                return i
            },

            getBreadcrumbHtml: function (a) {
                for (var e = index.getBreadcrumb(a), i = a === index.homeUrl ? "" : '<a ew-href="' + index.homeUrl + '">首页</a>', t = 0; t < e.length - 1; t++) i && (i += '<span lay-separator="">/</span>'), i += "<a><cite>" + e[t] + "</cite></a>";
                return i
            },

            hideLoading: function (a) {
                "string" != typeof a && (a = jquery(a).attr("lay-id")), admin.removeLoading(jquery('iframe[lay-id="' + a + '"],' + r + " iframe[lay-id]").parent(), false)
            }
        };

    h = ".layui-layout-admin .site-mobile-shade";
    0 === jquery(h).length && jquery(".layui-layout-admin").append('<div class="site-mobile-shade"></div>');

    jquery(h).click((function () {
        admin.flexible(true);
    }));

    if(setter.pageTabs && 0 === jquery(s).length) {
        jquery(r).html(['<div class="layui-tab" lay-allowClose="true" lay-filter="', filter, '" lay-autoRefresh="', "true" == setter.tabAutoRefresh, '">', '   <ul class="layui-tab-title"></ul><div class="layui-tab-content"></div>', "</div>", '<div class="layui-icon admin-tabs-control layui-icon-prev" ew-event="leftPage"></div>', '<div class="layui-icon admin-tabs-control layui-icon-next" ew-event="rightPage"></div>', '<div class="layui-icon admin-tabs-control layui-icon-down">', '   <ul class="layui-nav" lay-filter="admin-pagetabs-nav">', '      <li class="layui-nav-item" lay-unselect>', '         <dl class="layui-nav-child layui-anim-fadein">', '            <dd ew-event="closeThisTabs" lay-unselect><a>关闭当前标签页</a></dd>', '            <dd ew-event="closeOtherTabs" lay-unselect><a>关闭其它标签页</a></dd>', '            <dd ew-event="closeAllTabs" lay-unselect><a>关闭全部标签页</a></dd>', "         </dl>", "      </li>", "   </ul>", "</div>"].join(""));

        element.render("nav", "admin-pagetabs-nav");
    }

    // 这里监控的是<a nav-bind="1">XXX</a>的点击，https://www.layui.com/doc/modules/element.html#on
    element.on("nav(admin-side-nav)", (function (data) {
        var i = jquery(data), t = i.attr("lay-href");
        if (t && "#" !== t) {
            if (0 === t.indexOf("javascript:")) return new Function(t.substring(11))();
            var n = i.attr("ew-title") || i.text().replace(/(^\s*)|(\s*$)/g, ""), l = i.attr("ew-end");
            try {
                l = l ? new Function(l) : undefined
            } catch (a) {
                console.error(a)
            }
            index.openTab({url: t, title: n, end: l});
            layui.event.call(this, "admin", "side({*})", {href: t});
        }
    }));

    /* 监听tab切换事件 */
    element.on("tab(" + filter + ")", (function () {
        var a = jquery(this).attr("lay-id");
        index.mTabPosition = a !== index.homeUrl ? a : undefined;
        setter.cacheTab && admin.putTempData("tabPosition", index.mTabPosition);
        admin.activeNav(a);
        admin.rollPage("auto");
        "true" != jquery(s).attr("lay-autoRefresh") || y || admin.refresh(a, true);
        y = false;
        layui.event.call(this, "admin", "tab({*})", {layId: a});
    }));

    /*监听tab关闭事件*/
    element.on("tabDelete(" + filter + ")", (function (a) {
        var i = index.mTabList[a.index - 1];

        if(i) {
            index.mTabList.splice(a.index - 1, 1);
            setter.cacheTab && admin.putTempData("indexTabs", index.mTabList);
            listener[i.menuPath] && listener[i.menuPath].call();
            layui.event.call(this, "admin", "tabDelete({*})", {layId: i.menuPath});
        }

        0 === jquery(s + ">.layui-tab-title>li.layui-this").length && jquery(s + ">.layui-tab-title>li:last").trigger("click");
    }));

    jquery(document).off("click.navMore").on("click.navMore", "[nav-bind]", (function () {
        var nav_id = jquery(this).attr("nav-bind");
        jquery('ul[lay-filter="admin-side-nav"]').addClass("layui-hide");
        jquery('ul[nav-id="' + nav_id + '"]').removeClass("layui-hide"); // 显示指定类型菜单项
        jquery(o + ">.layui-nav .layui-nav-item").removeClass("layui-this");
        jquery(this).parent(".layui-nav-item").addClass("layui-this");
        admin.getPageWidth() <= 768 && admin.flexible(false);
        layui.event.call(this, "admin", "nav({*})", {navId: nav_id}); // 调用admin模块中的nav事件，默认没有注册监听该事件，用户可以自己实现
    }));

    setter.openTabCtxMenu && setter.pageTabs && layui.use("contextMenu", (function () {
        layui.contextMenu && jquery(s + ">.layui-tab-title").off("contextmenu.tab").on("contextmenu.tab", "li", (function (a) {
            var i = jquery(this).attr("lay-id");
            return layui.contextMenu.show([{
                icon: "layui-icon layui-icon-refresh",
                name: "刷新当前",
                click: function () {
                    element.tabChange(filter, i), "true" != jquery(s).attr("lay-autoRefresh") && admin.refresh(i)
                }
            }, {
                icon: "layui-icon layui-icon-close-fill ctx-ic-lg", name: "关闭当前", click: function () {
                    admin.closeThisTabs(i)
                }
            }, {
                icon: "layui-icon layui-icon-unlink", name: "关闭其他", click: function () {
                    admin.closeOtherTabs(i)
                }
            }, {
                icon: "layui-icon layui-icon-close ctx-ic-lg", name: "关闭全部", click: function () {
                    admin.closeAllTabs()
                }
            }], a.clientX, a.clientY), false
        }))
    }));

    exports("index", index);
});