layui.config({  // common.js是配置layui扩展模块的目录，每个页面都需要引入
    version: '1.0.0',   // 更新组件缓存，设为true不缓存，也可以设一个固定值
    base: getProjectUrl() + 'assets/module/' // 配置layui扩展模块目录
}).extend({ // 配置每个模块分别所在的目录
    steps: 'steps/steps', // 步骤条
    notice: 'notice/notice', // 通知
    cascader: 'cascader/cascader',
    dropdown: 'dropdown/dropdown',
    fileChoose: 'fileChoose/fileChoose',
    Split: 'Split/Split',
    Cropper: 'Cropper/Cropper',
    tagsInput: 'tagsInput/tagsInput',
    citypicker: 'city-picker/city-picker',
    introJs: 'introJs/introJs',
    zTree: 'zTree/zTree',
    croppers: 'croppers/croppers',
    iconPicker: 'iconPicker/iconPicker'
    // 新模块需要在这里添加
}).use(['layer', 'admin', 'function'], function () {
    var $ = layui.jquery;
    var layer = layui.layer;
    var admin = layui.admin; // 加载admin模块
});

/** 获取当前项目的根路径，通过获取layui.js全路径截取assets之前的地址 */
function getProjectUrl() {
    var layuiDir = layui.cache.dir;
    if (!layuiDir) {
        var js = document.scripts, last = js.length - 1, src;
        for (var i = last; i > 0; i--) {
            if (js[i].readyState === 'interactive') {
                src = js[i].src;
                break;
            }
        }
        var jsPath = src || js[last].src;
        layuiDir = jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
    }
    // 原理是获取layui.js的全路径， 并截取assets之前的路径，所以你的layui需要在assets目录下面，assets上一层必须是项目根路径
    return layuiDir.substring(0, layuiDir.indexOf('assets'));
}
