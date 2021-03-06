<?php

namespace app\admin\model;

use app\common\model\BaseModel;

/**
 * 会员-模型
 * @author lzh
 * @since 2020/7/3
 * Class User
 * @package app\admin\model
 */
class User extends BaseModel
{
    // 设置数据表名
    protected $name = "user";

    /**
     * 获取缓存信息
     * @param int $id 记录ID
     * @return \app\common\model\数据信息|mixed
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @author lzh
     * @since 2020/7/3
     */
    public function getInfo($id)
    {
        $info = parent::getInfo($id); // TODO: Change the autogenerated stub
        if ($info) {
            // 会员头像
            if ($info['avatar']) {
                $info['avatar_url'] = get_image_url($info['avatar']);
            }

            // 会员性别
            if ($info['gender']) {
                $info['gender_name'] = config('admin.gender_list')[$info['gender']];
            }

            // 设备类型
            $info['device_name'] = config("admin.user_device")[$info['device']];

            // 用户来源
            if ($info['source']) {
                $info['source_name'] = config("admin.user_source")[$info['source']];
            }

            // 格式化出生日期
            if ($info['birthday']) {
                $info['format_birthday'] = datetime($info['birthday'], "Y-m-d");
            }

            // 获取城市名称
            if ($info['district_id']) {
                $cityMod = new City();
                $cityName = $cityMod->getCityName($info['district_id'], " ");
                if ($cityName) {
                    $info['city_area'] = $cityName;
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
