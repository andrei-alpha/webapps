from django.db import models

# Create your models here.
class User(models.Model):
  username = models.CharField(max_length=50)
  password = models.CharField(max_length=50)
  email = models.CharField(max_length=50)
  full_name = models.CharField(max_length=50)
  first_name = models.CharField(max_length=50)
  last_name = models.CharField(max_length=50)
  image = models.CharField(max_length=200, null = True)
  rating = models.IntegerField()
  country = models.CharField(max_length=50)
  gold = models.IntegerField()
  cityId = models.IntegerField(null = True)
  gameId = models.IntegerField(null = True)
  online = models.BooleanField(default = False)

class Game(models.Model):
  date = models.DateField()

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
