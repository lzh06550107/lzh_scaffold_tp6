<?php

namespace app\admin\controller;


use app\admin\service\NoticeService;
use app\common\controller\Backend;
use think\facade\View;

/**
 * 通知公告-控制器
 *
 * @property NoticeService $service
 * @package app\admin\controller
 */
class Notice extends Backend
{
    /**
     * 初始化
     */
    public function initialize()
    {
        parent::initialize(); // TODO: Change the autogenerated stub
        $this->model = new \app\admin\model\Notice();
        $this->service = new NoticeService();
    }

    /**
     * 数据列表页
     * @return mixed
     * @since 2020/7/5
     * @author lzh
     */
    public function index()
    {
        // 通知来源
        View::assign("sourceList", config("admin.notice_source"));
        return parent::index(); // TODO: Change the autogenerated stub
    }

    /**
     * 添加或编辑
     * @return mixed
     * @since 2020/7/5
     * @author lzh
     */
    public function edit()
    {
        // 通知来源
        View::assign("sourceList", config("admin.notice_source"));
        // 通知状态
        View::assign("statusList", config('admin.notice_status'));
        return parent::edit(); // TODO: Change the autogenerated stub
    }
}
