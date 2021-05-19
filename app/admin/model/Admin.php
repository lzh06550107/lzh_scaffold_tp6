<?php

namespace app\admin\model;

use app\common\model\BaseModel;

/**
 * 人员管理模型
 * @package app\admin\model
 */
class Admin extends BaseModel
{
    // 设置数据表名称
    protected $name = "admin";

    /**
     * 获取缓存信息
     * @param int $id 记录ID
     * @return \app\common\model\数据信息|mixed
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @author lzh
     * @since: 2020/6/30
     */
    public function getInfo(int $id)
    {
        $info = parent::getInfo($id);
        if ($info) {
            // 头像
            if ($info['avatar']) {
                $info['avatar_url'] = get_image_url($info['avatar']);
            }

            // 入职日期
            if ($info['entry_date']) {
                $info['format_entry_date'] = datetime($info['entry_date'], 'Y-m-d');
            }

            // 性别
            if ($info['gender']) {
                $info['gender_name'] = config('admin.gender_list')[$info['gender']];
            }

            // 岗位
            if ($info['position_id']) {
                $positionModel = new Position();
                $positionInfo = $positionModel->getInfo($info['position_id']);
                $info['position_name'] = $positionInfo['name'];
            }

            // 职级
            if ($info['level_id']) {
                $levelMod = new Level();
                $levelInfo = $levelMod->getInfo($info['level_id']);
                $info['level_name'] = $levelInfo['name'];
            }

            // 获取城市名称
            if ($info['district_id']) {
                $cityMod = new City();
                $cityName = $cityMod->getCityName($info['district_id'], " ");
                if ($cityName) {
                    $info['city_name'] = $cityName;
                    $cityItem = explode(" ", $cityName);
                    $info['province_name'] = $cityItem[0];
                    $info['city_name'] = $cityItem[1];
                    $info['district_name'] = $cityItem[2];
                }
            }
        }
        return $info;
    }

}
