from django.contrib import admin
from .models import PlantDisease
# Register your models here.
@admin.register(PlantDisease)
class Diseases(admin.ModelAdmin):
    list_display=['id','name','percentage']
