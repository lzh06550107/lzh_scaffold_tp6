<?php

namespace app\admin\service;

use app\admin\model\Admin;
use app\admin\model\AdminRom;
use app\admin\model\Menu;
use app\common\service\BaseService;

/**
 * 管理员的角色菜单关系-服务类
 * @author lzh
 * @since 2020/7/3
 * Class AdminRomService
 * @package app\admin\service
 */
class AdminRomService extends BaseService
{
    /**
     * 构造函数
     * @author lzh
     * @since 2020/7/3
     * AdminRomService constructor.
     */
    public function __construct()
    {
        $this->model = new AdminRom();
    }

    /**
     * 获取权限菜单列表
     * @return array
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @since 2020/7/3
     * @author lzh
     */
    public function getList()
    {
        // 类型
        $type = request()->param("type");
        // 类型ID
        $typeId = request()->param('typeId');

        // 获取所有菜单
        $menuMod = new Menu();
        $menuList = $menuMod->getList([], 'sort asc');
        // 获取有权限的菜单
        $where = [
            ['type', '=', $type],
            ['type_id', '=', $typeId],
        ];
        $adminRomMod = new AdminRom();
        $permissionList = $adminRomMod->getList($where, "menu_id asc");
        $checkList = [];
        if ($permissionList) {
            $checkList = array_column($permissionList, "menu_id");
        }
        $list = [];
        if (!empty($menuList)) {
            foreach ($menuList as $val) {
                $data = [];
                $data['id'] = $val['id'];
                $data['name'] = trim($val['name']);
                $data['pId'] = $val['pid'];
                if (in_array($val['id'], $checkList)) {
                    $data['checked'] = true;
                } else {
                    $data['checked'] = false;
                }
                $data['open'] = true;
                $list[] = $data;
            }
        }
        return message("操作成功", true, $list);
    }

    /**
     * 设置权限
     * @return array
     * @throws \think\Exception
     * @throws \think\db\exception\BindParamException
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public function setPermission()
    {
        // 参数
        $param = request()->param();
        // 类型
        $type = intval($param['type']);
        // 类型ID
        $typeId = intval($param['typeId']);
        if (!$typeId) {
            return message("类型ID不能为空", false);
        }
        // 删除现有的权限
        $where = [
            ['type', '=', $type],
            ['type_id', '=', $typeId],
        ];
        $adminRomMod = new AdminRom();
        $permissionList = $adminRomMod->getList($where, "menu_id asc");
        if ($permissionList) {
            $itemList = array_column($permissionList, "id");
            $adminRomMod->deleteDAll($itemList, true);
        }
        // 权限ID
        $authIds = trim($param['authIds']);
        if ($authIds) {
            $itemArr = explode(',', $authIds);
            foreach ($itemArr as $val) {
                $data = [
                    'type' => $type,
                    'type_id' => $typeId,
                    'menu_id' => $val,
                ];
                $adminRomMod = new AdminRom();
                $adminRomMod->edit($data);
            }
        }
        return message("操作成功");
    }

    /**
     * 获取权限菜单列表
     * @param int $adminId 用户ID
     * @return array
     */
    public function getPermissionList(int $adminId)
    {
        if ($adminId == 1) { // 超级管理员
            // 管理员(拥有全部权限)
            $menuModel = new Menu();
            return $menuModel->getChilds(0);
        } else {
            // 普通管理员
            $adminMod = new Admin();
            $adminInfo = $adminMod->where("id", $adminId)->find();
            // 获取管理员具有的菜单
            return $this->model->getPermissionMenu($adminInfo['role_ids'], $adminId, 1, 0);
        }
    }

    /**
     * 获取权限节点
     * @param $adminId 用户ID
     * @return array
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     * @since 2021/2/1
     * @author lzh
     */
    public function getPermissionFuncList($adminId)
    {
        if ($adminId == 1) { // 超级管理员具有所有权限
            // 管理员获取所有菜单和节点的权限
            $menuModel = new Menu();
            $menuList = $menuModel->where("type", "=", 4)
                ->where("mark", "=", 1)
                ->field("permission")
                ->select()
                ->toArray();
            $permissionList = array_key_value($menuList, "permission");
            return $permissionList;
        } else {
            // 非超级管理员，即普通管理员
            $adminModel = new Admin();
            $adminInfo = $adminModel->getInfo($adminId);
            // 获取该管理员具有的权限标志符
            $permissionList = $this->model->getPermissionFuncList($adminInfo['role_ids'], $adminId);
            return $permissionList;
        }
    }
}
