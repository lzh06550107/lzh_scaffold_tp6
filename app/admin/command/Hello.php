<?php

namespace app\admin\command;

use think\console\Command;
use think\console\Input;
use think\console\input\Argument;
use think\console\input\Option;
use think\console\Output;

/**
 * 脚本指令
 *
 * 备注：1、php think hello
 *      2、php think hello lzh
 *      3、php think hello lzh --city 深圳
 * @author lzh
 * @since 2020-04-21
 */
class Hello extends Command
{

    /**
     * 任务配置
     */
    protected function configure()
    {
        // 任务描述
        $this->setName('hello')
            ->addArgument('name', Argument::OPTIONAL, "牧羊人")
            ->addOption('city', null, Option::VALUE_REQUIRED, '南京市')
            ->setDescription('Say Hello');
    }

    /**
     * 执行句柄
     *
     * @param Input $input
     * @param Output $output
     * @return int|null
     */
    protected function execute(Input $input, Output $output)
    {
        // 请求开始
        $output->writeln('请求开始：' . date('Y-m-d H:i:s'));

        // 处理过程
        $name = trim($input->getArgument('name'));
        $name = $name ?: 'thinkphp';
        if ($input->hasOption('city')) {
            $city = PHP_EOL . 'From ' . $input->getOption('city');
        } else {
            $city = '';
        }
        $output->writeln("Hello," . $name . '!' . $city);

        // 请求结束
        $output->writeln("请求结束:" . date('Y-m-d H:i:s'));
    }

}
