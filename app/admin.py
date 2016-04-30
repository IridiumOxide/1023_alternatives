from django.contrib import admin
from app.models import ExperimentDefinition
from app.models import User
from app.models import ExperimentInstance
from app.models import Session, Press, Test

# Register your models here.


admin.site.register(ExperimentDefinition)
admin.site.register(User)
admin.site.register(ExperimentInstance)
admin.site.register(Session)
admin.site.register(Press)
admin.site.register(Test)
