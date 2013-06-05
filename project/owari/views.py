# Create your views here.
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render_to_response
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseServerError
from django.core.urlresolvers import reverse
from django.template import RequestContext, Context, loader
from django.views.decorators.csrf import csrf_protect
from owari.models import User

users = {}

def home(request):
  global users
  if request.META['REMOTE_ADDR'] in users.keys() and users[ request.META['REMOTE_ADDR'] ]:
    return render_to_response('owari/index.html')
  return render_to_response('owari/login.html')

def new_game(request):
  g = game.Game()

  output = 'Will start a new game ' + str(g.show()) + '!'

  return HttpResponse(output)

@csrf_protect
def login(request):
  if not 'username' in request.POST:
    return HttpResponseServerError()
  if not 'password' in request.POST:
    return HttpResponseServerError()

  user = User.objects.get(username = request.POST['username'], password = request.POST['password'])
  
  global users
  users[ request.META['REMOTE_ADDR'] ] = True
  return HttpResponse('ok')

@csrf_protect
def logout(request):
  users[ request.META['REMOTE_ADDR'] ] = False
  return HttpResponse('ok')

@csrf_protect
def register(request):
  if not 'first_name' in request.POST:  
    return HttpResponseServerError()
  if not 'last_name' in request.POST:
    return HttpResponseServerError()
  if not 'email' in request.POST:
    return HttpResponseServerError()
  if not 'password' in request.POST:
    return HttpResponseServerError()

  username = request.POST['email']
  password = request.POST['password']
  name = request.POST['first_name'] + ' ' + request.POST['last_name']

  if User.objects.filter(name__exact = username):
    return HttpResponseServerError()

  user = User(name = username, password = password)
  user.save()

  print 'New User: ' + name + ' [' + username + ']'
  return HttpResponse('ok')
