<?php

namespace app\admin\controller;

use app\admin\service\ItemService;
use app\common\controller\Backend;
use think\facade\View;

/**
 * 站点-控制器
 *
 * @property ItemService $service
 * @package app\admin\controller
 */
class Item extends Backend
{
    /**
     * 初始化
     */
    public function initialize()
    {
        parent::initialize(); // TODO: Change the autogenerated stub
        $this->model = new \app\admin\model\Item();
        $this->service = new ItemService();
    }

    /**
     * 添加或编辑
     * @return mixed
     * @since 2020/7/2
     * @author lzh
     */
    public function edit()
    {
        // 站点类型
        View::assign("typeList", config("admin.item_type"));
        return parent::edit(); // TODO: Change the autogenerated stub
    }
}