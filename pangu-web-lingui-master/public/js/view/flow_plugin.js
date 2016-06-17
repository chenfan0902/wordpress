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
    function Flow(html_id, width, height,item,count) {
      this.html_id = html_id;
      this.width = width;
      this.height = height;
      this.paper = Raphael(this.html_id, this.width, this.height);
      this.data = item;   
      this.movers = Object;       
      this.nodeCount = count;
    }


    Flow.prototype.draw = function() {
              
        this.movers = this.paper.set();      
        var coords = new Coords(50, 50, 80, 250);
        this.drawItem(coords, this.data, this.paper);
        coords.recalculate(0);
        
        coords = new Coords(50, 50, 80, 250);
        this.movers.push(this.paper.circle(coords.start_x, coords.start_y, 10));
        this.movers.attr({fill: "blue", stroke: "none", "fill-opacity": 100});
        this.movers.cx = coords.start_x;
        this.box_distance = coords.box_distance;
        this.start_x = coords.start_x;
        this.end_x = this.start_x+(this.nodeCount-1) * this.box_distance;
        
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

    
    Flow.prototype.drawItem = function(coords, item, paper) {

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
            this.drawItem(coords, item.Children, paper);
        }  
        
    };
    
    return Flow;

  })();

  window.Flow = Flow;

}).call(this);

$(function() {



	//===== Hide/show sidebar =====//

	$('.fullview').click(function(){
	    $("body").toggleClass("clean");
	    $('#sidebar').toggleClass("hide-sidebar mobile-sidebar");
	    $('#content').toggleClass("full-content");
	});



	//===== Hide/show action tabs =====//

	$('.showmenu').click(function () {
		$('.actions-wrapper').slideToggle(100);
	});

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


	//===== Collapsible plugin for main nav =====//
	
	$('.expand').collapsible({
		defaultOpen: 'current,third',
		cookieName: 'navAct',
		cssOpen: 'subOpened',
		cssClose: 'subClosed',
		speed: 200
	});
	
});
