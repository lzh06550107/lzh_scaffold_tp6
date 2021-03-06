<?php

namespace app\admin\controller;


use app\admin\service\LayoutService;
use app\common\controller\Backend;
use think\facade\View;

/**
 * 布局-控制器
 *
 * @property LayoutService $service
 * @package app\admin\controller
 */
class Layout extends Backend
{
    /**
     * 初始化
     */
    public function initialize()
    {
        parent::initialize(); // TODO: Change the autogenerated stub
        $this->model = new \app\admin\model\Layout();
        $this->service = new LayoutService();
    }

    /**
     * 添加或编辑
     * @return mixed
     * @since 2020/7/2
     * @author lzh
     */
    public function edit()
    {
        // 布局推荐类型
        View::assign("typeList", config("admin.layout_type"));
        return parent::edit(); // TODO: Change the autogenerated stub
    }
}
