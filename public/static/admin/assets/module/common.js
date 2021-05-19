layui.define(["form", "layer", "laydate", "upload", "base", "element"], function (exports) {
    "use strict";

    var form = layui.form,
        layer = undefined === parent.layer ? layui.layer : top.layer,
        laydate = layui.laydate,
        upload = layui.upload,
        base = layui.base,
        jquery = layui.$,

        // common.js库主要实现偏向底层对接JQuery方法的封装
        // 功能组件
        common = {

            /**
             * 添加、编辑
             * @param title
             * @param id
             * @param width
             * @param height
             * @param params
             * @param shadeClose
             */
            edit: function (title, id = 0, width = 0, height = 0, params = [], shadeClose = false) {
                // 窗口标题
                var update_or_add = id > 0 ? "修改" : "新增";
                base.isEmpty(title) ? update_or_add += "内容" : update_or_add += title;
                // URL逻辑处理
                var url = cUrl + "/edit?id=" + id;
                if (Array.isArray(params)) {
                    for (var key in params) url += "&" + params[key];
                }
                // 调用内部方法
                common.showWin(update_or_add, url, width, height, params, 2, [], function () {
                }, shadeClose)
            },

            /**
             * 查看详情
             * @param title
             * @param id
             * @param width
             * @param height
             */
            detail: function (title, id, width = 0, height = 0) {
                // 调用内部方法
                var url = cUrl + "/detail?id=" + id;
                common.showWin(title + "详情", url, width, height)
            },

            cache: function (id) {
                var url = cUrl + "/cache";
                common.ajaxPost(url, {id: id}, function (n, e) {
                });
            },

            /**
             * 一键复制,复制某一条现有的数据记录然后进行调整和修改生成一条新的记录
             * @param title
             * @param id
             * @param width
             * @param height
             */
            copy: function (title, id, width = 0, height = 0) {
                var url = cUrl + "/copy?id=" + id;
                common.showWin(title + "复制", url, width, height)
            },

            /**
             * 数据删除
             * @param id 当前待删除数据的数据库记录ID；
             * @param callback 回调函数，删除成功之后会默认进行回调；
             */
            drop: function (id, callback = null) {
                layer.confirm("您确定要删除吗？删除后将无法恢复！", {
                    icon: 3,
                    skin: "layer-ext-moon",
                    btn: ["确认", "取消"]
                }, function (index) {
                    // 调用内部方法
                    var url = cUrl + "/drop";
                    common.ajaxPost(url, {id: id}, function (data, isDelete) {
                        if(callback) {
                            // 关闭弹窗
                            layer.close(index);
                            // 回调
                            callback(data, isDelete);
                        }
                    }, "正在删除。。。");
                });
            },

            /**
             * 批量操作,如：批量删除、批量启用、批量禁用、批量设置等等
             * @param option 参数集合
             *      title: "批量删除",
             *      url: cUrl + "/batchDrop",
             *      param: 参数
             *      data: data,
             *      confirm: true,
             * @param callback 回调函数，删除成功之后会默认进行回调；
             * @returns {boolean}
             */
            batchFunc: function (option, callback = null) {
                var url = option.url,
                    title = option.title,
                    form = option.form || '',
                    confirm = option.confirm || false,
                    show_tips = option.show_tips || "处理中...",
                    item = option.data || [],
                    param = option.param || [];

                if (0 == item.length) {
                    layer.msg("请选择数据", {icon: 5});
                    return false;
                }

                // 选择数据ID
                var ids = [];
                for (var i in item) {
                    ids.push(item[i].id);
                }
                // 选择数据ID字符串（逗号‘,’分隔）
                var ids_str = ids.join(",");
                var data = {};
                data.id = ids_str;

                // 自定义参数解析
                if (Array.isArray(param)) {
                    for (var i in param) {
                        var subItem = param[i].split("=");
                        data[subItem[0]] = subItem[1];
                    }
                }

                if(confirm) {
                    // 弹出确认
                    layer.confirm("您确定要【" + title + "】选中的数据吗？", {icon: 3, title: "提示信息"}, function (n) {
                        common.ajaxPost(url, data, callback, show_tips);
                    });
                } else {
                    // 直接请求
                    common.ajaxPost(url, data, callback, show_tips)
                }
            },

            /**
             * 表单验证,自定义验证规则
             */
            verify: function () {
                form.verify({
                    number: [/^[0-9]*$/, "请输入数字"], // 验证数字
                    username: function (value, item) { // 验证用户名称
                        // 特殊字符验证
                        if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                            return title + '不能含有特殊字符';
                        }
                        // 下划线验证
                        if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                            return title + '首尾不能出现下划线\'_\'';
                        }
                        // 数字验证
                        if (/^\d+\d+\d$/.test(value)) {
                            return title + '不能全为数字';
                        }
                    }
                    // 数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
                    , pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'] // 验证密码
                });
            },

            /**
             * 表单提交
             * @param data
             * @param url
             * @param callback
             */
            submitForm: function (data, url = null, callback = null) {
                // 带[]中括号下标的字段特殊处理
                var nameArr = [];
                var itemArr = [];
                var param = data;

                jquery.each(param, function (key, val) {
                    // 鉴于表单特殊控件的差异，对个别特性控件的取值进行分析处理，如checkbox表单控件，
                    // 当我们多选时，所获取到的值是带中括号[]下标的数组，我们需要对其进行拆解，取出下标值并使用逗号,拼接成一个字符串重新赋值给参数；
                    // 正则验证字段是否存在中括号[]
                    var regex = /\[|\]|【|】/g
                    if (!regex.test(key)) {
                        return;
                    }

                    // 处理带括号[]的字段
                    var regex1 = /\[(.+?)\]/g;   // [] 中括号及内容

                    // 获取括号及括号内容
                    var content = key.match(regex1);

                    // 获取括号内容值
                    var regex2 = /\[(.+?)\]/;
                    var item = key.match(regex2);
                    val = item[1];

                    // 获取字段名
                    var name = key.replace(content, "");

                    // 字段名临时存储
                    if (jquery.inArray(name, nameArr) < 0) {
                        nameArr.push(name);
                    }

                    // 字段名数组初始化
                    if (!itemArr[name]) {
                        itemArr[name] = [];
                    }
                    itemArr[name].push(val);
                });

                jquery.each(nameArr, function (elem, index) {
                    var temp = [];
                    jquery.each(itemArr[index], function (elem2, index2) {
                        temp.push(index2);
                        delete param[index + "[" + index2 + "]"];
                    });
                    param[index] = temp.join(",");
                });

                // delete param.layReload;
                // 自定义URL：表单提交时框架支持自定义URL地址，默认程序会判断form表单是否自定义了网络请求地址，取至表单属性action;
                // 动态生成URL：当前不存在自定义表单提交地址时，程序会根据当前id隐藏域控件的值判断当前表单是添加提交还是编辑提交来动态生成网络请求地址；
                if (null == url) {
                    var action = jquery("form").attr("action");
                    url = base.isEmpty(action) ? aUrl : action
                }
                common.ajaxPost(url, param, function (res, success) {
                    if (success) {
                        setTimeout(function () {
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.layer.close(index);
                            parent.location.reload();
                        }, 500);
                        callback && callback(res, success);
                        return false;
                    }
                });
            },

            /**
             * 搜索功能
             * @param table
             * @param data
             *      elem 对象
             *      field 键值对对象
             * @param tableList
             */
            searchForm: function (table, data, tableList = "tableList") {
                // 执行重载
                table.reload(tableList, {
                    page: {
                        curr: 1 //重新从第 1 页开始
                    },
                    where: data.field // 搜索键值对
                });
            },

            /**
             * 日期组件
             * @param item
             * @param callback
             */
            initDate: function (item, callback = null) {
                if (Array.isArray(item)) {
                    for (var i in item) {
                        var subItem = item[i].split("|");
                        if (subItem[2]) {
                            var param = subItem[2].split(",");
                        }

                        // 日期组件数据重组
                        var options = {};
                        options.elem = "#" + subItem[0];
                        options.type = subItem[1];
                        options.theme = "molv";// 主题颜色[molv,#393D49,grid]
                        options.range = "true" === subItem[3] || subItem[3];// 开启左右面板
                        options.calendar = true;// 是否显示公历节日
                        options.show = false;// 默认显示
                        options.position = "absolute";// [fixed,absolute,static]
                        options.trigger = "click";// 定义鼠标悬停时弹出控件[click,mouseover]
                        options.btns = ["clear", "now", "confirm"];// 工具按钮 默认值['clear', 'now', 'confirm']
                        options.mark = {// 自定义标注重要日子
                            "0-06-25": "生日",
                            "0-12-31": "跨年"
                        };
                        // 控件在打开时触发，回调返回一个参数
                        options.ready = function (date) {
                        };
                        // 日期时间被切换后的回调
                        options.change = function (value, date, endDate) {
                            // console.log(value); // 得到日期生成的值，如：2017-08-18
                            // console.log(date); // 得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                            // console.log(endDate); // 得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                        };
                        // 控件选择完毕后的回调
                        options.done = function (value, date, endDate) {
                            if (callback) {
                                callback(value, date);
                            }
                        };

                        if (param) {
                            // 最小值
                            var minV = param[0];
                            if (minV) {
                                var isNum = !isNaN(minV);
                                if (isNum) {
                                    // 数字
                                    options.min = parseInt(minV);
                                } else {
                                    // 非数字
                                    options.min = minV;
                                }
                            }
                            // 最大值
                            var maxV = param[1];
                            if (maxV) {
                                var isNum2 = !isNaN(maxV);
                                if (isNum2) {
                                    // 数字
                                    options.max = parseInt(maxV);
                                } else {
                                    // 非数字
                                    options.max = maxV;
                                }
                            }
                        }
                        // 日期选择组件
                        laydate.render(options)
                    }
                }
            },

            /**
             * 窗体弹框
             * @param title 弹窗标题，这个标题是在弹框的左上角显示的标题文字；
             * @param content URL地址，这个是弹框调用的方法地址，比如添加、编辑时需要调用页面表单地址的方法；
             * @param width 弹窗宽度，一个数值(不传时默认弹窗全屏显示)；
             * @param height 弹窗高度，一个数值(不传时默认弹窗全屏显示)；
             * @param params 需要传给弹窗的自定义参数；
             * @param type 弹窗类型，
             * @param btn 自定义弹窗底部的按钮，如：确认、取消；
             * @param callback 回调函数，弹窗成功弹出之后会默认进行回调；
             * @param shadeClose 点击遮罩关闭
             */
            showWin: function (title, content, width = 0, height = 0, params = [], type = 2, btn = [], callback = null, shadeClose = false) {
                var index = layui.layer.open({
                    title: title,
                    type: type,
                    area: [width + "px", height + "px"],
                    content: content,
                    shadeClose: shadeClose, // 点击遮罩关闭
                    shade: .4,
                    success: function (layero, index) {
                        // 窗体传值【支持多值传递】
                        if (Array.isArray(params)) {
                            for (var key in params) {
                                var param = params[key].split("=");
                                layui.layer.getChildFrame("body", index).find("#" + param[0]).val(param[1])
                            }
                        }
                        // 回调函数
                        if (callback) {
                            callback(layero, index);
                        }
                    },
                    end: function () {
                        // 加载结束
                    }
                });

                if(0 === width) {
                    // 全屏设置
                    layui.layer.full(index);
                    jquery(window).on("resize", function () {
                        layui.layer.full(index);
                    });
                }

            },

            /**
             * 网络POST请求
             * @param url URL请求地址；
             * @param data 请求参数，要求JSON格式;
             * @param callback 回调函数，删除成功之后会默认进行回调；
             * @param msg 网络请求时界面的提示语,如请求中。。。
             */
            ajaxPost: function (url, data, callback = null, msg = "处理中,请稍后...") {
                var index = null;
                jquery.ajax({
                    url: url,
                    dataType: "json",
                    type: "POST",
                    data: data,
                    beforeSend: function () {
                        index = layer.msg(msg, {
                            icon: 16,
                            shade: .01,
                            time: 0
                        });
                    },
                    success: function (res) {
                        if (!res.success) {
                            layer.msg(res.msg, {icon: 5});
                            return false;
                        }
                        layer.msg(res.msg, {
                            icon: 1,
                            time: 500
                        }, function () {
                            layer.close(index);
                            callback && callback(data, true);
                        });
                    },
                    error: function () {
                        layer.msg("AJAX请求异常");
                        callback && callback(data, false);
                    }
                })
            },

            /**
             * 网络GET请求
             * @param url URL请求地址；
             * @param data 请求参数，要求JSON格式;
             * @param callback 回调函数，删除成功之后会默认进行回调；
             * @param msg 网络请求时界面的提示语,如请求中。。。
             */
            ajaxGet: function (url, data, callback = null, msg = '处理中,请稍后...') {
                var index = null;
                $.ajax({
                    type: "GET",
                    url: url,
                    data: data,
                    contentType: "application/json",
                    dataType: "json",
                    beforeSend: function () {
                        index = layer.msg(msg, {
                            icon: 16
                            , shade: 0.01
                            , time: 0
                        });
                    },
                    success: function (res) {
                        if (res.code == 0) {
                            //0.5秒后关闭
                            layer.msg(res.msg, {icon: 1, time: 500}, function () {
                                layer.close(index);
                                if (callback) {
                                    callback(data, true);
                                }
                            });
                        } else {
                            layer.msg(res.msg, {icon: 5});
                            return false;
                        }
                    },
                    error: function () {
                        layer.msg("AJAX请求异常");
                        if (callback) {
                            callback(data, false);
                        }
                    }
                });
            },

            /**
             * 开关事件,在开关进行开启和关闭的过程中可以发起响应的网络请求并且进行一系列业务处理
             * @param filter name值是开关组件的过滤器名称；
             * @param url URL请求地址；
             * @param callback 回调函数，删除成功之后会默认进行回调； 备注：开关组件默认传的值就是：1和2，至于对于数字1和2的定义自由发挥；
             */
            formSwitch: function (filter, url = "", callback = null) {
                form.on("switch(" + filter + ")", function (data) {
                    var check_value = this.checked ? "1" : "2"; //开关是否开启，true或者false

                    // URL自定义
                    // 如果url传了自定义的网路请求地址则会按照给定的地址进行请求，
                    // 否则程序会动态生成请求地址，方法名称生成规则是set组件参数名(组件参数名首字母大写)，举例，当组件参数名为status时，则方法名为setStatus
                    if (base.isEmpty(url)) {
                        if (filter.indexOf("_") >= 0) {
                            var filters = filter.split("_");
                            url = cUrl + "/set" + filters[0].substring(0, 1).toUpperCase() + filters[0].substring(1) + filters[1].substring(0, 1).toUpperCase() + filters[1].substring(1)
                        } else {
                            url = cUrl + "/set" + filter.substring(0, 1).toUpperCase() + filter.substring(1);
                        }
                    }
                    // JSON数据
                    var json_data = {};
                    json_data.id = this.value;
                    json_data[filter] = check_value;
                    // JSON字符串
                    var json_data = JSON.stringify(json_data);
                    // JSON数据
                    var data_raw = JSON.parse(json_data);
                    // 发起POST请求
                    common.ajaxPost(url, data_raw, function (data, isSuccess) {
                        callback && callback(data, isSuccess);
                    });
                });
            },

            /**
             * 上传文件
             * @param elem_id 组件的唯一标识名；
             * @param callback 回调函数，删除成功之后会默认进行回调；
             * @param url URL请求地址；
             * @param exts 允许上传的文件后缀，如：xls|xlsx|doc|docx|zip|rar等等；
             * @param size 文件大小限制；
             * @param data 自定义参数；
             */
            uploadFile: function (elem_id, callback = null, url = "", exts = "xls|xlsx", size = 10240, data = {}) {
                if (base.isEmpty(url)) {
                    url = cUrl + "/uploadFile";
                }

                upload.render({
                    elem: "#" + elem_id,
                    url: url,
                    auto: false,
                    exts: exts,
                    accept: "file",
                    size: size,
                    method: "post",
                    data: data,
                    before: function (obj) {
                        layer.msg("上传并处理中。。。", {
                            icon: 16,
                            shade: .01,
                            time: 0
                        });
                    },
                    done: function (res) {
                        // 上传完毕回调

                        // 关闭所有弹窗
                        layer.closeAll();
                        // 上传成功


                        res.success ? layer.alert(res.msg, {
                            title: "上传反馈",
                            skin: "layui-layer-molv", //样式类名  自定义样式
                            closeBtn: 1, // 是否显示关闭按钮
                            anim: 0, //动画类型
                            btn: ["确定", "取消"], //按钮
                            icon: 6, // icon
                            yes: function () { // 回调
                                callback && callback(res, true)
                            },
                            btn2: function () {
                            }
                        }) : layer.msg(res.msg, {icon: 5});
                        return false;
                    },
                    error: function () {
                        // 请求异常回调
                        return layer.msg("数据请求异常")
                    }
                });
            }
        };

    exports("common", common);
});
