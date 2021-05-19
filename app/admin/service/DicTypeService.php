<?php

namespace app\admin\service;

use app\admin\model\DicType;
use app\common\service\BaseService;

/**
 * 字典类型-服务类
 * @author lzh
 * @since 2020/7/2
 * Class DicTypeService
 * @package app\admin\service
 */
class DicTypeService extends BaseService
{
    /**
     * 构造函数
     * @author lzh
     * @since 2020/7/2
     * DicTypeService constructor.
     */
    public function __construct()
    {
        $this->model = new DicType();
    }
}
