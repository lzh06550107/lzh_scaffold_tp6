<?php

namespace app\common\service;

/**
 * 服务基类
 */
class BaseService
{
    // 模型
    protected $model;

    /**
     * 获取数据列表
     * @return array
     */
    public function getList()
    {
        // 初始化变量
        $map = [];
        $sort = 'id desc'; // 默认按主键降序排序
        $is_sql = 0; // 是否打印SQL

        // 获取参数，一般是控制层调用时传递的参数
        $argList = func_get_args();
        if (!empty($argList)) {
            // 查询条件
            $map = (isset($argList[0]) && !empty($argList[0])) ? $argList[0] : [];
            // 排序
            $sort = (isset($argList[1]) && !empty($argList[1])) ? $argList[1] : 'id desc';
            // 是否打印SQL
            $is_sql = isset($argList[2]) ? isset($argList[2]) : 0;
        }

        // 常规查询条件，一般是客户端传递过来的参数
        $param = request()->param();
        if ($param) {
            // 筛选名称
            if (isset($param['name']) && $param['name']) {
                $map[] = ['name', 'like', "%{$param['name']}%"];
            }

            // 筛选标题
            if (isset($param['title']) && $param['title']) {
                $map[] = ['title', 'like', "%{$param['title']}%"];
            }

            // 筛选类型
            if (isset($param['type']) && $param['type']) {
                $map[] = ['type', '=', $param['type']];
            }

            // 筛选状态
            if (isset($param['status']) && $param['status']) {
                $map[] = ['status', '=', $param['status']];
            }

            // 手机号码
            if (isset($param['mobile']) && $param['mobile']) {
                $map[] = ['mobile', '=', $param['mobile']];
            }
        }

        // 设置查询条件
        if (is_array($map)) {
            $map[] = ['mark', '=', 1];
        } elseif ($map) {
            $map .= " AND mark=1 ";
        } else {
            $map .= " mark=1 ";
        }
        $result = $this->model->where($map)->order($sort)->page(PAGE, PERPAGE)->column("id");

        // 打印SQL
        if ($is_sql) {
            echo $this->model->getLastSql();
        }

        $list = [];
        if (is_array($result)) {
            foreach ($result as $val) {
                $info = $this->model->getInfo($val);
                $list[] = $info;
            }
        }

        //获取数据总数
        $count = $this->model->where($map)->count();

        //返回结果
        $message = array(
            "msg" => '操作成功',
            "code" => 0,
            "data" => $list,
            "count" => $count,
        );
        return $message;
    }

    /**
     * 添加或编辑
     * @return array
     */
    public function edit()
    {
        // 获取参数
        $argList = func_get_args();
        // 查询条件
        $data = $argList[0] ?? [];
        // 是否打印SQL
        $is_sql = $argList[1] ?? false;
        if (!$data) {
            $data = request()->param();
        }
        $error = '';
        $rowId = $this->model->edit($data, $error, $is_sql);
        if (!$rowId) {
            return message($error, false);
        }
        return message(); // 操作成功
    }

    /**
     * 设置记录状态
     * @return array
     */
    public function setStatus()
    {
        $data = request()->param();
        if (!$data['id']) {
            return message('记录ID不能为空', false);
        }
        if (!$data['status']) {
            return message('记录状态不能为空', false);
        }
        $error = '';
        $rowId = $this->model->edit($data, $error);
        if (!$rowId) {
            return message($error, false);
        }
        return message();
    }

}
