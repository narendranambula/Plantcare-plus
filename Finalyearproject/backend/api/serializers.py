from rest_framework import serializers
from .models import PlantDisease
class DiseaseSerializer(serializers.ModelSerializer):
    class Meta:
        model=PlantDisease
        fields = ['id', 'name', 'percentage']