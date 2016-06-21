(function() {
    
    var Coords, Flow;
    Coords = (function() {
        function Coords(start_x, start_y, box_r, box_distance) {
              this.start_x = start_x;
              this.start_y = start_y;
              this.box_r = box_r;
              this.box_distance = box_distance;
        }

        Coords.prototype.getChildStartX = function() {
            return this.start_x + this.box_r/2;
        };

        Coords.prototype.getChildStartY = function() {
            return this.start_y;
        };

        Coords.prototype.getChildDrawX = function() {
            return this.box_distance - this.box_r;
        };

        Coords.prototype.getBoxCenterX = function() {
            return this.start_x;
        };

        Coords.prototype.getBoxCenterY = function() {
            return this.start_y;
        };

        Coords.prototype.recalculate = function(iteration) {
            this.start_x = this.start_x + this.box_distance;
            return this.start_y = this.start_y + (150 * iteration);
        };
        return Coords;

    })();


    Flow = (function() {
        function Flow(html_id, width, height,item) {
            this.html_id = html_id;
            this.width = width;
            this.height = height;
            this.paper = Raphael(this.html_id, this.width, this.height);
            this.data = item;
            this.movers = Object;
            this.nodeCnt = 0;
        }


        Flow.prototype.draw = function() {
              
            this.movers = this.paper.set();
            var coords = new Coords(50, 50, 80, 250);
            var a = [];
            this.drawItem(coords, this.data, this.paper,a);
            document.getElementById("flowStep").innerHTML= a.join("");
       // alert(a.join(""));

       
	//===== Form wizards =====//
	
            $("#wizard3").formwizard({
          
                formPluginEnabled: true,
                validationEnabled: false,
                focusFirstInput : false,
                formOptions :{
                    success: function(data){$("#status2").fadeTo(500,1,function(){ $(this).html("<span>Form was submitted!</span>").fadeTo(5000, 0); })},
                    beforeSubmit: function(data){$("#data2").html("<span>Form was submitted with ajax. Data sent to the server: " + $.param(data) + "</span>");},
                    resetForm: true
                },
                inAnimation : {height: 'show'},
                    outAnimation: {height: 'hide'},
                        inDuration : 400,
                        outDuration: 400,
                        easing: 'easeInBack'	//see e.g. http://gsgd.co.uk/sandbox/jquery/easing/ for information on easing
            });
        
        	//===== Flow =====//
    	
            $("#wizard3").bind("step_shown", function(event, data){
                if(flow != undefined){
                    if(data.isBackNavigation == true)
                        flow.pre();
                    else{
                        $('#stepHref'+data.currentStep.substring(4)).click();
                        flow.next();

                    }

                }
            });
        
        
             
            coords.recalculate(0);
            coords = new Coords(50, 50, 80, 250);
            this.movers.push(this.paper.circle(coords.start_x, coords.start_y, 10));
            this.movers.attr({fill: "blue", stroke: "none", "fill-opacity": 100});
            this.movers.cx = coords.start_x;
            this.box_distance = coords.box_distance;
            this.start_x = coords.start_x;
            this.end_x = this.start_x+(this.nodeCnt-1) * this.box_distance;
         
            $('#stepHref1').click();
        
        };
    
    
        Flow.prototype.next = function() {
        
            if(this.movers.cx+this.box_distance > this.end_x)
                return;
            this.movers.cx =  this.movers.cx+this.box_distance;
            this.movers.animate({cx: this.movers.cx,"stroke-width": this.cx / 100 }, 1000);
        };
    
        Flow.prototype.pre = function() {
        
            if(this.movers.cx-this.box_distance < this.start_x)
                return;
            this.movers.cx =  this.movers.cx-this.box_distance;
            this.movers.animate({cx: this.movers.cx,"stroke-width": this.cx / 100 }, 1000);
   
        };

    
        Flow.prototype.drawItem = function(coords, item, paper,a) {
        
            a.push("<fieldset class='step' id='step"+item.nodeId+"'> ");
            a.push("<div class='step-title'>");
            a.push("<i>"+item.nodeId+"</i>");
            a.push("<h5>"+item.nodeName+"</h5>");
            a.push("<span>"+item.nodeDesc+"</span>");
            a.push("<a onclick=\"getAjaxStemHtml('"+item.nodeUrl+"','"+item.nodeId+"','"+item.checkFunction+"'"+")\""+" id='stepHref"+item.nodeId+"'></a>");
            a.push("</div>");
            a.push("<div id='stepDiv"+item.nodeId+"'></div>");
            a.push("</fieldset>");


            if(item.nodeId > this.nodeCnt)
                this.nodeCnt = item.nodeId;

            var targets = paper.set();
            targets.push(paper.circle(coords.start_x, coords.start_y, 40));
            targets.attr({fill: item.colour, stroke: "none", opacity: .5});


            var labels = paper.set();

            labels.push(paper.text(coords.getBoxCenterX(), coords.getBoxCenterY()+coords.box_r/2+10, item.nodeName));

            if (item.Children) {
                paper.path("M " + (coords.getChildStartX()) + " " + (coords.getChildStartY()) + " l " + (coords.getChildDrawX()) + " 0").attr({
                  "arrow-end": "classic-wide-long",
                  "stroke-width": 2,
                  "stroke": "blue"
                });

                coords.recalculate(0);

                this.drawItem(coords, item.Children, paper,a);
            }
        
        };
    
        return Flow;

    })();
  
  
    window.Flow = Flow;
  
    function getAjaxStemHtml(stepUrl,nodeId,checkFunction){

    var param = "";
    if(nodeId != '1'){
        if(checkFunction != ""){
            if(typeof(eval(checkFunction))=="function"){
                if(eval(checkFunction)() == ""){
                    $("#wizard3").formwizard("back");
                }else{
                    param = eval(checkFunction)();
                }
            }
        }
    }

    $.ajax({
        type:"GET",
        url:stepUrl,
        data:"date="+$("#datepicker").attr("value")+"&requestParam="+param,
        dataType:"html",
        succesdates:function(data){
          $('#stepDiv'+nodeId).html(data);
        },
        error:function(){
          alert("ajax exception!");
        }
    });

    }
    window.getAjaxStemHtml = getAjaxStemHtml;

})(this);

