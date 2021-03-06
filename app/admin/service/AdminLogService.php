<?php

namespace app\admin\service;

use app\admin\model\ActionLog;
use app\common\service\BaseService;

/**
 * 登录日志
 * @package app\admin\service
 */
class AdminLogService extends BaseService
{
    /**
     * 构造函数
     */
    public function __construct()
    {
        $this->model = new ActionLog();
    }

    /**
     * 获取数据列表
     * @return array
     */
    public function getList()
    {
        // 查询条件
        $param = request()->param();

        // 查询条件
        $map = [
            ['title', 'like', ['%系统登录', '系统退出%'], 'OR'],
        ];

        // 日志标题
        $title = isset($param['title']) ? $param['title'] : '';
        if ($title) {
            $map[] = ['title', 'like', "%{$title}%"];
        }

        return parent::getList($map); // TODO: Change the autogenerated stub
    }
}
