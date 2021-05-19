<?php

namespace app\admin\service;

use app\admin\model\ConfigGroup;
use app\common\service\BaseService;

/**
 * 配置分组-服务类
 * @author lzh
 * @since 2020/7/1
 * Class ConfigGroupService
 * @package app\admin\service
 */
class ConfigGroupService extends BaseService
{
    /**
     * 构造函数
     * @author lzh
     * @since 2020/7/1
     * ConfigGroupService constructor.
     */
    public function __construct()
    {
        $this->model = new ConfigGroup();
    }
}
