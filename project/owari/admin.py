from django.contrib import admin
from owari.models import User
from owari.models import Message
from owari.models import Invite
from owari.models import Game
from owari.models import Rating

admin.site.register(User)
admin.site.register(Message)
admin.site.register(Invite)
admin.site.register(Game)
admin.site.register(Rating)
