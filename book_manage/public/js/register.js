$(function(){
   var table = $('#table');
   table.delegate('.register', 'click', function () {
       var name = $("#username").val(); 
       var status=1;
       if(name.length<=0){
        $("#msgName").html("用户名为空！");
        status =0;
      }else{
        $("#msgName").html("");
      }
      var pass = $("#password").val();
       if(name.length<=0){
        $("#msgPass").html("密码为空！");
        status=0;
      }else{
        $("#msgPass").html("");
      }
 if(status==1){     
  $.ajax({
    type: 'get',
    url: '/register',
    cache: 'false',
    data: {
            username:name,
            password:pass                
          },
    success: function(data){
            alert("注册成功");
            }, //miss ','
    failure: function(data){
            alert("注册失败！");
            }
     });
}
  });

});



