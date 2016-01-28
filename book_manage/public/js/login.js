$(function(){
   var table = $('#table');
   table.delegate('.login', 'click', function () {
   	var name = $("#username").val(); 
   	var password=$("#password").val();
   	$.ajax({
    type: 'get',
    url: '/login',
    cache: 'false',
    data: {
            username:name,
            password:password                
          },
    success: function(data){
    	alert("传入数据库");
    },
    failure: function(data){
            alert("登录失败！");
            }
     });
   });
});