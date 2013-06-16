function openInfoWindow(name, data, callback) {
	var windowTemplate = $('#infoWindowTemplate').html();
	var template = windowTemplate.format(name);

	$('#info-window').html(template);
	$('#info-window').fadeIn(500);
  $('#info-window-close').click(function(event) { closeInfoWindow(); });
}

function closeInfoWindow() {
  $('#info-window').fadeOut(500);
}

function openUserProfile() {
  var windowTemplate = $('#infoWindowTemplate').html();
  var template = windowTemplate.format('User Profile');

  $('#info-window').html(template);
  $('#info-window').fadeIn(500);
  $('#info-window-close').click(function(event) { user_getProfile(); closeInfoWindow(); });
  $('#info-window-content').html( $('#userProfileTemplate').html() );
  $('#user-profile-pic').css('background-image', 'url(' + curr_user['image'] + ')');

  $('#user-profile-message').html('');
  $('#first_name').val(curr_user['first_name']);
  $('#last_name').val(curr_user['last_name']);
  $('#email').val(curr_user['email']);
  $('#image_url').val(curr_user['image']);

  $.getJSON('/static/js/json/countries.json', function(data) {
    $('#country').html('');
    for (var i = 0; i < data.length; ++i) {
      $('#country').append('<option>' + data[i] + '</option>');
    }
    $('#country :selected').text(curr_user['country']);
  });

  // Get rating information
  $.ajax({
    url: '/backend/user/',
    type: 'post',
    async: false,
    data: {'type': 'get_rating'},
    success: function(json) {
      data = $.parseJSON(json);
      dates = data['dates'];
      values = data['values'];
      curr_user['gold'] = data['gold'];
      curr_user['rating'] = data['rating'];
      generateRatingChart(dates, values);
    },
    error: function(html) {
      console.log('error on get rating');
    }
  });

  $('#user-gold-label').html('Gold: ' + curr_user['gold']);
  $('#user-rating-label').html('Rating: ' + curr_user['rating']);
}

function generateRatingChart(dates, values) {
  $('#rating-chart').highcharts({
    chart: {
        type: 'line',
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.0)'
      },
      title: {
        text: curr_user['name'],
          style: {
            color: '#fff'
          }
      },
      subtitle: {
        text: 'Based on: <a href="http://en.wikipedia.org/wiki/Chess_rating_system">'+
         'AOL Chess Rating</a>',
          style: {
            color: '#fff'
          }
      },
      xAxis: {
        categories: dates,
        labels: {
          formatter: function() {
            var str = this.value;
            return str.split(",")[0];
          },
          style: {
            color: '#fff'
          },
        }
      },
      yAxis: {
        title: {
          text: 'Rating',
          style: {
            color: '#fff'
          },
        },
        labels: {
          formatter: function() {
            return this.value;
          },
          style: {
            color: '#fff'
          }
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        pointFormat: 'Rating: <b>{point.y:,.0f}</b><br>id: {point.x}'
      },
      series: [{
          name: curr_user['name'],
          color: 'brown',
          data: values,
          marker: {
            enabled: true,
            symbol: 'circle',
            radius: 4,
            fillColor: '#400000'
          }
      }]
  });
}

function userProfileToglePass() {
  if ($('#change-pass-button').html() == 'New Pass') {
    $('#input-pass').fadeIn(500);
    $('.user_button').animate({'top': '540px'}, 500);
    $('#change-pass-button').html('Hide');
  }
  else {
    $('#input-pass').fadeOut(500);
    $('.user_button').animate({'top': '380px'}, 500);
    $('#change-pass-button').html('New Pass');
  }
}

function userProfileSubmit() {
  var first_name = $('#first_name').val();
  var last_name = $('#last_name').val();
  var email = $('#email').val();
  var image_url = $('#image_url').val();
  var old_password = CryptoJS.MD5( $('#password').val() ).toString();
  var password1 = CryptoJS.MD5( $('#password-1').val() ).toString();
  var password2 = CryptoJS.MD5( $('#password-2').val() ).toString();
  var country = $('#country').find(':selected').text();
  var type = ($('#change-pass-button').html() == 'Hide');

  /* Check input for validity. */
  var error = null;
  $.ajax({
    url: image_url, 
    type: 'HEAD',
    error: function(html) { 
      error = 'Image url is invalid';
    }
  });

  if (!error && first_name.length < 1)
    error = 'Your first name cannot be empty';
  if (!error && last_name.length < 1)
    error = 'Your last name cannot be empty';
  var re = /\S+@\S+\.\S+/;
  if (!error && !re.test(email) )
    error = 'Your email address is invalid';
  if (type == true) {
    if (!error && (old_password.length < 5 || password1.length < 5))
      error = 'Your password must be at least 5 characters';
    if (!error && password1 != password2)
      error = 'Your new passwords don`t match';
  }

  if (error) {
    $('#user-profile-message').css('color', 'red');
    $('#user-profile-message').html(error);
    return;
  }

  data = {};
  data['type'] = 'change_profile';
  data['first_name'] = first_name;
  data['last_name'] = last_name;
  data['image'] = image_url;
  data['email'] = email;
  data['country'] = country;
  if (type == true) {
    data['old_password'] = old_password;
    data['password'] = password1;
  }

  $.ajax({
    url: '/backend/user/',
    type: 'post',
    data: data,
    success: function(result) {
      $('#user-profile-message').css('color', 'green');
      $('#user-profile-message').html('Your profile was updated');
      $('#user-profile-pic').css('background-image', 'url(' + curr_user['image'] + ')');
      // Update the user profile
      user_getProfile();
    },
    error: function(html) {
      $('#user-profile-message').css('color', 'red');
      $('#user-profile-message').html('Your old password is incorrect');
    }
  })  
}

//first, checks if it isn't implemented yet
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

function showTutorial() {
  var windowTemplate = $('#infoWindowTemplate').html();
  var template = windowTemplate.format('How to play');
  $('#info-window').html(template);
  $('#info-window').fadeIn(500);
  $('#info-window-close').click(function(event) { closeInfoWindow(); });
  $('#info-window-content').html( $('#tutorialTemplate').html() );
  $('#slide1').show();

  var slides = [$('#slide1'), $('#slide2'), $('#slide3'), $('#slide4'), $('#slide5'), 
    $('#slide6')], 
    index = 0;
  $('#tutorial-prev').click(function() {
    index = prev(index, slides);
  }); 
  $('#tutorial-next').click(function() {
    index = next(index, slides)
  });
}

function prev(index, slides) {
  var old_index = index;
  if (index > 0) {
    index--;
  } else {
    index = slides.length - 1;
  }
  slides[old_index].hide();
  slides[index].fadeIn(500);
  return index; 
}

function next(index, slides) {
  var old_index = index;
  if (index < slides.length - 1) {
    index++;
  } else {
    index = 0;
  }
  slides[old_index].hide();
  slides[index].fadeIn(500);
  return index;
}

function deleteCookie(c_name) {
  document.cookie = encodeURIComponent(c_name) + "=deleted; expires=" + new Date(0).toUTCString();
}

function setCookie(c_name, value, exdays)
{
  var exdate=new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
  document.cookie=c_name + "=" + c_value;
}

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

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}