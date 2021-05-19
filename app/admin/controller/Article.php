<?php

namespace app\admin\controller;


use app\admin\service\ArticleService;
use app\common\controller\Backend;

/**
 * 文章管理-控制器
 *
 * @property ArticleService $service
 * @package app\admin\controller
 */
class Article extends Backend
{
    /**
     * 初始化
     * @author lzh
     * @since 2020/7/4
     */
    public function initialize()
    {
        parent::initialize(); // TODO: Change the autogenerated stub
        $this->model = new \app\admin\model\Article();
        $this->service = new ArticleService();
    }
}