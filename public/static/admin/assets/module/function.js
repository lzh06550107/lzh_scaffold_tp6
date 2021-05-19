layui.define(["form", "layer", "table", "common", "treeTable"], function (exports) {
    var _tableIns, _tableName, _callback, _title, _isDbclick,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        common = layui.common,
        treeTable = layui.treeTable,
        $ = layui.$,
        _width = 0, _height = 0, _shadeClose = false,

        // function.js核心库主要调用common.js提供的方法同时衔接UI操作的调用，同时封装和暴露了API接口层给外部调用。
        // function.js值复杂上层的传输、指挥及任务调度功能，对表单数据进行验证和调用等
        // 业务组件
        func_obj = {

            /**
             * table数据列表渲染
             * @param cols 数据列表的字段列表信息
             * @param tableName table数据表的名称；
             * @param callback 回调函数
             * @param url 自定义URL，一般情况下这个参数不需要我们传，获取数据列表的方法我们统一使用list方法，当需要变更请求方法时可以自定义完成的URL请求地址；
             * @param isSort 是否开启排序时间，默认false,当前开启时我们可以调用后端的方法进行整体的排序，而不是目前只能在当前界面进行某个字段的数据排序；
             * @returns {func_obj}
             */
            tableIns: function (cols, tableName, callback = null, url = "", isSort = false) {
                _tableName = tableName;
                _callback = callback;

                // 初始化网络请求URL
                if (!url || url == '') {
                    url = cUrl + "/index";
                }

                // 初始化网络请求参数
                var param = $("#param").val();
                // 解析和拼凑请求参数

                if (param) {
                    param = JSON.parse(param);
                    if ($.isArray(param)) {
                        for (var i in param) {
                            if (url.indexOf("?") >= 0) {
                                // 包含?
                                url += "&" + param[i];
                            } else {
                                // 不包含?
                                url += "?" + param[i];
                            }
                        }
                    }
                }

                // 初始化TABLE组件
                _tableIns = table.render({
                    elem: "#" + _tableName,
                    url: url, // 后端获取表格数据接口
                    method: "post", // 获取列表是POST请求
                    cellMinWidth: 150,
                    page: {
                        //  刷新    上一页     页     下一页    跳到第几页  总数、计数  限定条数
                        layout: ["refresh", "prev", "page", "next", "skip", "count", "limit"],
                        curr: 1,
                        groups: 10, //显示 连续页码
                        first: "首页",
                        last: "尾页"
                    },
                    height: "full-100",
                    limit: 20,
                    limits: [20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 1e3],
                    even: true, // 开启隔行背景
                    cols: [cols],
                    loading: true,
                    done: function (res, curr, count) { // 数据渲染完的回调
                        // 新增监听table行双击事件
                        if (_isDbclick) {
                            var $tbody = $(".layui-table-body").find("table").find("tbody");
                            var tr = $tbody.children("tr");
                            tr.on("dblclick", (function () {
                                var index = $tbody.find(".layui-table-hover").data("index");
                                var obj = res.data[index];
                                common.edit(_title, obj.id, _width, _height)
                            }));
                        }
                    }
                });

                // 监听头工具栏事件
                table.on("toolbar(" + _tableName + ")", function (obj) {
                    //获取表格选中行相关数据（下文会有详细介绍）。id 即表格id
                    var checkStatus = table.checkStatus(obj.config.id);
                    switch (obj.event) {
                        case "getCheckData":
                            var data = checkStatus.data; // 获取选中行的数据
                            layer.alert(JSON.stringify(data));
                            break;
                        case "getCheckLength": // checkStatus.data.length,获取选中行数量，可作为是否有选中行的条件
                            data = checkStatus.data;
                            layer.msg("选中了：" + data.length + " 个");
                            break;
                        case "isAll": // 表格是否全选
                            layer.msg(checkStatus.isAll ? "全选" : "未全选");
                    }
                });

                // 监听行工具事件
                table.on("tool(" + _tableName + ")", function (obj) {
                    var data = obj.data, event = obj.event;

                    if("edit" === event) {
                        // 编辑记录
                        common.edit(_title, data.id, _width, _height, [], _shadeClose);
                    } else if("detail" === event) {
                        // 记录详情
                        common.detail(_title, data.id, _width, _height);
                    } else if("del" === event) {
                        // 删除记录
                        common.drop(data.id, function (data, isDelete) {
                            isDelete && obj.del();
                        });
                    } else if("cache" === event) {
                        // 重置缓存
                        common.cache(data.id);
                    } else if("copy" === event) {
                        // 一键复制
                        common.copy(_title, data.id, _width, _height);
                    } else { // 其它自定义事件
                        _callback && _callback(event, data);
                    }

                });

                // 监听复选框
                table.on("checkbox(" + _tableName + ")", (function (obj) {
                    console.log(obj.checked); //当前是否选中状态
                    console.log(obj.data); //选中行的相关数据
                    console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
                }));

                // 点击单元格编辑
                table.on("edit(" + _tableName + ")", (function (obj) {
                    var changed_value = obj.value; //得到修改后的值
                    var row_data = obj.data; //所在行的所有相关数据
                    var row_field = obj.field; //当前编辑的字段名

                    var param = {};
                    param.id = row_data.id;
                    param[row_field] = changed_value;

                    // JSON字符串
                    var json_param = JSON.stringify(param);
                    // JSON数据
                    var data = JSON.parse(json_param);

                    // 发起网络请求
                    var url = cUrl + "/update";
                    common.ajaxPost(url, data, function (data, isSuccess) {
                    }, "更新中...");
                }));

                // 监听行单击事件
                table.on("row(" + _tableName + ")", function (obj) {
                    // 标注选中样式
                    obj.tr.addClass("layui-table-click").siblings().removeClass("layui-table-click");
                });

                // 监听排序事件
                isSort && table.on("sort(" + _tableName + ")", function (obj) {
                    // 实现服务端排序
                    table.reload(_tableName, {
                        initSort: obj, //记录初始排序，如果不设的话，将无法标记表头的排序状态。
                        where: {
                            field: obj.field, //排序字段
                            order: obj.type //排序方式
                        }
                    });
                });

                return this;
            },

            /**
             * tree树状数据列表渲染
             * @param cols 数据列表的字段列表信息
             * @param tableName table数据表的名称
             * @param isExpand 是否默认展开，默认：true
             * @param treeSpid 数据表的主键参数值,默认id
             * @param treePidName 上下级关系中的父级参数,默认是pid
             * @param callback 回调函数
             * @param url 自定义URL，一般情况下这个参数不需要我们传，获取数据列表的方法我们统一使用list方法，当需要变更请求方法时可以自定义完成的URL请求地址
             */
            treetable: function (cols = [], tableName, isExpand = true, treeSpid = 0, treePidName = "", callback = null, url = "") {
                _tableName = tableName;

                // 初始化请求URL
                if (!url) {
                    url = cUrl + "/index";
                }

                // 加载treetable
                var tableObj = treeTable.render({
                    elem: "#" + tableName,
                    url: url,
                    method: "POST",
                    height: "full-50",
                    cellMinWidth: 80,
                    tree: {
                        iconIndex: 1,
                        idName: "id",
                        pidName: treePidName || "pid",
                        isPidData: true
                    },
                    cols: [cols],
                    done: function (res, curr, count) {
                        // // res 可以获取文件的数据，或者是ajax请求的数据
                        // console.log(res);
                        // //得到当前页码
                        // console.log(curr);
                        // //得到数据总量
                        // console.log(count);
                        // 关闭加载
                        layer.closeAll('loading');
                    },
                    style: "margin-top:0;"
                });

                // 工具条点击事件
                treeTable.on("tool(" + tableName + ")", function (obj) {
                    var data = obj.data;
                    var layEvent = obj.event;
                    // 当前记录ID
                    var id = data.id;

                    if("addz" === layEvent) {
                        // 添加记录
                        common.edit(_title, 0, _width, _height, ["pid=" + id], _shadeClose);
                    }else if("edit" === layEvent) {
                        // 修改记录
                        common.edit(_title, id, _width, _height, [], _shadeClose);
                    }else if("del" === layEvent) {
                        // 删除记录
                        common.drop(id, function (e, n) {
                            n && obj.del();
                        });
                    } else {
                        // 其他操作(回调函数)
                        if (callback) {
                            callback(layEvent, id, 0);
                        }
                    }
                });

                // 全部折叠
                $("#collapse").on("click", function () {
                    tableObj.foldAll();
                    return false;
                });

                // 全部展开
                $("#expand").on("click", function () {
                    tableObj.expandAll();
                    return false;
                });

                // 刷新页面
                $("#refresh").on("click", function () {
                    tableObj.refresh();
                    return false;
                });

                // 搜索，这是在哪里使用？？
                $("#search").click(function () {
                    var keywords = $("#keywords").val();
                    if(keywords) {
                        tableObj.filterData(keywords);
                    } else {
                        tableObj.clearFilter();
                    }
                    return false;
                });
            },

            /**
             * 设置窗体参数,调用组件设置弹窗所需参数，当点击添加、编辑、详情等需要弹窗时组件内部的showWin方法会自动解析；
             * @param title
             * @param width
             * @param height
             * @param shadeClose
             * @returns {func_obj}
             */
            setWin: function (title, width = 0, height = 0, shadeClose = false) {
                _title = title;
                _width = width;
                _height = height;
                _shadeClose = shadeClose;
                return this;
            },

            setDbclick: function (t) {
                _isDbclick = t || true;
                return this;
            },

            /**
             * 搜索事件的捕捉
             * @param filter
             * @param tableListId
             */
            searchForm: function (filter, tableListId) {
                form.on("submit(" + filter + ")", function (data) {
                    common.searchForm(table, data, tableListId);
                    return false;
                });
            },

            /**
             * 获取选中的行参数值
             * @param tableName
             * @returns {*}
             */
            getCheckData: function (tableName) { // 表格id
                if (!tableName) {
                    tableName = _tableName;
                }
                return table.checkStatus(tableName).data; // 获取选中行的数据
            },

            /**
             * 初始化日期
             * @param item
             * @param callback
             */
            initDate: function (item, callback = null) {
                common.initDate(item, function (value, date) {
                    callback && callback(value, date);
                });
            },

            // 页面弹窗
            showWin: function (title, content, width = 0, height = 0, params = [], type = 2, btn = [], callback = null) {
                common.showWin(title, content, width, height, params, type, btn, function (layero, index) {
                    callback && callback(layero, index);
                });
            },

            // 网络POST请求
            ajaxPost: function (url, data, callback = null, msg = "处理中...") {
                common.ajaxPost(url, data, callback, msg);
            },

            // Switch开关
            formSwitch: function (filter, url = "", callback = null) {
                common.formSwitch(filter, url, function (data, isSuccess) {
                    callback && callback(data, isSuccess);
                });
            },

            // 上传文件
            uploadFile: function (elem_id, callback = null, url = "", exts = "xls|xlsx", size = 10240, data = {}) {
                common.uploadFile(elem_id, function (res, is_success) {
                    callback && callback(res, is_success);
                }, url, exts, size, data);
            }
        };

    common.verify(); // 通用验证规则

    // 监听表单提交,按钮点击或者表单被执行提交时触发，其中回调函数只有在验证全部通过后才会进入
    form.on("submit(submitForm)", function (data) {
        common.submitForm(data.field, null, function (res, is_success) {
            console.log("保存成功回调");
        });
        return false; // 对于form标签，需要阻止默认提交
    });

    // 监听搜索提交
    form.on("submit(searchForm)", function (data) {
        common.searchForm(table, data);
        return false; // 对于form标签，需要阻止默认提交
    });

    // 监听工具栏事件
    $(".btnOption").click(function () {
        var data_param = $(this).attr("data-param");
        data_param && (data_param = JSON.parse(data_param));
        var checkData = func_obj.getCheckData(_tableName);
        var lay_event = $(this).attr("lay-event");
        var option;
        switch (lay_event) {
            case"add":
                // id传入0表示这个是新增
                common.edit(_title, 0, _width, _height, data_param);
                break;
            case"batchDrop":
                option = {title: "批量删除"};
                option.url = cUrl + "/batchDrop";
                option.data = checkData;
                option.confirm = true;
                common.batchFunc(option, function () {
                    _tableIns.reload();
                });
                break;
            case"batchCache":
                option = {title: "批量重置缓存"};
                option.url = cUrl + "/batchCache";
                option.data = checkData;
                option.confirm = true;
                common.batchFunc(option, function () {
                    _tableIns.reload();
                });
                break;
            case"batchEnable":
                option = {title: "批量启用状态"};
                option.url = cUrl + "/batchStatus";
                option.param = data_param;
                option.data = checkData;
                option.form = "submitForm";
                option.confirm = true;
                option.show_tips = "处理中...";
                common.batchFunc(option, function () {
                    _tableIns.reload();
                });
                break;
            case"batchDisable":
                option = {title: "批量禁用状态"};
                option.url = cUrl + "/batchStatus";
                option.param = data_param;
                option.data = checkData;
                option.confirm = true;
                common.batchFunc(option, function () {
                    _tableIns.reload();
                });
                break;
            case"export":
                layer.msg("导出");
                location.href = cUrl + "/btn" + lay_event.substring(0, 1).toUpperCase() + lay_event.substring(1);
                break;
            case"import":
                common.uploadFile("import", function (res, is_success) {
                });
        }
    });

    window.formClose = function () {
        var frame = parent.layer.getFrameIndex(window.name);
        parent.layer.close(frame);
    };

    exports("function", func_obj);
});
