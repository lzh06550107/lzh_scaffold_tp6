<?php

function getStringArray(array $array)
{
    foreach ($array as $key => $row) {
        if (is_array($row)) { // 如果是数组递归处理
            $array[$key] = getStringArray($row);
        } elseif (is_object($row)) { // 如果是对象
            //TODO...
        } else { // 其它基本类型都转换为字符串
            $array[$key] = (string)$row;
        }
    }
    return $array;
}

$test = [[1,2],'key' => [3,4]];

var_dump(getStringArray($test));