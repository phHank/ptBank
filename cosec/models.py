from django.db import models
from django.conf import settings

import time

class ClientProfile(models.Model):
    first_name = models.CharField(max_length=200)
    surnames = models.CharField(max_length=200)
    title = models.CharField(max_length=50)
    gender = models.CharField(max_length=10)
    company_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=50)
    email = models.EmailField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        null=True, 
        on_delete=models.SET_NULL, 
        related_name='client_created_by'
        )
    date_created = models.IntegerField(null=False, default=int(time.time()))
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        null=True, 
        on_delete=models.SET_NULL, 
        related_name='client_updated_by'
        )
    last_updated = models.IntegerField()
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.first_name} {self.surnames}' if self.first_name else self.company



class UserProfile(models.Model): 
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False)
    client_profile = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, null=True)
    g1 = models.BooleanField(default=False, null=False)
    g2 = models.BooleanField(default=False, null=False)




class Company(models.Model):
    client_id = models.ForeignKey(ClientProfile, on_delete=models.CASCADE)
    co_name = models.CharField(max_length=200, null=False)
    address = models.CharField(max_length=200)
    country = models.CharField(max_length=200)
    created = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        null=True, 
        on_delete=models.SET_NULL, 
        related_name='company_created_by'
        )
    date_created = models.IntegerField(null=False, default=int(time.time()))
    updated = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        null=True, 
        on_delete=models.SET_NULL, 
        related_name='company_updated_by'
        )
    last_updated = models.IntegerField()
    deleted = models.BooleanField(default=False)
   
    def __str__(self):
      return self.co_name