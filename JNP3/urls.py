"""JNP3 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from app import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^admin/', admin.site.urls),
    url(r'^data/', views.get_data, name="get_data"),
    url(r'^d/(?P<username>.*)/$', views.show_data, name="show_data"),
    url(r'^e/(.*)/api/sendpresses/(?P<instance_name>.*)/$', views.send_presses, name='sendpresses'),
    url(r'^e/(.*)/api/getdefinition/(?P<defname>.*)/$', views.get_definition, name='getdefinition'),
    url(r'^e/(.*)/api/getsessioninfo/(?P<instance_name>.*)/$', views.get_session_info, name='getsessioninfo'),
    url(r'^e/(.*)/api/addsession/(?P<instance_name>.*)/$', views.add_session, name='addsession'),
    url(r'^e/(.*)/api/modsession/(?P<instance_name>.*)/$', views.update_session, name='modsession'),
    url(r'^u/(.*)/api/setpersonal/(?P<username>.*)/$', views.setpersonal, name='setpersonal'),
    url(r'^u/(?P<username>.*)/$', views.user_site, name='user site'),
    url(r'^e/(?P<instance_name>.*)/$', views.experiment_view, name='experiment')
]
