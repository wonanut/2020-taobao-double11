/*
 * Author: Howard Wonanut
 * Date: 2020-10-29
 * Description: 2020年淘宝双11养猫自动脚本
 * Version: 1.3
 */

var VERSION_MAJOR = 1
var VERSION_MINOR = 3
var VERSION_TITLE = "自动刷喵币脚本v" + VERSION_MAJOR + "." + VERSION_MINOR;
var VERSION_DESCP = "当前版本能适配各种机型，为了得到足额的喵币请务必使用低版本的淘宝app！(建议版本在V9.0下)\n脚本Github地址：https://github.com/wonanut/2020-taobao-double11";
var AUTHOR = "Doran"
var TASK_LIST = ["淘宝点猫猫", "淘宝赚喵币", "支付宝任务"]
var PAT_TIMES = 20;

function printLog(msg, level) {
    switch(level) {
        case -2:
            toast(msg);
            break;
        case -1:
            toast(msg);
            console.log(msg);
            break;
        case 0:
            console.info(msg);
            break;
        case 1:
            console.log(msg);
            break;
        case 2:
            console.warn(msg);
            break;
        case 3:
            console.error(msg);
        default:
            break;
    }
}

function init() {
    var info = confirm(VERSION_TITLE, VERSION_DESCP);
    if (info == 0) close();

    auto.waitFor();

    // 设置屏幕尺寸
    setScreenMetrics(device.width, device.height);

    // 设置屏幕常亮60s
    printLog("[Info]为了使得脚本正常运行，屏幕常亮时间设置为60s", 2);
    device.keepScreenDim(60000);

    // 调整多媒体音量为0
    printLog("[Info]为了避免直播广告带来的影响，手机音量调整为2", 2);
    device.setMusicVolume(2);

    // 开启日志悬浮框
    console.show();
    printLog("脚本即将启动，请确保为当前软件开启[无障碍功能]与[悬浮窗]功能", 1);
    printLog("作者：" + AUTHOR, 0);
    printLog("当前版本：" + VERSION_MAJOR + '.' + VERSION_MINOR, 0);
}

function select_tasks() {
    var options = dialogs.multiChoice("可以执行的任务", TASK_LIST);
    if (options == '') {
        close();
    }
    if (options.indexOf(0) > -1) {
        var pat_times_list = [20, 40, 60, 100, 200, 400];
        var idx = dialogs.select("请选择点猫猫次数", pat_times_list);
        if (idx == -1) {
            printLog("非法的点猫猫次数，程序运行结束");
            close();
        }
        PAT_TIMES = Math.floor(Math.random() * 10) - 5 + pat_times_list[idx];
    }
    run_tasks(options);
}

function run_tasks(tasks) {
    tasks.forEach(task => {
        switch (task) {
            case 0:
                // 淘宝点猫猫
                printLog("开始执行淘宝点猫猫任务", -1);
                dotask_lumiao();
                break;
            case 1:
                // 淘宝赚喵币
                printLog("开始执行淘宝赚喵币任务", -1);
                dotask_taobao();
                break;
            case 2:
                // 支付宝任务
                printLog("开始执行支付宝喵币任务", -1);
                dotask_alipay();
                break;
            default:
                break;
        }
    });
}

/*
 * 淘宝点猫猫程序
 * 
 */
function dotask_lumiao() {
    if (PAT_TIMES == 0) return;

    printLog("正在打开淘宝猫猫首页...", -1);
    app.startActivity({
        action: "VIEW",
        data: "taobao://pages.tmall.com/wow/z/hdwk/act-20201111/index"
    });
    randomSleep(3000, 1000);

    printLog("开始点猫猫, 共点击" + PAT_TIMES + "次", -1);
    for(var i = 0; i < PAT_TIMES ; i++) {
        randomSleep(100, 200);
        randomClick("我的猫，点击撸猫", "text");
    }
    printLog("撸猫" + PAT_TIMES + "次成就达成", -1);
}

function randomClick(content, item_type) {
    if (item_type == "text") {
        var button = text(content).findOne();
    }
    else {
        var button = desc(content).findOne();
    }
    clickButton(button);
}

function clickButton(button) {
    var bounds = button.bounds();
    press(random(bounds.left, bounds.right), random(bounds.top, bounds.bottom), random(50, 100));
}

function dotask_taobao() {
    app.startActivity({
        action: "VIEW",
        data: "taobao://pages.tmall.com/wow/z/hdwk/act-20201111/index"
    });
    randomSleep(3000, 1000);

    className("android.widget.Button").text("赚喵币").waitFor();
    randomSleep(1000, 1000);

    if (!textContains("累计任务奖励").exists()) {
        randomClick("赚喵币", "text");
    }
    randomSleep(1000, 2000);

    if (className("android.widget.Button").text("领取奖励").exists()) {
        randomClick("领取奖励", "text");
        printLog("领取奖励成功", -1);
    }
    randomSleep(1000, 1000);

    printLog("正在寻找可以执行的任务...", 1);

    // 领取奖励
    if (text("领取奖励").exists()) {
        while (textContains("领取奖励").exists) {
            text("领取奖励").findOne().click();
            printLog("领取奖励完成", -1);
            randomSleep(1000, 1000);
        }
    }
    randomSleep(1000, 1000);
    printLog("当前没有[领取奖励]任务", 1);

    // 我知道了
    if (text("我知道了").exists()) {
        while (textContains("我知道了").exists) {
            text("我知道了").findOne().click();
            printLog("领取[我知道了]奖励完成", -1);
            randomSleep(1000, 1000);
        }
    }
    randomSleep(1000, 1000);
    randomSleep(1000, 1000);
    printLog("当前没有[我知道了]任务", 1);

    var liulan_cnt = 0;
    var guangguang_cnt = 0;
    var wancheng_cnt = 0;
    var sousuo_cnt = 0;

    exit_flag = true;
    while (exit_flag) {
        exit_flag = false;
     
        // 去浏览
        if (text("去浏览").exists()) {
            while (textContains("去浏览").exists) {
                liulan_cnt += 1;
                text("去浏览").findOne().click();
                printLog("正在执行[去浏览]任务", -1);
                randomSleep(4000, 3000);
                scollSrceen(4);
                printLog("已经完成第" + liulan_cnt + "个[去浏览]任务", -1);
                back();
                randomSleep(1000, 1000);
            }
            exit_flag = true;
        }
        randomSleep(1000, 1000);
        printLog("当前没有[去浏览]任务", 1);

        // 去逛逛
        if (text("去逛逛").exists()) {
            while (textContains("去逛逛").exists) {
                guangguang_cnt += 1;
                text("去逛逛").findOne().click();
                printLog("正在执行[去逛逛]任务", -1);
                randomSleep(4000, 3000);
                scollSrceen(4);
                printLog("已经完成第" + guangguang_cnt + "个[去逛逛]任务", -1);
                back();
                randomSleep(1000, 1000);
                if (guangguang_cnt >= 10) break;
            }
            exit_flag = true;
        }
        randomSleep(1000, 1000);
        printLog("当前没有[去逛逛]任务", 1);

        // 去完成
        if (text("去完成").exists()) {
            while (textContains("去完成").exists) {
                wancheng_cnt += 1;
                text("去完成").findOne().click();
                printLog("正在执行[去完成]任务", -1);
                randomSleep(22000, 3000);

                // 如果进入直播页面不滑动屏幕
                if (textContains("观看").exists() && textContains("关注").exists()) {
                    randomSleep(21000, 1000);
                }
                else {
                    randomSleep(4000, 3000);
                    scollSrceen(4);
                }
                
                printLog("已经完成第" + wancheng_cnt + "个[去完成]任务", -1);
                back();
                randomSleep(1000, 1000);
                if (wancheng_cnt >= 5) break;
            }
            exit_flag = true;
        }
        randomSleep(1000, 1000);
        printLog("当前没有[去完成]任务", 1);

        // 去搜索
        if (text("去搜索").exists()) {
            while (textContains("去搜索").exists) {
                sousuo_cnt += 1;
                text("去搜索").findOne().click();
                printLog("正在执行[去搜索]任务", -1);
                randomSleep(4000, 3000);
                scollSrceen(4);
                printLog("已经完成第" + sousuo_cnt + "个[去搜索]任务", -1);
                back();
                randomSleep(1000, 1000);
                if (sousuo_cnt >= 20) break;
            }
            exit_flag = true;
        }
        randomSleep(1000, 1000);
        printLog("当前没有[去搜索]任务", 1);
    }

    printLog("淘宝赚喵币任务完成！", -1);
    randomSleep(1000, 1000);
}

function dotask_alipay() {
    app.startActivity({
        action: "VIEW",
        data: "alipays://platformapi/startapp?appId=68687502"
    });
    randomSleep(3000, 1000);

    className("android.widget.Button").text("赚喵币").waitFor();
    randomSleep(1000, 1000);

    if (!textContains("累计任务奖励").exists()) {
        randomClick("赚喵币", "text");
    }
    randomSleep(1000, 2000);

    if (className("android.widget.Button").text("领取奖励").exists()) {
        randomClick("领取奖励", "text");
        printLog("领取奖励成功", -1);
    }
    randomSleep(1000, 1000);

    printLog("正在寻找可以执行的任务...", 1);

    // 领取奖励
    if (text("领取奖励").exists()) {
        while (textContains("领取奖励").exists) {
            text("领取奖励").findOne().click();
            printLog("领取奖励完成", -1);
            randomSleep(1000, 1000);
        }
    }
    randomSleep(1000, 1000);
    printLog("当前没有[领取奖励]任务", 1);

    // 我知道了
    if (text("我知道了").exists()) {
        while (textContains("我知道了").exists) {
            text("我知道了").findOne().click();
            printLog("领取[我知道了]奖励完成", -1);
            randomSleep(1000, 1000);
        }
    }
    randomSleep(1000, 1000);
    randomSleep(1000, 1000);
    printLog("当前没有[我知道了]任务", 1);

    var guangguang_cnt = 0;

    // 逛一逛
    if (text("逛一逛").exists()) {
        while (text("逛一逛").exists) {
            guangguang_cnt += 1;
            text("逛一逛").findOne().click();
            randomSleep(2000, 1000);
            scollSrceen(4);
            printLog("已经完成第" + guangguang_cnt + "个[逛一逛]任务", -1);
            back();
            randomSleep(1000, 1000);
        }
    }
    printLog("当前没有[逛一逛]任务", 1);

    printLog("支付宝赚喵币任务完成！", -1);
    randomSleep(1000, 1000);
}


function close() {
    // 关闭悬浮窗
    printLog("任务已完成，感谢使用Mew猫猫脚本，明天见~", 2);
    sleep(5000);
    printLog("脚本已关闭，如果有任务未完成请重启", -2)
    console.hide();
    exit();
}

function randomSleep(base, range) {
    sleep(base + Math.floor(Math.random() * range));
}

function scollSrceen(scollTimes) {
    for(var i = 0; i < scollTimes; i++) {
        var sleepTime = parseInt(random(1000*(i+1), 1800*(i+1)));
        sleep(sleepTime);
        var startX = parseInt(random(300, 550));
        var startY = parseInt(random(1700, 1950));
        var endX = parseInt(random(700, 900));
        var endY = parseInt(random(400, 500));
        var scorllTime = parseInt(random(850, 2200));
        // 滑动
        sml_move(startX, startY, endX, endY, scorllTime);
    }
}

function bezier_curves(cp, t) {
    cx = 3.0 * (cp[1].x - cp[0].x); 
    bx = 3.0 * (cp[2].x - cp[1].x) - cx; 
    ax = cp[3].x - cp[0].x - cx - bx; 
    cy = 3.0 * (cp[1].y - cp[0].y); 
    by = 3.0 * (cp[2].y - cp[1].y) - cy; 
    ay = cp[3].y - cp[0].y - cy - by; 
    
    tSquared = t * t; 
    tCubed = tSquared * t; 
    result = {
        "x": 0,
        "y": 0
    };
    result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x; 
    result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y; 
    return result; 
};

//仿真随机带曲线滑动  
//qx, qy, zx, zy, time 代表起点x,起点y,终点x,终点y,过程耗时单位毫秒
function sml_move(qx, qy, zx, zy, time) {
    var xxy = [time];
    var point = [];
    var dx0 = {
        "x": qx,
        "y": qy
    };
    var dx1 = {
        "x": random(qx - 100, qx + 100),
        "y": random(qy , qy + 50)
    };
    var dx2 = {
        "x": random(zx - 100, zx + 100),
        "y": random(zy , zy + 50),
    };
    var dx3 = {
        "x": zx,
        "y": zy
    };
    for (var i = 0; i < 4; i++) {
        eval("point.push(dx" + i + ")");
    };
    for (let i = 0; i < 1; i += 0.08) {
        xxyy = [parseInt(bezier_curves(point, i).x), parseInt(bezier_curves(point, i).y)];
        xxy.push(xxyy);
    }
    gesture.apply(null, xxy);
};

init();
select_tasks();
close();