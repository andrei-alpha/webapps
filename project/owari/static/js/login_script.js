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
setCookie('csrftoken', 'a4d4f6802b0e64489261f2bb25b43b575a875048', 100);

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function setCookie(c_name, value, exdays)
{
  var exdate=new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
  document.cookie=c_name + "=" + c_value;
}

function submit() {
	var data = {}
	data['username'] = $('#username').val();
	data['password'] = CryptoJS.MD5( $('#password-1').val() ).toString();
	data['csrfmiddlewaretoken'] = getCookie('csrftoken');

	$.ajax({
    	url: '/backend/login/',
    	type: 'post',
    	data: data,
    	success: function(json) {
    		token = $.parseJSON(json);
    		setCookie('usertoken', token['usertoken'], 100);
      		location.reload();
    	},
    	error: function(html) {
    		$('#username').val('');
    		$('#password-1').val('');
      		$('#login-message').html('Incorrect user name or password combination.');
    	}
	});  
}

function register() {
	$('#register-message').css('color', 'red');

	var first_name = $('#first_name').val();
	var last_name = $('#last_name').val();
	var email = $('#email').val();
	var password = CryptoJS.MD5( $('#password-2').val() ).toString();
	var country = $('#country').find(':selected').text()
	var csrftoken = getCookie('csrftoken');

	/* Check input for validity. */
	var error = null;
	if (!error && first_name.length < 1)
		error = 'Your first name cannot be empty';
	if (!error && last_name.length < 1)
		error = 'Your last name cannot be empty';
	var re = /\S+@\S+\.\S+/;
	if (!error && !re.test(email) )
		error = 'Your email address is invalid';
	if (!error && password.length < 5)
		error = 'Your password must be at least 5 characters';

	if (error) {
		$('#register-message').html(error);
		return;
	}

	data = {}
	data['first_name'] = first_name;
	data['last_name'] = last_name;
	data['email'] = email;
	data['password'] = password;
	data['country'] = country;
	data['csrfmiddlewaretoken'] = csrftoken;

	$.ajax({
    	url: '/backend/register/',
    	type: 'post',
    	data: data,
    	success: function(result) {
    		$('#register-message').css('color', 'green');
      		$('#register-message').html('Registration was successful. Proceed to login');
    	},
    	error: function(html) {
    		$('#email').val('');
      		$('#register-message').html('Your email address is already used.');
    	}
	});
}

function show_registerTab() {
	$('#container_reg').css('display', 'block');
	$('#container').css('display', 'none');
}

function show_loginTab() {
	$('#container_reg').css('display', 'none');
	$('#container').css('display', 'block');
}
