var circles = [];
var noCircles = 6;
var context, canvas;
var width = 0, height = 0, curCircle = null, mouseState;

function initGraphics() {
	setUpContext();

	//Set the canvas to be centered
    $('#canvas').css('left', 600);
    $('#canvas').css('top', 200);
    $('#canvas').css('position', 'absolute');

	width = canvas.width;
    height = canvas.height;
    var firstLine = Math.floor(height / 10 * 2);
    var secondLine = Math.floor(height / 10 * 8);
    var circleSize = Math.floor(width / noCircles);
    var radius = 50;

    $('#pointer-1').css('top', 150 + firstLine);
    $('#pointer-0').css('top', 150 + secondLine);

    circles = [];
    curCircle = null;
    for(var i = 0;i < noCircles; ++i)
        circles.push( [circleSize * i + Math.floor(circleSize / 2), secondLine, radius, 4, i] );
    for(var i = 0;i < noCircles; ++i)
        circles.push( [circleSize * (noCircles - i) - Math.floor(circleSize / 2), firstLine, radius, 4, i + noCircles] );
    
    //register events
    events.registerEvent(canvas, 'mousedown', events.canvasMouseDown, false);
    events.registerEvent(canvas, 'mouseup', events.canvasMouseUp, false);
    events.registerEvent(canvas, 'mousemove', events.canvasMouseMove, false);

    redrawCircles();
    moveArrow(0);
}

function removeBall(ind) {
	circles[ind][3] -= 1;
	redrawCircles();
}

function addBall(ind) {
	circles[ind][3] += 1;
	redrawCircles();
}

function getBalls(ind) {
	return circles[ind][3];
}

function setUpContext() {
	canvas = document.getElementById('canvas');
   
    //Check the element is in the DOM and the browser supports canvas    
    if(!canvas.getContext) {
        alert('Error loading canvas!');
        return;
    }
   
    //Initaliasea 2-dimensionl drawing context
    context = canvas.getContext('2d');
}

function redrawCircles(last, stones) {	
    for(var i = 0;i < circles.length; ++i)
        drawCircle(circles[i], "#6b3203");
	
	if(last != undefined) {
		drawCircle2( [last[0], last[1] + 35, last[2] - 35, stones], 'green');
	}
}

function drawCircle(circle, color) {
    context.beginPath();
    context.arc(circle[0], circle[1], circle[2], 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
    
    var len = (circle[3] > 9 ? 2 : 1);
    context.fillStyle = 'white';
    context.font = "40pt Arial";
    context.fillText(circle[3], circle[0] - 15 * len, circle[1] + 13);
}

function drawCircle2(circle, color) {
    context.beginPath();
    context.arc(circle[0], circle[1], circle[2], 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
    
    var len = (circle[3] > 9 ? 2 : 1);
    context.fillStyle = 'white';
    context.font = "10pt Arial";
    context.fillText(circle[3], circle[0] - 4 * len, circle[1] + 5);
}

function moveArrow(curPlayer) {
    if(curPlayer == 0) {
        $('#pointer-0').css('display','block');
        $('#pointer-1').css('display','none');
    }
    else {
        $('#pointer-0').css('display','none');
        $('#pointer-1').css('display','block');
    }
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt( (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) ); 
}

var events = {
    registerEvent : function (element, event, handler, capture) {
        if (/msie/i.test(navigator.userAgent)) {
          element.attachEvent('on' + event, handler);
        } else {
          element.addEventListener(event, handler, capture);
        }
    },
    canvasMouseDown: function(event) {
        mouseState = 'down';
        
        var cord = mousePosition(event);
        if (curCircle != null)
        	clickBowl(curCircle[4]);
    },
    canvasMouseUp: function(event) {
        mouseState = 'up';
    },
    canvasMouseMove: function(event) {
        
        var cord = mousePosition(event);
        curCircle = null;
        
        for(var i = 0;i < circles.length && curCircle == null; ++i)
            if( dist(cord[0], cord[1], circles[i][0], circles[i][1]) < circles[i][2])
                curCircle = circles[i];
 
		//console.log(gameState)
        if(gameState == true && curCircle != null)
            $('#canvas').css('cursor','pointer');   
        else
            $('#canvas').css('cursor','default');   
        
        if(mouseState == 'down' && curCircle != null)
            clickBowl(curCircle[4]);
    }
}

function cancelGraphics() {
	// do nothing
}

function setBallsScore(player, score) {
    // do nothing
}

function mousePosition(e) {
    // http://www.malleus.de/FAQ/getImgMousePos.html
    // http://www.quirksmode.org/js/events_properties.html#position
    var event, x, y, domObject, posx = 0, posy = 0, top = 0, left = 0;
    //a specific setup for this page, style.css 1005 max width 
    var marginLeft = (document.documentElement.clientWidth - 1005) / 2;
    
    event = e;
    if (!event) {
      event = window.event;
    }
  
    if (event.pageX || event.pageY) 	{
      posx = event.pageX;
      posy = event.pageY;
    } else if (event.clientX || event.clientY) 	{
      posx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    
    domObject = event.target || event.srcElement;

    while ( domObject.offsetParent ) {
      left += domObject.offsetLeft;
      top += domObject.offsetTop;
      domObject = domObject.offsetParent;
    }
    
    domObject.pageTop = top;
    domObject.pageLeft = left;

    x = Math.ceil(posx - domObject.pageLeft);
    y = Math.ceil(posy - domObject.pageTop);
 
    return [x, y];
}
