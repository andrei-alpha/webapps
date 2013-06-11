# Create your views here.
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render_to_response
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseServerError
from django.core.urlresolvers import reverse
from django.template import RequestContext, Context, loader
from django.views.decorators.csrf import csrf_protect
from owari.models import User
from owari.models import Message
from owari.models import Invite
from owari.models import Game
import random, string, json
from itertools import chain
import ai

users = {}
games = {}
users['ftfn62nlrn59kp6ohphr70l6h4qujpi6'] = 1

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
  first_name = request.POST['first_name']
  last_name = request.POST['last_name']    
  full_name = first_name + ' ' + last_name

  if User.objects.filter(email__exact = email):
    return HttpResponseServerError()

  user = User(username = username, password = password, email = email, 
    first_name = first_name, last_name = last_name, full_name = full_name,
    rating = 1200, country = country, gold = 0)
  user.save()

  print 'New User: ' + full_name + ' [' + username + ']'
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
        result[user.id] = user.full_name
    return HttpResponse( json.dumps(result) )

  # Save a new message in the database
  if data['type'] == 'new_message':
    recipient = data['recipient']    

    message = Message(fromId = userid, toId = recipient, text = data['text'], read = False)
    message.save()
    return HttpResponse(message.id)
  # Mark a message as read
  if data['type'] == 'mark_read':
    print 'mark as read', id, ' ok'
    message = Message.objects.get(id = data['id'])
    message.read = True
    message.save()
    return HttpResponse('ok')

  
def invite(request):
  data = request.POST

  global users
  userid = users[ request.COOKIES['usertoken'] ]

  if data['type'] == 'new_invite':
    recipient = data['recipient']
    invite = Invite(fromId = userid, toId = recipient, status = 'pending')
    invite.save()

  if data['type'] == 'accept_invite':
    sender = data['sender']
    invite = Invite.objects.get(fromId = sender, toId = userid)
    invite.status = 'accept'
    invite.save()

  if data['type'] == 'cancel_invite':
    sender = data['sender']
    invite = Invite.objects.get(fromId = sender, toId = userid)
    invite.status = 'cancel'
    invite.save()

  if data['type'] == 'delete_invite':
    recipient = data['recipient']
    invite = Invite.objects.get(fromId = userid, toId = recipient)
    invite.delete()
  
  return HttpResponse('ok')

def updates(request):
  data = request.POST

  global users
  userid = users[ request.COOKIES['usertoken'] ]
  # Request all new messages, invites, and user status
  result = {}
  result['messages'] = {} 

  for uid in data:
    if not uid.isdigit():
      continue

    query1 = Message.objects.filter(fromId = userid, toId = uid, id__gt = data[uid])
    query2 = Message.objects.filter(fromId = uid, toId = userid, id__gt = data[uid])

    res = list(chain(query1, query2))
 
    result['messages'][uid] = []
    for mes in res:
      result['messages'][uid].append([mes.id, mes.text, mes.read])

  query1 = Invite.objects.filter(toId = userid)
  query2 = Invite.objects.filter(fromId = userid)
  res = list(chain(query1, query2))
  
  result['invites'] = []
  for invite in res:
    result['invites'].append([invite.fromId, invite.toId, invite.status])

  gameid = User.objects.get(id = userid).gameId
  if 'gameMoves' in data:
    found = False
    if not gameid in games:
      user = User.objects.get(id = userid)        
      user.gameId = 0
      user.save()
    else:
      found = True
      game = games[gameid]

    if found and int(game['moves']) > int(data['gameMoves']):
      print 'send_update', game

      result['game'] = {}
      result['game']['player'] = game['player']
      result['game']['score'] = game['score']
      result['game']['moves'] = game['moves']
      result['game']['turn'] = game['turn']
      result['game']['board'] = game['board']

  return HttpResponse( json.dumps(result) ) 

def user(request):
  data = request.POST

  global users
  userid = users[ request.COOKIES['usertoken'] ]
  if data['type'] == 'get_profile':
    result = {}
    
    user = User.objects.get(id = userid)
    result['id'] = user.id
    result['first_name'] = user.first_name
    result['last_name'] = user.last_name
    result['name'] = user.full_name
    result['email'] = user.email
    result['image'] = user.image
    result['rating'] = user.rating
    result['country'] = user.country
    result['cityId'] = user.cityId
    result['gold'] = user.gold
    result['gameid'] = user.gameId

    return HttpResponse( json.dumps(result) )

  if data['type'] == 'search_users':
    result = []
    names1 = User.objects.filter(full_name__startswith = data['name'])
    names2 = User.objects.filter(last_name__startswith = data['name'])
    names = list(chain(names1, names2))
    seen = {}
  
    for user in names:
      if user.id in seen or user.id == userid:
        continue
      result.append([user.id, user.full_name])
      seen[user.id] = True

    return HttpResponse( json.dumps(result) )

  if data['type'] == 'get_rating':
    result = {}
    result['dates'] = ['8 Oct', '12 Oct', '30 Oct', '20 Nov', '4 Dec', '15 Dec', '7 Jan', '14 Jan', '8 Mar', '10 Apr']
    result['values'] = [1200, 1310, 1420, 1450, 1390, 1430, 1490, 1570, 1670, 1790]
    return HttpResponse( json.dumps(result) )

  if data['type'] == 'change_profile':
    user = User.objects.get(id = userid)

    if 'password' in data:
      if user.password != data['old_password']:
        return HttpResponseServerError()
      user.password = data['password']

    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.email = data['email']
    user.image = data['image']
    user.country = data['country']
    user.full_name = user.first_name + ' ' + user.last_name
    user.save()

  return HttpResponse('ok')  

def game(request):
  data = request.POST

  global users
  userid = int(users[ request.COOKIES['usertoken'] ])
  gameid = int(User.objects.get(id = userid).gameId)
  player1 = int(data['player1'])
  player2 = int(data['player2'])

  if data['type'] == 'new_game':
    game = Game(player1 = player1, player2 = player2)
    game.save()

    games[game.id] = {}
    games[game.id]['player'] = [player1, player2]
    games[game.id]['score'] = [0, 0]
    games[game.id]['turn'] = 1
    games[game.id]['moves'] = 0

    print 'new_game', games[game.id]

    if player1 > 0: # If it's a human player
      user1 = User.objects.get(id = player1)
      user1.gameId = game.id
      user1.save()    

    if player2 > 0: # If it's a human player
      user2 = User.objects.get(id = player2)
      user2.gameId = game.id
      user2.save()
    
  if data['type'] == 'end_game':
    game = Game.objects.get(id = gameid)
    game.moves = games[game.id]['moves']
    game.score1 = games[game.id]['score'][0]
    game.score2 = games[game.id]['score'][1]
    game.save()

    user1 = User.objects.get(id = userid)
    user1.gameId = 0
    user1.save()

  if data['type'] == 'new_move':
    games[gameid]['moves'] = data['moves']
    games[gameid]['score'][0] = data['score0']
    games[gameid]['score'][1] = data['score1']
    games[gameid]['turn'] = data['turn']
    games[gameid]['board'] = data['board'].split(' ')

    print 'new_move', games[gameid]

  if data['type'] == 'ai_move':
    game = games[gameid]
    board = ' '.join(game['board'])
    turn = int(game['turn']) - 1
    level = -1 * (player1 if userid == player2 else player2)

    move = ai.compute(board, game['score'][0], game['score'][1], turn, level)
    return HttpResponse( json.dumps({'move': move}) )

  return HttpResponse('ok')
