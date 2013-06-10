from django.contrib import admin
from owari.models import User
from owari.models import Message
from owari.models import Invite

admin.site.register(User)
admin.site.register(Message)
admin.site.register(Invite)
