from django.db import models

# Create your models here.
class User(models.Model):
  username = models.CharField(max_length=50)
  password = models.CharField(max_length=50)
  email = models.CharField(max_length=50)
  full_name = models.CharField(max_length=50)
  first_name = models.CharField(max_length=50)
  last_name = models.CharField(max_length=50)
  image = models.CharField(max_length=200, default = '')
  rating = models.IntegerField()
  country = models.CharField(max_length=50)
  gold = models.IntegerField()
  cityId = models.IntegerField(null = True)
  gameId = models.IntegerField(null = True)
  online = models.BooleanField(default = False)

class Game(models.Model):
  date = models.DateField(auto_now = True)
  moves = models.IntegerField(default = 0)
  score1 = models.IntegerField(default = 0)
  score2 = models.IntegerField(default = 0)
  player1 = models.IntegerField()
  player2 = models.IntegerField()

class GameMove(models.Model):
  gameId = models.IntegerField()
  bowl = models.IntegerField()


class Message(models.Model):
  fromId = models.IntegerField()
  toId = models.IntegerField()
  text = models.CharField(max_length=1000)
  read = models.BooleanField()
  date = models.DateTimeField(auto_now = True)

class Invite(models.Model):
  fromId = models.IntegerField()
  toId = models.IntegerField()
  date = models.DateTimeField(auto_now = True)
  status = models.CharField(max_length = 10, default = 'pending')
