var random = Math.random();
var num = 5;
var rand1 = Math.round(random * (num - 1)) + 1;
images = new Array
images[1] = "/static/img/image1.jpg"
images[2] = "/static/img/image2.jpg"
images[3] = "/static/img/image3.jpg"
images[4] = "/static/img/image4.jpg"
images[5] = "/static/img/image5.jpg"
var image = images[rand1]

$('body').css('background-image', 'url(' + image + ')');
$('body').css('background-repeat', 'no-repeat');
$('body').css('background-position', 'center');
$('body').css('background-attachment', 'fixed');

document.getElementById('container').style.display = "block";
document.getElementById('container_reg').style.display = "none";
$('')

function submit() {
	var username = $('#username').val();
	var password = $('#password').val();

	$.ajax({
    	url: '/backend/login/' + username + '/' + password,
    	type: 'get',
    	success: function(result) {
      		location.reload();
    	},
    	error: function(html) {
      		console.debug(html);
    	}
	});  
}

function register() {
	document.getElementById('container_reg').style.display = "block";
	document.getElementById('container').style.display = "none";
}
