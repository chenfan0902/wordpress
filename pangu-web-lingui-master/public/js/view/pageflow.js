$(function (){
    var data = JSON.parse($("#flowInfo").attr("value")); 
                 
    var o = {
        'line-width': 4,
        'line-length': 30,
        'text-margin': 13,
        'font-size': 16,
        'font-color': 'white',
        'path-font-color': '#d5d5d5',
        'line-color': '#d5d5d5',  
        'element-color': '#4ab0cd',      
        'fill': '#4ab0cd',
        'yes-text': 'yes',
        'no-text': 'no',
        'arrow-end': 'none',
        'symbols': {     
        'condition': {
            'text-margin': 30
            }
        }
    };
    
    chart = flowchart.parse(data);                
    var  pageHtml = [];
    
    //drawPageFlow
    (function drawPageFlow(flowData,pageHtml){
        if (flowData.drawPathOk) return;
        if(flowData.symbolType !='start' && flowData.symbolType !='end'){
            pageHtml.push("<fieldset class='step' id='"+flowData.key+"'> ");
            pageHtml.push("<div class='step-title'>");
            pageHtml.push("<i>"+flowData.key+"</i>");
            pageHtml.push("<h5>"+flowData.text+"</h5>");
            pageHtml.push("<span>"+flowData.desc+"</span>");
            //if(!flowData.yes && !flowData.no)
               // pageHtml.push("<a onclick=\"getAjaxStepHtml('"+flowData.link+"','"+flowData.key+"')\""+" id='stepHref"+flowData.key+"'></a>");
            pageHtml.push("</div>");
            if(!flowData.yes && !flowData.no)
                pageHtml.push("<div id='stepDiv"+flowData.key+"'></div>");
            else{
                pageHtml.push("<div id='stepDiv"+flowData.key+"'>");
                pageHtml.push("<label class=\"control-label\">"+flowData.text+"：<span class='text-error'>*</span></label>");
                pageHtml.push("<select class=\"input_field_12em link required\" id='select"+flowData.key+"'>");
                pageHtml.push("<option value=\"\">请选择</option>");
                pageHtml.push("<option value='"+flowData.yes.key+"'>是</option>");
                pageHtml.push("<option value='"+flowData.no.key+"'>否</option>");
                pageHtml.push("</select>");
                pageHtml.push("</div>")
            } 
                          
            pageHtml.push("</fieldset>");
        }
        
        if(flowData.no){
            flowData.drawPathOk = true;
            drawPageFlow(flowData.no,pageHtml);  
        }
        if(flowData.yes){
            flowData.drawPathOk = true;
            drawPageFlow(flowData.yes,pageHtml);
        }
        if(flowData.next){
            flowData.drawPathOk = true;
            drawPageFlow(flowData.next,pageHtml);
        }
          
    })(chart.start,pageHtml);

    for(var item in chart.symbols){      
        if(chart.symbols[item].symbolType == 'end'){
            var flowData = chart.symbols[item];
            pageHtml.push("<fieldset class='step' id='"+flowData.key+"'> ");
            pageHtml.push("<div class='step-title'>");
            pageHtml.push("<i>"+flowData.key+"</i>");
            pageHtml.push("<h5>"+flowData.text+"</h5>");
            pageHtml.push("<span>"+flowData.desc+"</span>");
            pageHtml.push("</div>");
            pageHtml.push("<div id='stepDiv"+flowData.key+"'></div>"); 
            pageHtml.push("</fieldset>");
        }
    }
    pageHtml.push("<input type='hidden' id='stepAllData' value='' />");
    $("#flowStep").html(pageHtml.join(""));
       
    //drawFlowChart
    chart.drawSVG('canvas',o);
    if(chart.start.next.symbolType == 'condition'){
        chart.diagram.paper.getById(chart.start.next.key).attr({ src: '/img/flowchart/ask_bg.png'});
    }else{
        chart.diagram.paper.getById(chart.start.next.key).attr({ src:'/img/flowchart/bg.png' });
    }
    chart.diagram.paper.getById(chart.start.key).attr({ src: '/img/flowchart/bg.png'});
    chart.diagram.paper.getById("path"+chart.start.next.key).attr({ stroke: '#4ab0cd'});
    
    
    
    //===== Form wizards =====//
    $("#wizard3").formwizard({       
        formPluginEnabled: true,
        validationEnabled: true,
        focusFirstInput : false,	
        textSubmit : '结束',
        textNext : '下一步',
        textBack : '上一步',
        formOptions :{
        	success: function(data){$("#status2").fadeTo(500,1,function(){ $(this).html("<span>Form was submitted!</span>").fadeTo(5000, 0); })},
        	beforeSubmit: function(data){$("#data2").html("<span>Form was submitted with ajax. Data sent to the server: " + $.param(data) + "</span>");},
        	resetForm: true
        },
        inAnimation : {height: 'show'},
            outAnimation: {height: 'hide'},
        		inDuration : 400,
        		outDuration: 400,
        		easing: 'easeInBack'
        }
    );
    
    $("#wizard3").bind("step_shown", function(event, data){
        
         //删除可能存在的定时任务     
        if(typeof(timeId) !='undefined'){ 
            clearTimeout(timeId);
            delete timeId;
        }
        if(chart.symbols[data.previousStep].symbolType != 'condition')
            $('#stepDiv'+data.previousStep).html("");
        
        if(data.isBackNavigation == true){
            if(chart.symbols[data.currentStep].symbolType != 'condition')
               getAjaxStepHtml(chart.symbols[data.currentStep].link,data.previousStep,data.currentStep)
        }else{
           if(chart.symbols[data.currentStep].symbolType != 'condition')
               getAjaxStepHtml(chart.symbols[data.currentStep].link,data.previousStep,data.currentStep)
        }

        for(var item in chart.symbols){   
            if(item == data.currentStep){
                if(chart.symbols[item].symbolType == 'condition'){
                    chart.diagram.paper.getById(item).attr({ src: '/img/flowchart/ask_bg.png'});
                }else{
                    chart.diagram.paper.getById(item).attr({ src:'/img/flowchart/bg.png' });
                }
            }else{
                
                if(parseInt(item) < parseInt(data.currentStep)){
                    if(chart.symbols[item].symbolType == 'condition'){
                        chart.diagram.paper.getById(item).attr({ src: '/img/flowchart/ask_bg.png'});
                    }else{
                        chart.diagram.paper.getById(item).attr({ src:'/img/flowchart/bg.png' });
                    }
                    
                }else{
                    if(chart.symbols[item].symbolType == 'condition'){
                        chart.diagram.paper.getById(item).attr({ src: '/img/flowchart/grey_bg.png'});
                    }else{
                        chart.diagram.paper.getById(item).attr({ src:'/img/flowchart/grey_rec_bg.png' });
                    }
                }
            }
        }
        
        var currentX =  chart.diagram.paper.getById(data.currentStep).getBBox().x + chart.diagram.paper.getById(data.currentStep).getBBox().width;
        chart.diagram.paper.forEach(function (el) {
            if(el.id.substring(0,4) == 'path'){
                if(parseInt(el.id.substring(4)) <= parseInt(data.currentStep) && el.getBBox().x+el.getBBox().width < currentX)
                    el.attr({ stroke: '#4ab0cd'}); 
                else
                    el.attr({ stroke: '#d5d5d5'}); 
            }                     
        }); 
                       
    });
    
    
    function getAjaxStepHtml(stepUrl,preNode,nodeId){

        if(stepUrl != ''){
            $.ajax({  
                type:"GET",  
                url:stepUrl,  
                data:"date="+$("#datepicker").attr("value")+"&stepAllData="+$('#stepAllData').attr("value")+"&stepId="+nodeId,
                dataType:"html",  
                success:function(data){ 
                  $('#stepDiv'+nodeId).html(data);  
                },  
                error:function(xhr,status,errMsg){  
                  alert(errMsg);  
                }  
            }); 
        } 
    }
    window.getAjaxStepHtml = getAjaxStepHtml;
    
   
    jQuery.extend(jQuery.validator.messages, {
 
        required: "此内容为必填项,请输入!",
        remote: "内容输入错误!",
        email: "E-mail格式错误,请重新输入!",
        url: "网址格式错误,请重新输入!",
        date: "日期格式错误,请重新输入!",
        dateISO: "日期格式错误,请重新输入!",
        number: "请输入合法的数字!",
        digits: "请输入零或正整数!",
        creditcard: "信用卡号格式错误,请重新输入!",
        equalTo: "两次输入不一致,请重新输入!",
        accept: "请输入拥有合法后缀名的字符串!",
        maxlength: jQuery.validator.format("字符串长度不能大于{0}!"),
        minlength: jQuery.validator.format("字符串长度不能小于{0}!"),
        rangelength: jQuery.validator.format("字符串长度只允许在{0}-{1}之间!"),
        range: jQuery.validator.format("输入的数值只允许在{0}-{1}之间!"),
        max: jQuery.validator.format("输入的数值不允许大于{0}!"),
        min: jQuery.validator.format("输入的数值不允许小于{0}!"),
        integer: "请输入合法的整数!",
        positive: "请输入合法的正数!",
        positiveInteger: "请输入合法的正整数!",
        mobile: "手机号码格式错误,请重新输入!",
        phone: "电话号码格式错误,请重新输入!",
        zipCode: "邮政编码格式错误,请重新输入!",
        requiredTo: "此内容为必填项,请输入!",
        username: "只允许包含中文、英文、数字和下划线!",
        prefix: "请输入以 {0} 开头的字符串!",
        lettersonly: "只允许包含字母!",
        alphanumeric: "只允许包含英文、数字和下划线!"
    }); 

        
});