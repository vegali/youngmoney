/**
 * Created by lijianyong on 2015/9/10.
 */


var url = document.location.href.split("/");
if(url.indexOf("reg") > 0){
    $('.nav li').removeClass('active');
    $('.nav li').eq(2).addClass('active')
}
if(url.indexOf("login") > 0){
    $('.nav li').removeClass('active');
    $('.nav li').eq(1).addClass('active')
}