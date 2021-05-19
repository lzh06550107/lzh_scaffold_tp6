<?php

// +----------------------------------------------------------------------
// | 模板设置
// +----------------------------------------------------------------------

return [
    // 是否开启模板编译缓存,设为false则每次都会重新编译
    'tpl_cache'          => false,
    // 布局模板开关
    'layout_on'          => true,
    // 布局模板入口文件
    'layout_name'        => 'public/layout',
    // 布局模板的内容替换标识
    'layout_item'        => '{__CONTENT__}',
    // 视图输出字符串内容替换
    'tpl_replace_string' => [
        '__STATIC__'     => '/static',
        '__ADMIN__'      => '/static/admin',
        '__JS__'         => '/static/admin/js',
        '__CSS__'        => '/static/admin/css',
        '__IMAGES__'     => '/static/admin/images',
    ],
    // https://www.cnblogs.com/wanshutao/p/4604310.html
    'taglib_build_in'    => 'cx', // 内置标签使用时不需要前缀

    // https://www.kancloud.cn/manual/thinkphp5_1/354082
    // 预先加载的标签库
    'taglib_pre_load'    => implode(',', [
        \app\admin\widget\Widget::class, // 按钮组件
        \app\admin\widget\Common::class, // 通用组件
        \app\admin\widget\Upload::class, // 上传组件
        \app\admin\widget\Itemcate::class,
        \app\admin\widget\Editor::class, // 富文本组件
        \app\admin\widget\Layout::class,
        \app\admin\widget\Icon::class, // Icon组件
        \app\admin\widget\Checkbox::class, // 复选框组件
        \app\admin\widget\City::class, // 城市组件
        \app\admin\widget\Date::class, // 日期组件
        \app\admin\widget\Transfer::class,
    ]),
];
