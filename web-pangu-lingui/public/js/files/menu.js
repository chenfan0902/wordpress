$(function() {

    function putParentNode(sNodes,data,node){
        try {
            var pushTag = true;
            var parentNode = data.instance.get_parent(node);
            if (parentNode !== 'root' && parentNode !== '#') {
                for (var x = 0; x < sNodes.length; x++) {
                    if (sNodes[x] == parentNode) {
                        pushTag = false;
                        break;
                    }
                }
            } else {
                pushTag = false;
            }
            if (pushTag) {
                sNodes.push(parentNode);
                putParentNode(sNodes, parentNode);
            }
        }catch(e){
            //console.log(e.message);
        }
    }

    selectNodes = [];
    var userMenusObj = JSON.parse($("input[name='user_menus']").val());
    $('#jstree').on('changed.jstree', function (e, data) {
        selectNodes = [];
        var i, j;
        for(i = 0, j = data.selected.length; i < j; i++) {
            var nodeId  = data.instance.get_node(data.selected[i]).id;
            if(nodeId != 'root')
                selectNodes.push(nodeId);
            putParentNode(selectNodes,data,data.selected[i]);

        }
    }).jstree({
        "checkbox" : {
            "keep_selected_style" : false
        },
        "plugins" : [ "checkbox" ],
        "core":{
            "data":userMenusObj
        }
    });


    $("#assignUserMenuBtn").click(function(){

        if($("input[name='user_names']").val() == ""  || $("input[name='assign_user_names']").val() == ""){
            alert("请输入用户名点击获取菜单按钮获取用户菜单！");
            return;
        }

        if($("input[name='user_names']").val() != $("input[name='assign_user_names']").val()){
            alert("改变用户名后请点击获取菜单按钮重新获取菜单！");
            return;
        }
        $.ajax({
            type:"GET",
            url:"/assignUserMenu.html",
            data:"userName="+$("input[name='assign_user_names']").val()+"&selectNodes="+selectNodes.join(','),
            dataType:"text",
            success:function(data){
                alert("用户菜单分配成功！");
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });

});