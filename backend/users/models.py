from django.db import models
from django.conf import settings

from cosec.models import ClientProfile

class UserProfile(models.Model): 
    user = models.OneToOneField(settings.AUTH_USER_MODEL, primary_key=True, on_delete=models.CASCADE, null=False)
    client_profile = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, null=True, blank=True)
    g1 = models.BooleanField(default=False, null=False)
    g2 = models.BooleanField(default=False, null=False)
    g3 = models.BooleanField(default=False, null=False)

    def __str__(self):
        return f"{self.user.username}'s profile"