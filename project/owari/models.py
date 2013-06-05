from django.db import models

# Create your models here.
class User(models.Model):
  username = models.CharField(max_length=50, primary_key=True)
  password = models.CharField(max_length=50)
  email = models.CharField(max_length=50)
  name = models.CharField(max_length=50)
  rating = models.IntegerField()
  country = models.CharField(max_length=50)
  gold = models.IntegerField()

class Game(models.Model):
  date = models.DateField()

