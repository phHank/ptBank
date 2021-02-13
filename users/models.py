from django.db import models
from django.conf import settings

from cosec.models import ClientProfile

class UserProfile(models.Model): 
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False)
    client_profile = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, null=True)
    g1 = models.BooleanField(default=False, null=False)
    g2 = models.BooleanField(default=False, null=False)