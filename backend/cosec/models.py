from django.db import models
from django.conf import settings

class ClientProfile(models.Model):
    first_name = models.CharField(max_length=200)
    surnames = models.CharField(max_length=200)
    title = models.CharField(max_length=50)
    gender = models.CharField(max_length=10)
    company_name = models.CharField(max_length=200, null=False, default='Private Individual')
    phone = models.CharField(max_length=50, null=True)
    email = models.EmailField(null=False)
    country = models.CharField(max_length=200, null=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        null=True, 
        on_delete=models.SET_NULL, 
        related_name='client_created_by'
        )
    date_created = models.DateTimeField(auto_now_add=True, editable=False)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        null=True, 
        on_delete=models.SET_NULL, 
        related_name='client_updated_by'
        )
    last_updated = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.company_name if self.company_name else f'{self.first_name} {self.surnames}' 


class Company(models.Model):
    client_profile = models.ForeignKey(ClientProfile, on_delete=models.CASCADE)
    co_name = models.CharField(max_length=200, null=False)
    address = models.CharField(max_length=200)
    country = models.CharField(max_length=200)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        null=True, 
        on_delete=models.SET_NULL, 
        related_name='company_created_by'
        )
    date_created = models.DateTimeField(auto_now_add=True, editable=False)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        null=True, 
        on_delete=models.SET_NULL, 
        related_name='company_updated_by'
        )
    last_updated = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False)
   
    def __str__(self):
      return self.co_name