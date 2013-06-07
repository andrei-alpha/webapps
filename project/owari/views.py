# Create your views here.
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render_to_response
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseServerError
from django.core.urlresolvers import reverse
from django.template import RequestContext, Context, loader
from django.views.decorators.csrf import csrf_protect
from owari.models import User
from owari.models import Message
import random, string, json
from itertools import chain

users = {}
users['2ccdbt3gcs9lj54bk1x8vx7s19g6fto8'] = 1

def home(request):
  if not 'usertoken' in request.COOKIES:
    return render_to_response('owari/login.html')

  usertoken = request.COOKIES['usertoken']  
  global users
  if usertoken in users.keys():
    return render_to_response('owari/index.html')
  return render_to_response('owari/login.html')

def new_game(request):
  g = game.Game()

  output = 'Will start a new game ' + str(g.show()) + '!'

  return HttpResponse(output)

def login(request):
  if not 'username' in request.POST:
    return HttpResponseServerError()
  if not 'password' in request.POST:
    return HttpResponseServerError()

  user = User.objects.get(username = request.POST['username'], password = request.POST['password'])
  
  global users
  usertoken = ''.join(random.choice(string.ascii_lowercase + string.digits) for x in range(32))
  users[usertoken] = user.id
  return HttpResponse( json.dumps({'usertoken': usertoken}) )

def logout(request):
  usertoken = request.COOKIES['usertoken']
  users.pop(usertoken)
  return HttpResponse('ok')

def register(request):
  if not 'first_name' in request.POST:  
    return HttpResponseServerError()
  if not 'last_name' in request.POST:
    return HttpResponseServerError()
  if not 'email' in request.POST:
    return HttpResponseServerError()
  if not 'password' in request.POST:
    return HttpResponseServerError()

  email = request.POST['email']
  username = request.POST['email']
  password = request.POST['password']
  country = request.POST['country']
  name = request.POST['first_name'] + ' ' + request.POST['last_name']

  if User.objects.filter(name__exact = username):
    return HttpResponseServerError()

  user = User(username = username, password = password, email = email, name = name, rating = 1200, country = country, gold = 0)
  user.save()

  print 'New User: ' + name + ' [' + username + ']'
  return HttpResponse('ok')

def messages(request):
  data = request.POST

  global users
  userid = users[ request.COOKIES['usertoken'] ]
  # List all users from the system
  if data['type'] == 'get_users':
    result = {}
    all_users = User.objects.all()
    
    for user in all_users:
      if user.id != userid:
        result[user.id] = user.name
    return HttpResponse( json.dumps(result) )

  # Save a new message in the database
  if data['type'] == 'new_message':
    recipient = data['recipient']    

    message = Message(fromId = userid, toId = recipient, text = data['text'], read = False)
    message.save()
    return HttpResponse(message.id)

  # Request all new messages
  if data['type'] == 'get_messages':
    result = {}  

    for uid in data:
      if uid == 'type':
        continue

      query1 = Message.objects.filter(fromId = userid, toId = uid, id__gt = data[uid])
      query2 = Message.objects.filter(fromId = uid, toId = userid, id__gt = data[uid])

      res = list(chain(query1, query2))
      
      result[uid] = []
      for mes in res:
        result[uid].append([mes.id, mes.text, mes.read])
    return HttpResponse( json.dumps(result) ) 
  
  # Mark a message as read
  if data['type'] == 'mark_read':
    print 'mark as read', id, ' ok'
    message = Message.objects.get(id = data['id'])
    message.read = True
    message.save()
    return HttpResponse('ok') 

  return HttpResponseServerError()

def user(request):
  data = request.POST

  global users
  userid = users[ request.COOKIES['usertoken'] ]
  if data['type'] == 'get_profile':
    result = {}
    
    user = User.objects.get(id = userid)
    result['name'] = user.name
    result['image'] = user.image
    result['rating'] = user.rating
    result['country'] = user.country
    result['gold'] = user.gold

    return HttpResponse( json.dumps(result) )


  return HttpResponse('ok')  

  
