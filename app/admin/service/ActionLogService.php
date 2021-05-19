<?php

namespace app\admin\service;

use app\admin\model\ActionLog;
use app\common\service\BaseService;


/**
 * 行为日志-服务类
 * @package app\admin\service
 */
class ActionLogService extends BaseService
{
    /**
     * 构造函数
     */
    public function __construct()
    {
        $this->model = new ActionLog();
    }
}
