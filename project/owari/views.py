# Create your views here.
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render_to_response
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.template import RequestContext, Context, loader
from django.views.decorators.csrf import csrf_protect
from owari.models import User

users = {}

def home(request):
  global users
  if request.META['REMOTE_ADDR'] in users.keys():
    return render_to_response('owari/index.html')
  return render_to_response('owari/login.html')

def new_game(request):
  g = game.Game()

  output = 'Will start a new game ' + str(g.show()) + '!'

  return HttpResponse(output)

@csrf_protect
def backend(request, username, password):
  user = User.objects.get(name = username, password = password)
  
  global users
  users[ request.META['REMOTE_ADDR'] ] = True
  return render_to_response('owari/index.html')
