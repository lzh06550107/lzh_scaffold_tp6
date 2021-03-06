<?php

namespace app\admin\model;

use app\common\model\BaseModel;

/**
 * 职级模型
 * @author lzh
 * @since: 2020/6/30
 * Class Level
 * @package app\admin\model
 */
class Level extends BaseModel
{
    // 设置数据表名
    protected $name = "level";

    /**
     * 获取缓存信息
     * @param int $id 记录ID
     * @return \app\common\model\数据信息|mixed
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @author lzh
     * @since: 2020/6/30
     */
    public function getInfo($id)
    {
        return parent::getInfo($id); // TODO: Change the autogenerated stub
    }
}
