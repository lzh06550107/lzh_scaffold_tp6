<?php

namespace app\admin\service;

use app\admin\model\Dep;
use app\common\service\BaseService;

/**
 * 部门管理-服务类
 *
 * @package app\admin\service
 */
class DepService extends BaseService
{
    /**
     * 构造函数
     */
    public function __construct()
    {
        $this->model = new Dep();
    }

    /**
     * 获取数据列表
     * @return array
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public function getList()
    {
        $param = request()->param();
        // 查询条件
        $map = [];
        // 部门名称
        $name = getter($param, "name");
        if ($name) {
            $map[] = ['name', 'like', "%{$name}%"];
        }
        $list = $this->model->getList($map, "sort asc");
        return message("操作成功", true, $list);
    }

}
