<?php

namespace app\admin\service;

use app\admin\model\User;
use app\common\service\BaseService;

/**
 * 会员管理-服务类
 * @author lzh
 * @since 2020/7/3
 * Class UserService
 * @package app\admin\service
 */
class UserService extends BaseService
{
    /**
     * 构造函数
     * @author lzh
     * @since 2020/7/3
     * UserService constructor.
     */
    public function __construct()
    {
        $this->model = new User();
    }

    /**
     * 添加或编辑
     * @return array
     * @since 2020/7/4
     * @author lzh
     */
    public function edit()
    {
        // 请求参数
        $data = request()->param();
        // 头像处理
        $avatar = trim($data['avatar']);
        if (strpos($avatar, "temp")) {
            $data['avatar'] = save_image($avatar, 'user');
        } else {
            $data['avatar'] = str_replace(IMG_URL, "", $data['avatar']);
        }
        // 出生日期
        if ($data['birthday']) {
            $data['birthday'] = strtotime($data['birthday']);
        }
        return parent::edit($data); // TODO: Change the autogenerated stub
    }
}
