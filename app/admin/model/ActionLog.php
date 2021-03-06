<?php

namespace app\admin\model;

use app\common\model\BaseModel;
use think\facade\Db;

/**
 * 行为日志-模型
 * @package app\admin\model
 */
class ActionLog extends BaseModel
{
    // 设置数据表
    protected $table = null;
    // 自定义日志标题
    protected static $title = '';
    // 自定义日志内容
    protected static $content = '';

    /**
     * 构造函数
     * @param array $data
     * @throws \think\db\exception\BindParamException
     */
    public function __construct(array $data = [])
    {
        parent::__construct($data);
        // 设置表名
        $this->table = DB_PREFIX . 'action_log_' . date('Y') . '_' . date('m');
        // 初始化行为日志表
        $this->initTable();
    }

    /**
     * 初始化行为日志表
     * @return |null
     * @throws \think\db\exception\BindParamException
     */
    private function initTable()
    {
        $tbl = $this->table;
        if (!$this->tableExists($tbl)) {
            $sql = "CREATE TABLE `{$tbl}` (
                  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '唯一性标识',
                  `action_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '行为ID',
                  `is_admin` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '是否后台操作：1是 2否',
                  `username` varchar(60) CHARACTER SET utf8mb4 NOT NULL COMMENT '操作人用户名',
                  `method` varchar(20) CHARACTER SET utf8mb4 NOT NULL COMMENT '请求类型',
                  `module` varchar(30) NOT NULL COMMENT '模型',
                  `action` varchar(255) NOT NULL COMMENT '操作方法',
                  `url` varchar(200) CHARACTER SET utf8mb4 NOT NULL COMMENT '操作页面',
                  `param` text CHARACTER SET utf8mb4 NOT NULL COMMENT '请求参数(JSON格式)',
                  `title` varchar(100) NOT NULL COMMENT '日志标题',
                  `content` varchar(1000) NOT NULL DEFAULT '' COMMENT '内容',
                  `ip` varchar(18) CHARACTER SET utf8mb4 NOT NULL COMMENT 'IP地址',
                  `user_agent` varchar(360) CHARACTER SET utf8mb4 NOT NULL COMMENT 'User-Agent',
                  `create_user` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '添加人',
                  `create_time` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '添加时间',
                  `mark` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '有效标识：1正常 0删除',
                  PRIMARY KEY (`id`) USING BTREE
                ) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8 COMMENT='系统行为日志表';";
            Db::query($sql);

        }
        return $tbl;
    }

    /**
     * 设置标题
     * @param string $title 标题
     * @author lzh
     * @date 2019/4/4
     */
    public static function setTitle($title)
    {
        self::$title = $title;
    }

    /**
     * 设置内容
     * @param string $content 内容
     * @author lzh
     * @date 2019/4/4
     */
    public static function setContent($content)
    {
        self::$content = $content;
    }

    /**
     * 记录行为日志
     * @author lzh
     * @date 2019/4/4
     */
    public static function record()
    {
        if (!self::$title) {
            // 操作控制器名
            $menuMod = new Menu();
            $info = $menuMod->getOne([
                ['url', '=', request()->url()],
            ]);
            if ($info) {
                if ($info['type'] == 4) {
                    $menuInfo = $menuMod->getInfo($info['pid']);
                    self::$title = $menuInfo['name'];
                } else {
                    self::$title = $info['name'];
                }
            }
        }
        // 日志数据
        $data = [
            'username' => self::$content,
            'module' => app('http')->getName(),
            'action' => request()->url(),
            'method' => request()->method(),
            'url' => request()->url(true), // 获取完成URL
            'param' => request()->param() ? json_encode(request()->param()) : '',
            'title' => self::$title ? self::$title : '操作日志',
            'content' => self::$content,
            'ip' => request()->ip(),
            'user_agent' => request()->server('HTTP_USER_AGENT'),
            'create_user' => empty(session('adminId')) ? 0 : session('adminId'),
            'create_time' => time(),
        ];
        // 日志入库
        self::insert($data);
    }


}
