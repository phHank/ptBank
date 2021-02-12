import graphene
from graphene_django import DjangoObjectType

import time
import datetime

from .models import Transfer, BankAccount

from cosec.models import Company
from cosec.schema import CompanyType

class TransferType(DjangoObjectType):
    class Meta:
        model = Transfer

class BankAccountType(DjangoObjectType):
    class Meta:
        model = BankAccount

class Query(graphene.ObjectType):
    transfers = graphene.List(TransferType)
    bank_accounts = graphene.List(BankAccountType)
    companies = graphene.List(CompanyType)

    def resolve_transfers(self, info, **kwargs):
        return Transfer.objects.all()

    def resolve_bank_account(self, info, **kwargs):
        return BankAccount.objects.all()

    def resolve_companies(self, info, **kwargs):
        return Company.objects.all()


class CreateTransfer(graphene.Mutation):
    transfer = graphene.Field(TransferType)

    class Arguments:
        company_id = graphene.Int(required=True)
        bank_ac_id = graphene.Int(required=True)
        currency = graphene.String(required=True)
        amount = graphene.Float(required=True)
        benif_name = graphene.String(required=True) 
        benif_account = graphene.String(required=True)
        benif_swift = graphene.String(required=True)
        payment_ref = graphene.String(required=True)
        security_phrase = graphene.String(required=True)
        payment_date = graphene.Date()
        save_benif_details = graphene.Boolean()
        urgent = graphene.Boolean()

    def mutate(
            self, info, company_id,
            bank_ac_id, currency, amount,
            benif_name, benif_account,
            benif_swift, payment_ref, 
            urgent, security_phrase, 
            save_benif_details=False, payment_date=datetime.date.today
        ):

        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        
        company = Company.objects.filter(pk=company_id).first()
        if not company:
            raise Exception('Company not found!')

        bank_acc = BankAccount.objects.filter(pk=bank_acc_id).first()
        if not bank_acc: 
            raise Exception('Bank Account not found!')

        transfer = Transfer(
        company = company,
        account = bank_acc,
        currency = currency,
        amount = amount,
        benif_name = benif_name,
        benif_account = benif_account,
        benif_swift = benif_swift,
        save_benif_details = save_benif_details,
        payment_ref = payment_ref,
        payment_date = payment_date,
        urgent = urgent,
        security_phrase = security_phrase
        )
        transfer.save()

        return CreateTransfer(
            id = transfer.id,
            company = transfer.company,
            account = transfer.account,
            date_received = transfer.date_received,
            currency = transfer.currency,
            amount = transfer.amount,
            benif_name = transfer.benif_name,
            benif_account = transfer.benif_account,
            benif_swift = transfer.benif_swift,
            save_benif_details = transfer.save_benif_details,
            payment_ref = transfer.payment_ref,
            payment_date = transfer.payment_date,
            urgent = transfer.urgent,
            security_phrase = transfer.security_phrase
        )

class Mutation (graphene.ObjectType):
    create_transfer = CreateTransfer.Field()