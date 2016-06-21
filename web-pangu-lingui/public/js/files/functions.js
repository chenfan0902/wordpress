$(function() {


    //===== Hide/show sidebar =====//

    $('.fullview').click(function(){
        $("body").toggleClass("clean");
        $('#sidebar').toggleClass("hide-sidebar mobile-sidebar");
        $('#content').toggleClass("full-content");
        $('.navigation.widget').toggleClass("hide");
    });
    $('.showmenu').click(function(){
        $('#content > .wrapper').toggleClass('hide-wrapper');
    });



    //===== Hide/show action tabs =====//

    $('.showmenu').click(function () {
        $('.actions-wrapper').slideToggle(100);
    });

    $('ul.navigation > li > ul > li').click(function (e) {
        if($('body').scrollTop() > 100) {
            $('body').animate({scrollTop: '0px'}, 500);
        }
    });


    //===== File manager =====//    

    var elf = $('#file-manager').elfinder({
        url : 'php/connector.php',  // connector URL (REQUIRED)
        uiOptions : {
            // toolbar configuration
            toolbar : [
                ['back', 'forward'],
                ['info'],
                ['quicklook'],
                ['search']
            ]
        },
        contextmenu : {
          // Commands that can be executed for current directory
          cwd : ['reload', 'delim', 'info'],
          // Commands for only one selected file
          files : ['select', 'open']
        }
    }).elfinder('instance');



    //===== File uploader =====//

    $("#file-uploader").pluploadQueue({
        runtimes : 'html5,html4',
        url : 'php/upload.php',
        max_file_size : '1kb',
        unique_names : true,
        filters : [
            {title : "Image files", extensions : "jpg,gif,png"}
        ]
    });



    //===== Generate random values for bars in stats widgets =====//

    function generateNumber(min, max) {
        min = typeof min !== 'undefined' ? min : 1;
        max = typeof max !== 'undefined' ? max : 100;
        return Math.floor((Math.random() * max) + min);
    };

    setInterval(function() {
        $('.info-aapl li span').each(function(index, elem) {
            $(elem).animate({
                height: generateNumber(1, 40)
            });
        });
    }, 3000);



    //===== Calendar =====//

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $('#calendar').fullCalendar({

        header: {
            left: 'prev,next',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        dayClick: function() {

            alert('a day has been clicked!');

        }


    });



    //===== Make code pretty =====//

    window.prettyPrint && prettyPrint();



    //===== Media item hover overlay =====//

    $('.view').hover(function(){
        $(this).children(".view-back").fadeIn(200);
    },function(){
        $(this).children(".view-back").fadeOut(200);
    });



    //===== Time pickers =====//

    $('#defaultValueExample, #time').timepicker({ 'scrollDefaultNow': true });

    $('#durationExample').timepicker({
        'minTime': '2:00pm',
        'maxTime': '11:30pm',
        'showDuration': true
    });



    $('#onselectExample').on('changeTime', function() {
        $('#onselectTarget').text($(this).val());
    });

    $('#timeformatExample1, #timeformatExample3').timepicker({ 'timeFormat': 'H:i:s' });
    $('#timeformatExample2, #timeformatExample4').timepicker({ 'timeFormat': 'h:i A' });



    //===== Color picker =====//

    $('#cp1').colorpicker({
        format: 'hex'
    });
    $('#cp2').colorpicker();
    $('#cp3').colorpicker();
        var bodyStyle = $('html')[0].style;
    $('#cp4').colorpicker().on('changeColor', function(ev){
        bodyStyle.background = ev.color.toHex();
    });



    //===== Date pickers =====//

    $( ".datepicker" ).datepicker({
                defaultDate: "+1w",
        showOtherMonths:true,
        changeMonth: false,
        autoSize: true,
            numberOfMonths: 1,
        appendText: '(yyyy-mm-dd)',
        dateFormat: 'yyyy-mm-dd'
    });

    $('.inlinepicker').datepicker({
        defaultDate: "+1w",
        inline: true,
        showOtherMonths:true,
        dateFormat: 'yy-mm-dd',
        yearSuffix: '年',
        defaultDate:'',//默认日期
        showMonthAfterYear:true,//是否把月放在年的后面
        monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
        dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
        dayNamesMin: ['日','一','二','三','四','五','六'],
        onSelect: function(dateText, inst) {
            $("#datepicker").val(dateText);
            $("#date-txt").text(dateText);
            var param = "";
            var reg = new RegExp("[?&]" + "date" + "=([^&]*)(&|$)", "gi");
            var r = window.location.search.substr(1).match(reg);
            if (r != null){
                param = window.location.search.replace(reg,"");
            }else {
                param = window.location.search;
            }
            $('#pickerDataUrl').attr('href',window.location.pathname+param);
            $('#pickerDataUrl').click();
        }
    });


    var dates = $( "#fromDate, #toDate" ).datepicker({
        defaultDate: "+1w",
        changeMonth: false,
        showOtherMonths:true,
        numberOfMonths: 1,
        onSelect: function( selectedDate ) {
            //alert(selectedDate);
            var option = this.id == "fromDate" ? "minDate" : "maxDate",
                instance = $( this ).data( "datepicker" ),
                date = $.datepicker.parseDate(
                    instance.settings.dateFormat ||
                    $.datepicker._defaults.dateFormat,
                    selectedDate, instance.settings );
                    //alert(date);
            dates.not( this ).datepicker( "option", option, date );

        }
    });


    //===== Modals and dialogs =====//

    $("a.bs-alert").click(function(e) {
        e.preventDefault();
        bootbox.alert("Hello world!", function() {
            console.log("Alert Callback");
        });
    });

    $("a.confirm").click(function(e) {
        e.preventDefault();
        bootbox.confirm("Are you sure?", function(confirmed) {
            console.log("Confirmed: "+confirmed);
        });
    });

    $("a.bs-prompt").click(function(e) {
        e.preventDefault();
        bootbox.prompt("What is your name?", function(result) {
            console.log("Result: "+result);
        });
    });

    $("a.dialog").click(function(e) {
        e.preventDefault();
        bootbox.dialog("I am a custom dialog", [{
            "label" : "Success!",
            "class" : "btn-success",
            "callback": function() {
                console.log("great success");
            }
        }, {
            "label" : "Danger!",
            "class" : "btn-danger",
            "callback": function() {
                console.log("uh oh, look out!");
            }
        }, {
            "label" : "Click ME!",
            "class" : "btn-primary",
            "callback": function() {
                console.log("Primary button");
            }
        }, {
            "label" : "Just a button..."
        }, {
            "Condensed format": function() {
                console.log("condensed");
            }
        }]);
    });

    $("a.multiple-dialogs").click(function(e) {
        e.preventDefault();

        bootbox.alert("Prepare for multiboxes...", "Argh!");

        setTimeout(function() {
            bootbox.confirm("Are you having fun?", "No :(", "Yeah!", function(result) {
                if (result) {
                    bootbox.alert("Glad to hear it!");
                } else {
                    bootbox.alert("Aww boo. Click the button below to get rid of all these popups", function() {
                        bootbox.hideAll();
                    });
                }
            });
        }, 1000);
    });

    $("a.dialog-close").click(function(e) {
        e.preventDefault();
        var box = bootbox.alert("This dialog will close in two seconds");
        setTimeout(function() {
            box.modal('hide');
        }, 2000);
    });

    $("a.generic-modal").click(function(e) {
        e.preventDefault();
        bootbox.modal('<img src="http://dummyimage.com/600x400/000/fff" alt=""/>', 'Modal popup!');
    });

    $("a.dynamic").click(function(e) {
        e.preventDefault();
        var str = $("<p>This content is actually a jQuery object, which will change in 3 seconds...</p>");
        bootbox.alert(str);
        setTimeout(function() {
            str.html("See?");
        }, 3000);
    });

    $("a.prompt-default").click(function(e) {
        e.preventDefault();
        bootbox.prompt("What is your favourite JS library?", "Cancel", "OK", function(result) {
            console.log("Result: "+result);
        }, "Bootbox.js");
    });

    $("a.onescape").click(function(e) {
        e.preventDefault();
        bootbox.dialog("Dismiss this dialog with the escape key...", {
            "label" : "Press Escape!",
            "class" : "btn-danger",
            "callback": function() {
                console.log("Oi! Press escape!");
            }
        }, {
            "onEscape": function() {
                bootbox.alert("This alert was triggered by the onEscape callback of the previous dialog", "Dismiss");
            }
        });
    });

    $("a.nofade").click(function(e) {
        e.preventDefault();
        bootbox.dialog("This dialog does not fade in or out, and thus does not depend on <strong>bootstrap-transitions.js</strong>.",
        {
            "OK": function() {}
        }, {
            "animate": false
        });
    });

    $("a.nobackdrop").click(function(e) {
        e.preventDefault();
        bootbox.dialog("This dialog does not have a backdrop element",
        {
            "OK": function() {}
        }, {
            "backdrop": false
        });
    });

    $("a.icons-explicit").click(function(e) {
        e.preventDefault();
        bootbox.dialog("Custom dialog with icons being passed explicitly into <b>bootbox.dialog</b>.", [{
            "label" : "Success!",
            "class" : "btn-success",
            "icon"  : "icon-ok-sign icon-white"
        }, {
            "label" : "Danger!",
            "class" : "btn-danger",
            "icon"  : "icon-warning-sign icon-white"
        }, {
            "label" : "<span>Click ME!</span>",
            "class" : "btn-primary",
            "icon"  : "icon-ok icon-white"
        }, {
            "label" : "Just a button...",
            "icon"  : "icon-picture"
        }]);
    });

    $("a.icons-override").click(function(e) {
        e.preventDefault();
        bootbox.setIcons({
            "OK"      : "icon-ok icon-white",
            "CANCEL"  : "icon-ban-circle",
            "CONFIRM" : "icon-ok-sign icon-white"
        });

        bootbox.confirm("This dialog invokes <b>bootbox.setIcons()</b> to set icons for the standard three labels of OK, CANCEL and CONFIRM, before calling a normal <b>bootbox.confirm</b>", function(result) {
            bootbox.alert("This dialog is just a standard <b>bootbox.alert()</b>. <b>bootbox.setIcons()</b> only needs to be set once to affect all subsequent calls", function() {
                bootbox.setIcons(null);
            });
        });
    });





    //===== Autocomplete =====//

    var tags = [ "ActionScript", "AppleScript", "Asp", "BASIC", "C", "C++", "Clojure", "COBOL", "ColdFusion", "Erlang", "Fortran", "Groovy", "Haskell", "Java", "JavaScript", "Lisp", "Perl", "PHP", "Python", "Ruby", "Scala", "Scheme" ];
    $( "#autocomplete" ).autocomplete({
        source: tags,
        appendTo: ".autocomplete-append"
    });

    function setSizes() {
        var containerHeight = $(".autocomplete-append input[type=text]").width();
        $(".autocomplete-append").width(containerWidth - 180);
    };



    //===== Typeahead =====//

    $('#typeahead').typeahead({
        source: ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"],
        appendToBody: false
    });



    //===== Jquery UI sliders =====//

    $( "#default-slider" ).slider();

    $( "#increments-slider" ).slider({
        value:100,
        min: 0,
        max: 500,
        step: 50,
        slide: function( event, ui ) {
        $( "#donation-amount" ).val( "$" + ui.value );
    }
    });
    $( "#donation-amount" ).val( "$" + $( "#increments-slider" ).slider( "value" ) );

    $( "#range-slider, #range-slider1" ).slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 75, 300 ],
        slide: function( event, ui ) {
            $( "#price-amount, #price-amount1" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        }
    });
    $( "#price-amount, #price-amount1" ).val( "$" + $( "#range-slider, #range-slider1" ).slider( "values", 0 ) +
      " - $" + $( "#range-slider, #range-slider1" ).slider( "values", 1 ) );

    $( "#slider-range-min, #slider-range-min1" ).slider({
        range: "min",
        value: 37,
        min: 1,
        max: 700,
        slide: function( event, ui ) {
            $( "#min-amount, #min-amount1" ).val( "$" + ui.value );
        }
    });
    $( "#min-amount, #min-amount1" ).val( "$" + $( "#slider-range-min, #slider-range-min1" ).slider( "value" ) );

    $( "#slider-range-max, #slider-range-max1" ).slider({
        range: "max",
        min: 1,
        max: 10,
        value: 2,
        slide: function( event, ui ) {
            $( "#max-amount, #max-amount1" ).val( ui.value );
        }
    });
    $( "#max-amount, #max-amount1" ).val( $( "#slider-range-max, #slider-range-max1" ).slider( "value" ) );



    //===== Loading button =====//

    $('#loading').click(function () {
        var btn = $(this)
        btn.button('loading')
        setTimeout(function () {
          btn.button('reset')
        }, 3000);
    });



    //===== Popover =====// 

    $('.popover-test').popover({
        placement: 'left'
    })
    .click(function(e) {
        e.preventDefault()
    });

    $("a[rel=popover]")
        .popover()
    .click(function(e) {
        e.preventDefault()
    });



    //===== Validation engine =====//

    $("#validate").validationEngine({promptPosition : "topRight:-122,-5"});



    //===== Dual select boxes =====//

    $.configureBoxes();



    //===== Spinner options =====//

    $( "#spinner-default" ).spinner();

    $( "#spinner-decimal" ).spinner({
        step: 0.01,
        numberFormat: "n"
    });

    $( "#culture" ).change(function() {
        var current = $( "#spinner-decimal" ).spinner( "value" );
        Globalize.culture( $(this).val() );
        $( "#spinner-decimal" ).spinner( "value", current );
    });

    $( "#currency" ).change(function() {
        $( "#spinner-currency" ).spinner( "option", "culture", $( this ).val() );
    });

    $( "#spinner-currency" ).spinner({
        min: 5,
        max: 2500,
        step: 25,
        start: 1000,
        numberFormat: "C"
    });

    $( "#spinner-overflow" ).spinner({
        spin: function( event, ui ) {
            if ( ui.value > 10 ) {
                $( this ).spinner( "value", -10 );
                return false;
            } else if ( ui.value < -10 ) {
                $( this ).spinner( "value", 10 );
                return false;
            }
        }
    });

    $.widget( "ui.timespinner", $.ui.spinner, {
        options: {
            // seconds
            step: 60 * 1000,
            // hours
            page: 60
        },

        _parse: function( value ) {
            if ( typeof value === "string" ) {
                // already a timestamp
                if ( Number( value ) == value ) {
                    return Number( value );
                }
                return +Globalize.parseDate( value );
            }
            return value;
        },

        _format: function( value ) {
            return Globalize.format( new Date(value), "t" );
        }
    });

    $( "#spinner-time" ).timespinner();
    $( "#culture-time" ).change(function() {
        var current = $( "#spinner-time" ).timespinner( "value" );
        Globalize.culture( $(this).val() );
        $( "#spinner-time" ).timespinner( "value", current );
    });



    //===== Select2 dropdowns =====//

    $(".select").select2();

    $("#loading-data").select2({
        placeholder: "Enter at least 1 character",
        allowClear: true,
        minimumInputLength: 1,
        query: function (query) {
            var data = {results: []}, i, j, s;
            for (i = 1; i < 5; i++) {
                s = "";
                for (j = 0; j < i; j++) {s = s + query.term;}
                data.results.push({id: query.term + i, text: s});
            }
            query.callback(data);
        }
    });

    $("#max-select").select2({ maximumSelectionSize: 3 });

    $("#clear-results").select2({
        placeholder: "Select a State",
        allowClear: true
    });

    $("#min-select2").select2({
        minimumInputLength: 2
    });

    $("#disableselect, #disableselect2").select2(
        "disable"
    );

    $("#minimum-input-single").select2({
        minimumInputLength: 2
    });



    //===== Tags =====//    

    $('.tags').tagsInput({width:'100%'});
    $('.tags-autocomplete').tagsInput({
        width:'100%',
        autocomplete_url:'tags_autocomplete.html'
    });



    //===== Input limiter =====//

    $('.limited').inputlimiter({
        limit: 100,
        boxId: 'limit-text',
        boxAttach: false
    });



    //===== Elastic textarea =====//

    $('.auto').autosize();



    //===== Tooltips =====//

    $('.tip').tooltip();
    $('.focustip').tooltip({'trigger':'focus'});



    //===== Datatables =====//


    //===== Fancybox =====//

    $(".lightbox").fancybox({
        'padding': 2
    });



    //===== Sparklines =====//

    $('#total-visits').sparkline(
        'html', {type: 'bar', barColor: '#ef705b', height: '35px', barWidth: "5px", barSpacing: "2px", zeroAxis: "false"}
    );
    $('#balance').sparkline(
        'html', {type: 'bar', barColor: '#91c950', height: '35px', barWidth: "5px", barSpacing: "2px", zeroAxis: "false"}
    );

    $('#visits').sparkline(
        'html', {type: 'bar', barColor: '#ef705b', height: '35px', barWidth: "5px", barSpacing: "2px", zeroAxis: "false"}
    );
    $('#clicks').sparkline(
        'html', {type: 'bar', barColor: '#91c950', height: '35px', barWidth: "5px", barSpacing: "2px", zeroAxis: "false"}
    );
    $('#rate').sparkline(
        'html', {type: 'bar', barColor: '#5cb1ec', height: '35px', barWidth: "5px", barSpacing: "2px", zeroAxis: "false"}
    );
    $(window).resize(function () {
        $.sparkline_display_visible();
    }).resize();



    //===== Easy tabs =====//

    $('.sidebar-tabs').easytabs({
        animationSpeed: 150,
        collapsible: false,
        tabActiveClass: "active"
    });

    $('.actions').easytabs({
        animationSpeed: 300,
        collapsible: false,
        tabActiveClass: "current"
    });



/*
    //===== Make Google maps visible inaide tabs =====//

    function initialize()
    {
        var mapProp= {
            center: new google.maps.LatLng(-37.814666,144.982452),
            zoom: 12,
            mapTypeId:google.maps.MapTypeId.ROADMAP
        };
        var map=new google.maps.Map(document.getElementById("google-map"),mapProp);

        $('.actions').bind('easytabs:after', function() {
            google.maps.event.trigger(map, 'resize');
            map.setCenter(new google.maps.LatLng(-37.814666,144.982452));
        });

    };
    google.maps.event.addDomListener(window, 'load', initialize);

*/


    //===== Collapsible plugin for main nav =====//

    $('.expand').collapsible({
        defaultOpen: 'current,third',
        cookieName: 'navAct',
        cssOpen: 'subOpened',
        cssClose: 'subClosed',
        speed: 200
    });


    try {
        $('a[data-pjax]').pjax({
            container: '#content',
            cache: true,
            storage: true,
            timeout: 6500,
            url: this.href
        });
    }catch (e){
        console.log(e);
    }

   //updating ctrol begin
    $(document).on('start.pjax', function (e) {
        if(typeof(timeId) !== 'undefined'){
            clearTimeout(timeId);
            delete timeId;
        }
        if(typeof(timeTrade) !== 'undefined'){
            clearTimeout(timeTrade);
            delete timeTrade;
        }
        if(typeof(timeRegion) !== 'undefined'){
            clearTimeout(timeRegion);
            delete timeRegion;
        }
         if(typeof(timeWarning) !== 'undefined'){
            clearTimeout(timeWarning);
            delete timeWarning;
        }
        if(typeof(tuxedoChangeInfo) !== 'undefined'){
            clearTimeout(tuxedoChangeInfo);
            delete tuxedoChangeInfo;
        }
    });

    $(document).on('complete.pjax', function (e) {
        $('#total-visits').sparkline(
            'html', {type: 'bar', barColor: '#ef705b', height: '35px', barWidth: "5px", barSpacing: "2px", zeroAxis: "false"}
        );
        $('#balance').sparkline(
            'html', {type: 'bar', barColor: '#91c950', height: '35px', barWidth: "5px", barSpacing: "2px", zeroAxis: "false"}
        );
        (getCookie('closeWarningTag')==='0')?$('#closeWarning').html('关闭告警'):$('#closeWarning').html('开启告警');
        schedule();
    });
    //updating ctrol end


    var schedule = function(){

        var innerCallbacks = $.Callbacks();
        innerCallbacks.add(function() {
             //访问量
            var param = "";
            var reg = new RegExp("[?&]" + "value" + "=([^&]*)(&|$)", "gi");
            var r = window.location.search.substr(1).match(reg);
            if (r != null){
                param = window.location.search.replace(reg,"");
            }
            param = window.location.pathname + param;
            if(param == '/') param = '/index.html';
            $.ajax({
                type:"GET",
                url:"/getVisitCount.html",
                data:"statUrl="+param,
                dataType:"json",
                success:function(data){
                    if($('#dayVisitCnt'))
                        $('#dayVisitCnt').html(data['dayCnt-'+param]);
                    if($('#allVisitCnt'))
                        $('#allVisitCnt').html(data.allCnt);
                },
                error:function(xhr,status,errMsg){
                    // alert('统计访问量失败！');
                }
            });

        });

        innerCallbacks.add(function() {
            //刷新数据统计及
            $.ajax({
                type:"GET",
                url:"/getStatData.html",
                data:"date="+$("#datepicker").attr("value"),
                dataType:"json",
                success:function(data){
                    $('#DayCalledSum').html('今日调用总数<strong>'+data.DayCalledSum+'</strong>');
                    $('#DayFailedSum').html('今日异常总数<strong>'+data.DayFailedSum+'</strong>');
                    $('#DaySuccessRate').html('今日成功率<strong>'+data.DaySuccessRate+'</strong>');
                    $('#MonCalledSum').html('<strong>'+data.MonCalledSum+'</strong>');
                    $('#MonFailedSum').html('<strong>'+data.MonFailedSum+'</strong>');
                    $('#MonSuccessRate').html('<strong>'+data.MonSuccessRate+'</strong>');
                    //schedule();
                },
                error:function(xhr,status,errMsg){
                    // alert('加载调用统计失败！');
                }
            });
        });

        innerCallbacks.fire();
    }

    function getWarningDetail(warningId,value){
        $.ajax({
            type:"GET",
            url:"/getMailDetail.html",
            data:"warningId="+warningId+"&date="+value,
            dataType:"json",
            success:function(data){
                //var content = '异常类型：'+'<font color=red>'+ data.type+'</font>'+'</br>';
                var content = '';
                content = content + '异常时间：'+ data.time +'</br>';
                if(data.host !='all'){
                    content = content + '异常主机：'+data.host +'</br>';
                }
                content = content + '异常内容：</br>' +'<font color=red>'+ data.detail +'</font>'+'</br></br>';
                $.messager.lays(300, 300);
                $.messager.show('<font color=red><strong>异常警告</strong></font>',content,0,'cover');
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
              if(typeof(XMLHttpRequest.StatusCode) !='undefined' && XMLHttpRequest.StatusCode == 500){
                  //alert(XMLHttpRequest.responseText);
                  //window.location ='/logout';
              }else{
                  //alert("获取邮件明细出错！");
              }
            }
       });
    }
    window.getWarningDetail = getWarningDetail;


    var subscribeMessage = function(bayeuxPara,key,row){
        bayeuxPara.subscribe(key, function(message) {
            //var content = '异常类型：'+'<font color=red>'+ message.type+'</font>'+'</br>';
            if(message.host !='all'){
                if(typeof getWarningInfo === 'function'){
                    getWarningInfo(message);
                }
                if(typeof getWebLogicWarning === 'function'){
                    getWebLogicWarning(message);
                }
            }
            if(getCookie('closeWarningTag') === '1') {
                return;
            }
            var msgSha = CryptoJS.SHA1(JSON.stringify(message));
            if(!$("#"+msgSha)[0]){
                var content = '<div id="'+msgSha+'">';
                content = content + '异常时间：'+ message.time +'</br>';
                content = content + '异常主机：'+ message.host +'</br>';
                content = content + '异常内容：</br>' +'<font color=red>'+ message.detail +'</font>'+'</br>';
                content = content + '-------------------------------------------------------------'+'</br></div>';
                $.messager.lays(300, 500);
                $.messager.show('<font color=red><strong>异常警告</strong></font>',content);
            }
        });
    }

    var callbacks = $.Callbacks('once');

    callbacks.add(function() {
       //刷新数据统计及
        $.ajax({
            type:"GET",
            url:"/getStatData.html",
            data:"date="+$("#datepicker").attr("value"),
            dataType:"json",
            success:function(data){
                $('#DayCalledSum').html('今日调用总数<strong>'+data.DayCalledSum+'</strong>');
                $('#DayFailedSum').html('今日异常总数<strong>'+data.DayFailedSum+'</strong>');
                $('#DaySuccessRate').html('今日成功率<strong>'+data.DaySuccessRate+'</strong>');
                $('#MonCalledSum').html('<strong>'+data.MonCalledSum+'</strong>');
                $('#MonFailedSum').html('<strong>'+data.MonFailedSum+'</strong>');
                $('#MonSuccessRate').html('<strong>'+data.MonSuccessRate+'</strong>');
                //schedule();
            },
            error:function(xhr,status,errMsg){
                //alert('加载调用统计失败！');
            }
        });
    })

    callbacks.add(function() {
        //刷新用户订阅配置
        try{
            var bayeux = new Faye.Client('http://'+$("#fayeHost").attr("value")+'/faye');
        }catch(e){
            alert("Faye异常，请检查Faye服务是否启动！");
            return;
        }
        $.ajax({
            type:"GET",
            url:"/getUserSubscribeType.html",
            data:"",
            dataType:"json",
            success:function(data){
                //subscribe the Warning message
                data.forEach(function(row){
                    if(row.region === 'admin') {
                        subscribeMessage(bayeux, '/SystemMessage/' + row.type + '/' + row.level + '/*',row);
                    }else{
                        subscribeMessage(bayeux,'/SystemMessage/'+row.type+'/'+row.level+'/hb',row);
                    }

                });
            },
            error:function(xhr,status,errMsg){
                //alert(xhr.responseText);
                //window.location ='/logout';
            }
        });
    })

    callbacks.add(function() {
        schedule();
    })

    callbacks.fire();

    function getInbox(){
       //收件箱
        $.ajax({
            type:"GET",
            url:"/getInbox.html",
            data:"",
            dataType:"json",
            success:function(data){
                var innerHTML ='';
                data.forEach(function(row){
                    var dateCa = new Date(row.SubscriptDate);
                    var date = dateCa.getDate() < 10 ? "0" + dateCa.getDate() : dateCa.getDate();
                    var month = (dateCa.getMonth()+1) < 10 ? "0" + (dateCa.getMonth()+1) : (dateCa.getMonth()+1);
                    var year = dateCa.getFullYear();
                    var value = year+"-"+month+"-"+date;
                    if(row.Unread == '0')
                        innerHTML = innerHTML + "<li><a href=\"javascript:getWarningDetail('"+row.SubscriptionId+"','"+value+"');\" title=''><i class='icon-info-sign'></i><strong>"+row.SubscriptionTitle+"</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a><li>";
                    else
                        innerHTML = innerHTML + "<li><a href=\"javascript:getWarningDetail('"+row.SubscriptionId+"','"+value+"');\" title=''><i class='icon-info-sign'></i>"+row.SubscriptionTitle+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a><li>";
                });
                innerHTML = innerHTML + "<li><a  data-pjax='#content' href='/getAllMail.html' title=''><i class='icon-list'></i>更多...</a><li>";
                $('#InboxMenu').html(innerHTML);
                setTimeout(getInbox, 300000);
            },
            error:function(xhr,status,errMsg){
                setTimeout(getInbox, 300000);
            }
        });
    }
   //getInbox();


    function closeWarning() {
        if (getCookie('closeWarningTag') === '0') {
            setCookie('closeWarningTag', '1');
            $('#closeWarning').html('开启告警');
        } else {
            setCookie('closeWarningTag', '0');
            $('#closeWarning').html('关闭告警');
        }
    }

    function addVisitCount(){
        //访问量
        var param = "";
        var reg = new RegExp("[?&]" + "date" + "=([^&]*)(&|$)", "gi");
        var r = window.location.search.substr(1).match(reg);
        if (r != null){
            param = window.location.search.replace(reg,"");
        }
        param = window.location.pathname + param;
        if(param == '/') param = '/index.html';
        $.ajax({
            type:"GET",
            url:"/getVisitCount.html",
            data:"statUrl="+param,
            dataType:"json",
            success:function(data){
                if($('#dayVisitCnt'))
                    $('#dayVisitCnt').html(data['dayCnt-'+param]);
                if($('#allVisitCnt'))
                    $('#allVisitCnt').html(data.allCnt);
            },
            error:function(xhr,status,errMsg){
                // alert('统计访问量失败！');
            }
        });
    }

    function formatDate(t, format){
        format = format || 'yyyy-MM-dd HH:mm:ss.ms';
        if(!t) t = new Date();
        try{
            var time = new Date(t),
                result = '';
            var yyyy = ''+time.getFullYear(),
                yy = yyyy.substr(-2),
                MM = ( '000' + (time.getMonth() + 1)).substr(-2),
                dd = ('000' + time.getDate()).substr(-2),
                HH = ('000' + time.getHours()).substr(-2),
                mm = ('000' + time.getMinutes()).substr(-2),
                ss = ('000' + time.getSeconds()).substr(-2),
                ms = ('000' + time.getMilliseconds()).substr(-3);
            result = format.replace('yyyy', yyyy);
            result = result.replace('yy', yy);
            result = result.replace('MM', MM);
            result = result.replace('dd', dd);
            result = result.replace('HH', HH);
            result = result.replace('mm', mm);
            result = result.replace('ss', ss);
            result = result.replace('ms', ms);
            format = null;
            return result;
        }catch(e){
            throw new Error(e);
        }
    }

    function formatNum(num) {
        if (num > 1000000000) return (num/1000000000).toFixed(1)+'G';
        if (num > 1000000) return (num/1000000).toFixed(1)+'M';
        if (num > 1000) return (num/1000).toFixed(1)+'K';
        return num
    }

    window.closeWarning = closeWarning;
    window.addVisitCount = addVisitCount;
    window.formatDate = formatDate;
    window.formatNum = formatNum;

    //===== Form elements styling =====//

    function setCookie(name,value){
        var Days = 7;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }

    function getCookie(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)) {
            return unescape(arr[2]);
        }else {
            return '0';
        }
    }
    (getCookie('closeWarningTag')==='0')?$('#closeWarning').html('关闭告警'):$('#closeWarning').html('开启告警');
    $(".ui-datepicker-month, .styled, .dataTables_length select").uniform({ radioClass: 'choice' });

});
