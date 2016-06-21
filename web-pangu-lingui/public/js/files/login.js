$(function() {

	//===== Form elements styling =====//
	
	  $(".styled").uniform({ radioClass: 'choice' });

	  document.forms[0].action="/auth.html"+"/1";
	  $("#ck_rmbUser").click(function(){
	    if(this.checked)
	       document.forms[0].action="/auth.html"+"/1";
	    else
	       document.forms[0].action="/auth.html"+"/0";
    })
	  
	/*   $("#dialog-message").dialog({
            modal: true,
            autoOpen: false,
            resizable: true,
            title: "Error",
            buttons: {
                Ok: function() {
                    $(this).dialog( "close" );     
                }
            }
     });
	
    $("#loginBtn").click(function(e){
       
       if(check()){           
            $.ajax({  
                type:"post",  
                url:"/auth.html",  
                data:"",  
                dataType:"html",  
                success:function(data){ 
                  $('#stepDiv'+nodeId).html(data);  
                },  
                error:function(xhr,status,errMsg){  
                  alert(errMsg);  
                }  
            }); 
        }
    });*/

});


/*function check(){ 
    var username = $("#regular").val(); 
    var password = $("#pass").val(); 
    if(username == "" || username == "请输入用户名"){ 
        $("#errorBox").html("&nbsp;&nbsp;&nbsp;请输入用户名！");
        $("#dialog-message").dialog( "open" );      
        return false; 
    } 
    if(password == "" || password == "请输入密码"){ 
        $("#errorBox").html("&nbsp;&nbsp;&nbsp;请输入密码！");
        $("#dialog-message").dialog( "open" );    
        return false;   
    } 
    return true; 
} */
	