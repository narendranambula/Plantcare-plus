from django.urls import path
from api import views
from api.views import DiseaseList 
urlpatterns=[
     path('diseasename/', DiseaseList.as_view(), name='DiseaseList'),
]