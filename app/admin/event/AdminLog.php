<?php

namespace app\admin\event;

use app\admin\model\ActionLog;

/**
 * 登录事件，该事件在HttpEnd结束时触发，event.php中注册
 *
 * @author lzh
 * @since 2020-04-21
 */
class AdminLog
{

    /**
     * 登录时间执行句柄
     *
     * @author lzh
     * @since 2020-04-21
     */
    public function handle()
    {
        if (request()->isPost()) {
            ActionLog::record();
        }
    }
}
