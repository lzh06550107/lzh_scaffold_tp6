<?php

// 应用公共文件

if (!function_exists('message')) {

    /**
     * api响应消息
     * @param string $msg 提示语
     * @param bool $success 是否成功
     * @param array $data 结果数据
     * @param int $code 错误码
     * @return array 返回消息对象
     * @author lzh
     * @date 2020/7/1
     */
    function message($msg = "操作成功", $success = true, $data = [], $code = 0)
    {
        $result = ['msg' => $msg, 'data' => $data, 'success' => $success];
        if ($success) {
            // 成功统一返回0
            $result['code'] = 0;
        } else {
            // 失败状态(可配置常用状态码)
            $result['code'] = $code ? $code : -1;
        }
        return $result;
    }
}

// common:select组件中需要的函数
if(!function_exists('make_option')) {

    function make_option($data_list,$selected_id,$show_name,$show_value): string
    {
        $template = '<?php foreach(' . $data_list . ' as $key =>$item ): ?>';
        $template .= '<?php if(isset($item[$show_value]) && isset($item[$show_name])) : ?>';
        $template .= '<?php if ( $item["id"] == '. $selected_id .'): ?>';
        $template .= '<option value="<?php echo $item["'. $show_value .'"]?>" selected><?php echo $item["'. $show_name .'"] ?></option>';
        $template .= '<?php else: ?>';
        $template .= '<option value="<?php echo $item["'. $show_value .'"]?>"><?php echo $item["'. $show_name. '"] ?></option>';
        $template .= '<?php endif; ?>';
        $template .= '<?php else: ?>';
        $template .= '<?php if ( $key == '. $selected_id .'): ?>';
        $template .= '<option value="<?php echo $key ?>" selected><?php echo $item ?></option>';
        $template .= '<?php else: ?>';
        $template .= '<option value="<?php echo $key ?>" ><?php echo $item ?></option>';
        $template .= '<?php endif; ?>';
        $template .= '<?php endif; ?>';
        $template .= '<?php endforeach; ?>';

//        foreach ($data_list as $key => $item) {
//            // 动态获取数据源情况
//            if(isset($item[$show_value]) && isset($item[$show_name])) {
//                if( $item['id'] == $selected_id ) {
//                    $template .= '<option value="' . $item[$show_value] . '" selected>' . $item[$show_name] . '</option>';
//                } else {
//                    $template .= '<option value="' . $item[$show_value] . '" >' . $item[$show_name] . '</option>';
//                }
//            } else { // 指定数据情况
//                if( $key == $selected_id ) {
//                    $template .= '<option value="' . $key . '" selected>' . $item . '</option>';
//                } else {
//                    $template .= '<option value="' . $key . '" >' . $item . '</option>';
//                }
//            }
//
//        }

        return $template;

    }
}
