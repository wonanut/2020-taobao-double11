/*
 * Author: Howard Wonanut
 * Date: 2020-10-29
 * Description: 2020年淘宝双11养猫自动脚本
 * Version: 1.2.2
 */

var VERSION_MAJOR = 1
var VERSION_MINOR = 2
var VERSION_DESC = "当前版本v1.2.2, 该脚本在部分小尺寸手机上可能出现意想不到的运行结果！"
var AUTHOR = "Doran"
var view_speed = 1

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
    var info = confirm(VERSION_DESC);
    if (info == 0) close();
    // 关闭淘宝app
    // closeApp("com.taobao.taobao");

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
    printLog("Mew脚本即将启动，请确保为当前软件开启[无障碍功能]与[悬浮窗]功能", 1);
    printLog("为了确保脚本正常执行，请提前打开[手机淘宝]的养猫界面", 1);
    printLog("作者：" + AUTHOR, 0);
    printLog("当前版本：" + VERSION_MAJOR + '.' + VERSION_MINOR, 0);

    auto.waitFor();
    printLog("正在打开淘宝...", -1);
    launch("com.taobao.taobao");
    randomSleep(5000, 1000);

    var cho = dialogs.singleChoice("当前是否在猫猫界面", ["是", "否"], 0);
    if (cho == 1) {
        printLog("为了兼容所有机型，请提前打开[手机淘宝]的养猫界面后重启本程序", 3);
        close();
    }
}

function dotask_alipay(t) {
    printLog("正在进入支付宝完成任务...", -1);
    randomSleep(5000, 2000);
    click(device.width / 2, device.height - 200);
    randomSleep(2000, 1000);
    // dotask_lumiao(t);
    
    click(540, 1800);
    randomSleep(1000, 1000);

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

    printLog("支付宝任务已完成...", -1);
    home();
}

function dotask_lumiao(t) {
    if (t == 0) return;

    printLog("正在撸猫中[" + t + "次]...", -1);
    var x = parseInt(random(400, 600));
    var y = parseInt(random(900, 1400));
    for(var i = 0; i < t ; i++) {
        randomSleep(200, 200);
        click(x, y);
    }
    printLog("撸猫" + t + "次成就达成", -1);
}

function dotask_taobao(t) {
    dotask_lumiao(t);

    // text("赚喵币").waitFor();

    // sleep(1500);
    // scollSrceen(1);
    // text("赚喵币").findOne().click();
    randomSleep(1000, 1000);
    click(540, 1800);

    var liulan_cnt = 0;
    var sousuo_cnt = 0;
    var wancheng_cnt = 0;
    var guangguang_cnt = 0;

    printLog("正在寻找可以操作的按钮...", 1);

    // 领取奖励
    if (text("领取奖励").exists()) {
        while (textContains("领取奖励").exists) {
            text("领取奖励").findOne().click();
            printLog("领取奖励完成", -1);
            randomSleep(1000, 1000);
        }
    }
    randomSleep(1000, 1000);

    // 我知道了
    if (text("我知道了").exists()) {
        while (textContains("我知道了").exists) {
            text("我知道了").findOne().click();
            printLog("领取[我知道了]奖励完成", -1);
            randomSleep(1000, 1000);
        }
    }

    exit_flag = true;
    while (exit_flag) {
        exit_flag = false;
     
        // 去浏览
        if (text("去浏览").exists()) {
            while (textContains("去浏览").exists) {
                liulan_cnt += 1;
                text("去浏览").findOne().click();
                randomSleep(4000, 3000);
                scollSrceen(4);
                printLog("已经完成第" + liulan_cnt + "个[去浏览]任务", -1);
                back();
                randomSleep(1000, 1000);
            }
            exit_flag = true;
        }
        randomSleep(1000, 1000);

        // 去逛逛
        if (text("去逛逛").exists()) {
            while (textContains("去逛逛").exists) {
                guangguang_cnt += 1;
                text("去逛逛").findOne().click();
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

        // 去完成
        if (text("去完成").exists()) {
            while (textContains("去完成").exists) {
                wancheng_cnt += 1;
                text("去完成").findOne().click();
                randomSleep(22000, 3000);
                printLog("已经完成第" + wancheng_cnt + "个[去完成]任务", -1);
                back();
                randomSleep(1000, 1000);
                if (wancheng_cnt >= 5) break;
            }
            exit_flag = true;
        }
        randomSleep(1000, 1000);

        // 去搜索
        if (text("去搜索").exists()) {
            while (textContains("去搜索").exists) {
                sousuo_cnt += 1;
                text("去搜索").findOne().click();
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
    }

    printLog("今天的所有淘宝任务都已经完成", -1);
    dotask_alipay(t);
}

function close() {
    // 关闭悬浮窗
    printLog("感谢使用Mew猫猫脚本，明天见~", 2);
    sleep(5000);
    printLog("脚本已关闭", -2)
    console.hide();
    exit();
}

function randomSleep(base, range) {
    sleep(base + Math.floor(Math.random() * range));
}

function scollSrceen(scollTimes) {
    for(var i = 0; i < scollTimes; i++) {
        var sleepTime = parseInt(random(1000*(i+1), 1800*(i+1)));
        sleep(sleepTime * view_speed);
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
exit_flag = true;
while (exit_flag) {
    var cho = dialogs.singleChoice("请选择脚本运行模式", ["点猫猫*50", "点猫猫*200", "点猫猫20+浏览广告", "浏览[淘宝/支付宝]广告", "退出"], 0);
    switch (cho) {
        case 0:
            printLog("你选择了点猫猫模式, 将自动点猫猫30下", -1);
            dotask_lumiao(30);
            break;
        case 1:
            printLog("你选择了点猫猫模式, 将自动点猫猫200下", -1);
            dotask_lumiao(200);
            break;
        case 2:
            printLog("你选择了点猫猫+浏览广告模式", -1);
            dotask_taobao(20);
            exit_flag = false;
            break;
        case 3:
            printLog("你选择了浏览广告模式(包括支付宝)", -1);
            dotask_taobao(0);
        case 4:
        default:
            exit_flag = false;
            break;
    }
}

close();