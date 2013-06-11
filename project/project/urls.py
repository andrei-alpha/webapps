from django.conf.urls.defaults import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib import admin
from django.conf import settings

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'owari.views.home', name='home'),
    url(r'^backend/login/$', 'owari.views.login'),     
    url(r'^backend/register/$', 'owari.views.register'),
    url(r'^backend/logout/$', 'owari.views.logout'),
    url(r'^backend/messages/$', 'owari.views.messages'),
    url(r'^backend/user/$', 'owari.views.user'),
    url(r'^backend/updates/$', 'owari.views.updates'),
    url(r'^backend/invite/$', 'owari.views.invite'),
    url(r'^backend/game/$', 'owari.views.game'),

    # url(r'^project/', include('project.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)

#for static files
urlpatterns += patterns('django.contrib.staticfiles.views',
    #url(r'^logs/static/(?P<path>.*)$', 'serve'),
    #url(r'^chat/static/(?P<path>.*)$', 'serve'),
    #url(r'^ai/static/(?P<path>.*)$', 'serve'),
    url(r'^admin/static/(?P<path>.*)$', 'serve')
)

