
//汇通网数据----------------
//汇通网数据----------------
//汇通网数据----------------
//http://kx.fx678.com/

//过滤注释 https://segmentfault.com/q/1010000002691720
function removeComment( html ) {
    var parent = document.createElement("div");
    parent.innerHTML = html;
    [].forEach.call(parent.childNodes, function(child) {
        if( child.nodeType === 8 ) return parent.removeChild( child );
        if( child.nodeType === 1 ) child.innerHTML = removeComment( child.innerHTML );
    });
    return parent.innerHTML;
}
//返回随机唯一 字符串主键作为数据id
function randStr(){
    return Date.parse(new Date()).toString().substr(0,5)+Math.random().toString(36).substr(2)
}

//返回length位时间戳,php是10位，js是15位
function timest(length=10){
    var tmp = Date.parse(new Date()).toString();
    return parseInt(tmp.substr(0,length));
}

//ajax传数据
function ajaxPost(data){
    $.ajax({
        url:"https://live.ansion.cc/Ceofx/push",
        type:'post',
        data:{
            admin:'#$ERFDWQQ@#',
            json:JSON.stringify(data)
        },
        success:function(data){
        }
    });
}
//获得第一个dom
function getFirstDOM(){
    return document.querySelector('.body_zb_li');
}

//获得第一条新闻id,参数dom==1代表获取最新的一条数据
function getDOMId(dom){
    return dom.classList.toString().indexOf('zb-adv') != -1?false:dom.id;
}

//返回图片地址,参数dom==1代表获取最新的一条数据
function getDOMImg(dom){
    var src = '';
    if(dom.querySelector('.zb_pic') != null){
        src = dom.querySelector('.zb_pic img').src.replace(/\/sl_/,'/sy_');
    }
    return src;
}
//获得第一条新闻信息
function getDOMInfo(dom){
    var first_div = dom;
    var arr = new Object();
    arr.is_link = first_div.querySelector('.more_end2') == null?0:1; //网站内链
    arr.is_index = first_div.getAttribute('type') == null?0:1;//是否是指数
    if(arr.is_link === 1|| arr.is_index ===1)return false;
    arr.id = randStr();
    arr.addtime = timest();
    arr.title = removeComment(first_div.querySelector('.list_font_pic a').innerHTML.trim()); //HTML文本
    arr.img_url = getDOMImg(first_div);
    arr.is_important = first_div.querySelector('.list_font_pic').classList.toString().indexOf('red_color_f') == -1?0:1;  //是否是重要信息
    arr.from_id = 3;//汇通网数据
    arr.type = 1; //一句话新闻
    return arr;
}

var first_id = 0;

//首次采集只采集第一条
function timer(){
    var first_dom = getFirstDOM();
    var new_first_id = getDOMId(first_dom);
    if(new_first_id == false) new_first_id = first_id;

    var info = new Array();
    if(first_id != new_first_id){
        first_id = new_first_id;
        var dom_info = getDOMInfo(first_dom);
        if(dom_info != false){
            info.push(dom_info);
            ajaxPost(info);
        }


    }
}

//第二次之后采集要采集第一条之后的所有数据
function timer1(){
    var first_dom = getFirstDOM();
    var new_first_id = getDOMId(first_dom);
    if(new_first_id == false) {
        new_first_id = first_id;
    }else {
        var new_first_id1 = new_first_id;
    }

    var info = new Array();
    if(first_id != new_first_id){
        while(first_id != new_first_id){
            var dom_info = getDOMInfo(first_dom);
            if(dom_info != false){
                info.push(dom_info);
                first_dom = first_dom.nextElementSibling
            }
            new_first_id = getDOMId(first_dom);
        }
        first_id = new_first_id1;
        if(info.length != 0){
            ajaxPost(info);
        }
    }
}

timer();
var timer1_id = setInterval(timer1,100);