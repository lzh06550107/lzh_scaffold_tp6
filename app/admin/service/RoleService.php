<?php

namespace app\admin\service;

use app\admin\model\Role;
use app\common\service\BaseService;

/**
 * 角色管理-服务类
 * @package app\admin\service
 */
class RoleService extends BaseService
{
    /**
     * 构造函数
     */
    public function __construct()
    {
        $this->model = new Role();
    }
}
