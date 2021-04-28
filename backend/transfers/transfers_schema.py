from datetime import timedelta
from django.utils import timezone
from django.db.models import Q

import graphene
from graphene_django import DjangoObjectType

from graphql_jwt.decorators import user_passes_test, staff_member_required

from graphene_file_upload.scalars import Upload

from .models import BankAccount, Transfer
from cosec.models import Company


class TransferType(DjangoObjectType):
    class Meta:
        model = Transfer



class Query(graphene.ObjectType):
    transfers = graphene.List(TransferType)

    def resolve_transfers(self, info, **kwargs):
        return Transfer.objects.all()



# TODO: update transfer mutations and handle default values for date_received and payment_date in .models.Transfer
class CreateTransfer(graphene.Mutation):
    transfer = graphene.Field(TransferType)

    class Arguments:
        acc_id = graphene.Int(required=True)
        currency = graphene.String(required=True)
        amount = graphene.Float(required=True)
        benif_name = graphene.String(required=True) 
        benif_account_no = graphene.String(required=True)
        benif_swift = graphene.String(required=True)
        payment_ref = graphene.String(required=True)
        security_phrase = graphene.String(required=True)
        payment_date = graphene.Date()
        save_benif_details = graphene.Boolean()
        urgent = graphene.Boolean()

    @user_passes_test(lambda u: u.is_active)
    @staff_member_required
    def mutate(
            self, info,
            bank_ac_id, currency, amount,
            benif_name, benif_account_no,
            benif_swift, payment_ref, 
            urgent, security_phrase, 
            save_benif_details=False, 
            payment_date=timezone.now() + timedelta(days=1),
            **kwargs
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
        account = bank_acc,
        currency = currency,
        amount = amount,
        benif_name = benif_name,
        benif_account = benif_account_no,
        benif_swift = benif_swift,
        save_benif_details = save_benif_details,
        payment_ref = payment_ref,
        payment_date = payment_date,
        urgent = urgent,
        security_phrase = security_phrase
        )
        transfer.save()

        return CreateTransfer(transfer=transfer)


class Mutation (graphene.ObjectType):
    create_transfer = CreateTransfer.Field()