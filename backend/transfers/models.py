from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

from cosec.models import Company

class Bank(models.Model):
    name = models.CharField(max_length=200, null=False)
    country = models.CharField(max_length=200, null=False)

    def __str__(self):
        return f'{self.name} {self.country}'


class BankAccount(models.Model):
    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='account_holder'
    )
    bank = models.ForeignKey(
        Bank, 
        on_delete=models.PROTECT, 
        null=False
    )
    acc_name = models.CharField(max_length=200, null=False)
    iban = models.CharField(max_length=34, null=True, blank=True)
    swift = models.CharField(max_length=11, null=True, blank=True)
    account_no = models.CharField(max_length=50, null=True, blank=True)
    sort_code = models.IntegerField(null=True, blank=True)
    opened = models.DateField()
    currency_code = models.CharField(max_length=3)
    deleted = models.BooleanField(null=False, default=False)
   
    def __str__(self):
      return f'{self.account_name} {self.iban if self.iban else self.account_no}'



class Transfer(models.Model):
    account = models.ForeignKey(
        BankAccount, 
        null=True, #remove this when working with a empty db for production. 
        on_delete=models.CASCADE, #Protect in production
        related_name='remitting_account'
    )
    date_received = models.DateTimeField(auto_now_add=True)
    currency = models.CharField(max_length=100, null=False)
    amount = models.FloatField(null=False)
    benif_name = models.CharField('beneficiary account name', max_length=200, null=False)
    benif_account = models.CharField('beneficiary account number', max_length=34, null=False)
    benif_swift = models.CharField('beneficiary swift/sort number', max_length=11, null=False)
    save_benif_details = models.BooleanField(default=False)
    payment_ref = models.CharField(max_length=200, null=False)
    payment_date = models.DateField(null=False, default=timezone.now) 
    urgent = models.BooleanField(default=False)
    security_phrase = models.CharField(max_length=5, null=False)
    deleted = models.BooleanField(null=False, default=False)

    def __str__(self):
        return f'''{self.currency}{self.amount} 
        from {self.company.co_name}
        paid on {self.payment_date}
        to {self.benif_name}.
        '''