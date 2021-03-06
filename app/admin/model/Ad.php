<?php

namespace app\admin\model;

use app\common\model\BaseModel;

/**
 * 广告-模型
 * @author lzh
 * @since 2020/7/2
 * Class Ad
 * @package app\admin\model
 */
class Ad extends BaseModel
{
    // 设置数据表名
    protected $name = "ad";

    /**
     * 获取缓存信息
     * @param int $id 记录ID
     * @return \app\common\model\数据信息|mixed
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @author lzh
     * @since 2020/7/10
     */
    public function getInfo($id)
    {
        $info = parent::getInfo($id); // TODO: Change the autogenerated stub
        if ($info) {
            // 封面
            if ($info['cover']) {
                $info['cover_url'] = get_image_url($info['cover']);
            }

            // 广告类型
            if ($info['type']) {
                $info['type_name'] = config('admin.ad_type')[$info['type']];
            }

            // 广告位
            if ($info['sort_id']) {
                $adSortMod = new AdSort();
                $adSortInfo = $adSortMod->getInfo($info['sort_id']);
                $info['sort_name'] = $adSortInfo['name'] . "=>" . $adSortInfo['loc_id'];
            }
        }
        return $info;
    }
}
