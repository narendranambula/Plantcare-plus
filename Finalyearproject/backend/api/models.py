from django.db import models

# Create your models here.
class PlantDisease(models.Model):
    name = models.CharField(max_length=255)
    percentage = models.FloatField()
    def __str__(self):
        return self.name