/*
 * Author: Howard Wonanut
 * Date: 2020-10-29
 * Description: 2020年淘宝双11养猫自动脚本
 * Version: 1.4
 */

var VERSION_MAJOR = 1
var VERSION_MINOR = 4
var VERSION_TITLE = "自动刷喵币脚本v" + VERSION_MAJOR + "." + VERSION_MINOR;
var VERSION_DESCP = "当前版本能适配各种机型，为了得到足额的喵币请务必使用低版本的淘宝app！(建议版本在V9.0下)\n脚本Github地址：https://github.com/wonanut/2020-taobao-double11";
var AUTHOR = "Doran"
var TASK_LIST = ["淘宝点猫猫", "淘宝赚喵币", "支付宝任务", "京东任务"]
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
                printLog("开始执行[淘宝点猫猫]任务", -1);
                dotask_lumiao();
                break;
            case 1:
                // 淘宝赚喵币
                printLog("开始执行[淘宝赚喵币]任务", -1);
                dotask_taobao();
                break;
            case 2:
                // 支付宝任务
                printLog("开始执行[支付宝喵币]任务", -1);
                dotask_alipay();
                break;
            case 3:
                // 京东任务
                printLog("开始执行[京东]任务", -1);
                dotask_jingdong();
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
    className("android.widget.Button").text("赚喵币").waitFor();

    printLog("开始[点猫猫], 共点击" + PAT_TIMES + "次", -1);
    for(var i = 0; i < PAT_TIMES ; i++) {
        randomSleep(100, 200);
        randomClick("我的猫，点击撸猫", "text");
    }
    printLog("[撸猫" + PAT_TIMES + "次]任务完成", 0);
}

function randomClick(content, item_type) {
    if (item_type == "text") {
        var button = text(content).findOnce();
    }
    else {
        var button = desc(content).findOnce();
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
    
    while (textContains("签到").exists()) {
        var button = text("签到").findOnce();
        if (button == null) break;

        button.click();
        randomSleep(2000, 1000);
        printLog("[签到]成功", -1);
    }

    // 领取奖励
    while (textContains("领取奖励").exists) {
        var button = text("领取奖励").findOnce();
        if (button == null) break;

        button.click();
        randomSleep(2000, 1000);
        printLog("[领取奖励]成功", -1);
    }
    randomSleep(2000, 1000);
    printLog("当前没有[领取奖励]任务", 1);

    // 我知道了
    while (textContains("我知道了").exists) {
        var button = text("我知道了").findOnce();
        if (button == null) break;

        button.click();
        randomSleep(2000, 1000);
        printLog("领取[我知道了]奖励完成", -1);
    }
    randomSleep(2000, 1000);
    printLog("当前没有[我知道了]任务", 1);

    var task_list = ["去浏览", "去逛逛", "去完成", "去搜索"];
    var task_cnt_list = [0, 0, 0, 0];

    exit_flag = true;

    task_list.forEach(task => {
        printLog("正在检测可执行的["+ task + "]任务", 1);
        var task_index = task_list.indexOf(task);
        var task_btn_index = 0;

        while (textContains(task).exists) {
            var button = text(task).findOnce(task_btn_index);
            if (button == null) break;

            button.click();
            randomSleep(4000, 3000);
            
            // 如果进入直播页面直接跳过
            if (task == "去完成" && textContains("观看").exists() && textContains("关注").exists()) {
                printLog("自动跳过[直播]任务", -1);
            }
            if (textContains("淘宝特价版送红包").exists()) {
                printLog("自动跳过[淘宝特价版送红包]任务", -1);
                task_btn_index++;
            }
            else {
                task_list[task_index]++;
                printLog("正在执行[" + task + "]任务", -1);

                scollSrceen(4);
                randomSleep(1000, 1000);
                printLog("已经完成第" + task_cnt_list[task_index] + "个[" + task + "]任务", -1);
            }

            back();
            randomSleep(2000, 1000);

            if (task == "去逛逛" && task_cnt_list[task_index] >= 10) break;
            if (task == "去完成" && task_cnt_list[task_index] >= 12) break;
            if (task == "去搜索" && task_cnt_list[task_index] >= 20) break;
        }

        randomSleep(1000, 1000);
        printLog("当前没有[" + task + "]任务，或者存在无法正常执行任务，请手动解决", 1);
    });

    printLog("[淘宝赚喵币]任务完成！", 0);
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
    while (textContains("领取奖励").exists) {
        var button = text("领取奖励").findOnce();
        if (button == null) break;

        button.click();
        printLog("领取奖励完成", -1);
        randomSleep(2000, 1000);
    }
    randomSleep(1000, 1000);
    printLog("当前没有[领取奖励]任务", 1);

    // 我知道了
    while (textContains("我知道了").exists) {
        var button = text("我知道了").findOnce();
        if (button == null) break;

        button.click();
        printLog("领取[我知道了]奖励完成", -1);
        randomSleep(2000, 1000);
    }
    randomSleep(1000, 1000);
    randomSleep(1000, 1000);
    printLog("当前没有[我知道了]任务", 1);

    var guangguang_cnt = 0;

    // 逛一逛
    printLog("正在检测可执行的[逛一逛]任务", 1);

    while (text("逛一逛").exists) {
        guangguang_cnt += 1;
        var button = text("逛一逛").findOnce();
        if (button == null) break;

        button.click();
        randomSleep(2000, 1000);
        scollSrceen(4);
        printLog("已经完成第" + guangguang_cnt + "个[逛一逛]任务", -1);
        back();
        randomSleep(2000, 1000);
    }
    printLog("当前没有[逛一逛]任务，或者存在无法正常执行任务，请手动解决", 1);

    printLog("[支付宝赚喵币]任务完成！", 0);
    randomSleep(1000, 1000);
}

function dotask_jingdong() {
    printLog("正在打开京东app...", -1);
    launch("com.jingdong.app.mall");
    randomSleep(3000, 2000);

    if (!descContains("浮层活动").exists()) {
        alert("温馨提示", "首页没有找到活动入口\n请手动打开活动页，进入后脚本会自动执行");
    } else {
        randomClick("浮层活动", "desc");
        randomSleep(2000, 1000);
        //部分账号首页的活动浮层默认是收起状态，再次点击(有时候会点击失败，所以用while)
        while (descContains("浮层活动").exists()) {
            randomClick("浮层活动", "desc");
            randomSleep(1000, 1000);
        }
        printLog("若页面有弹窗，请手动关闭，之后脚本会自动执行", -1);
        randomSleep(1000, 1000);
    }

    text("领金币").waitFor();
    randomClick("领金币", "text");
    randomSleep(1000, 1000);

    while (textContains("签到").exists()) {
        var button = text("签到").findOnce();
        if (button == null) break;

        button.click();
        printLog("[签到]成功", -1);
        randomSleep(1000, 1000);
    }

    var wancheng_cnt = 0;
    var current_idx = 0;
    while (textContains("去完成").exists()) {
        var button = text("去完成").findOnce(current_idx);
        if (button == null) break;

        jdClickButton(button);
        printLog("正在执行[去完成]任务", 1);
        randomSleep(3000, 1000);
        
        // 跳过助力任务
        if (className("android.view.View").textContains("取消").exists()) {
            printLog("自动跳过[助力]任务", 1);
            randomClick("取消", "text");
            randomSleep(2000, 1000);
            current_idx++;
        }
        else if (textContains("联合开卡").exists() || textContains("商圈红包").exists()) {
            printLog("自动跳过[红包大作战/联合开卡]任务", 1);
            back();
            randomSleep(2000, 1000);
            current_idx++;
        }
        else if (textContains("任意浏览").exists()) {
            printLog("自动跳过[任意浏览]任务", 1);
            back();
            randomSleep(2000, 1000);
            current_idx++;
        }
        else if (textContains("在当前页").exists()) {
            printLog("自动跳过[加购]任务", 1);
            back();
            randomSleep(2000, 1000);
            current_idx++;
        }
        else {
            // 如果没有点击到[去完成按钮], 重试最多5次
            try_time = 0;
            while (textContains("去完成").exists() && try_time < 5) {
                jdClickButton(button);
                randomSleep(500, 500);
                try_time++;
            }
            if (try_time >= 5) {
                printLog("尝试5次没有正常进入该任务，自动跳过", 1);
                continue;
            }

            wancheng_cnt++;
            scollSrceen(3);
            printLog("完成第" + wancheng_cnt + "个[去完成]任务", 1);
            back();
            randomSleep(2000, 1000);
        }
    }
    printLog("[京东]任务完成！", 0);
    randomSleep(1000, 1000);
}

function jdClickButton(button) {
    var bounds = button.bounds();
    var width = bounds.right - bounds.left;
    var high = bounds.top - bounds.bottom;
    press(random(bounds.left + width / 4, bounds.right - width / 4), random(bounds.top + high / 3, bounds.bottom - high / 3), random(50, 100));
}

function close() {
    // 关闭悬浮窗
    home();
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