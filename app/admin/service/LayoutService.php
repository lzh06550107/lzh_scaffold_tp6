<?php

namespace app\admin\service;

use app\admin\model\Layout;
use app\common\service\BaseService;

/**
 * 布局管理-服务类
 * @author lzh
 * @since 2020/7/2
 * Class LayoutService
 * @package app\admin\service
 */
class LayoutService extends BaseService
{
    /**
     * 构造函数
     * @author lzh
     * @since 2020/7/2
     * LayoutService constructor.
     */
    public function __construct()
    {
        $this->model = new Layout();
    }

    /**
     * 添加或编辑
     * @return array
     * @since 2020/7/2
     * @author lzh
     */
    public function edit()
    {
        $data = request()->param();
        $image = trim($data['image']);
        if (!$data['id'] && !$image) {
            return message('请上传封面', false);
        }
        if (strpos($image, "temp")) {
            $data['image'] = save_image($image, 'layout');
        } else {
            $data['image'] = str_replace(IMG_URL, "", $data['image']);
        }
        return parent::edit($data); // TODO: Change the autogenerated stub
    }
}
