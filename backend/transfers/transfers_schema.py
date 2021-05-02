from datetime import timedelta
from django.utils import timezone
from django.db.models import Q

import graphene
from graphene_django import DjangoObjectType

from graphql_jwt.decorators import user_passes_test, staff_member_required

from graphene_file_upload.scalars import Upload

from .models import BankAccount, Transfer
from users.models import UserProfile


class TransferType(DjangoObjectType):
    class Meta:
        model = Transfer



class Query(graphene.ObjectType):
    transfers = graphene.List(TransferType,
        month = graphene.Int(),
        year = graphene.Int(),
        search = graphene.String(),
        order_by = graphene.String()
    )
    transfer = graphene.Field(TransferType, id=graphene.Int())
    
    @user_passes_test(lambda u: u.is_active)
    def resolve_transfers(self, info, 
        month=None, year=None, 
        search=None, order_by='-date_received__day',
        **kwargs
    ):
        if search:
            query_set = Transfer.objects.order_by(f'{order_by}', '-pk').all()
            filter = (
                Q(account__acc_name__icontains=search) |
                Q(amount__icontains=search) |
                Q(payment_ref__icontains=search) |
                Q(benif_name__icontains=search) |
                Q(benif_swift__icontains=search) |
                Q(benif_account__icontains=search)
            )
            query_set = query_set.filter(filter)
        else: 
            query_set = Transfer.objects.filter(date_received__year__gte=year,
                date_received__month__gte=month,
                date_received__year__lte=year,
                date_received__month__lte=month,
                deleted=False) \
                    .order_by(f'{order_by}', '-pk').all()

        return query_set

    @user_passes_test(lambda u: u.is_active)
    def resolve_transfer(self, info, id=None, **kwargs):
        return Transfer.objects.filter(pk=id, deleted=False).first()



class CreateTransfer(graphene.Mutation):
    transfer = graphene.Field(TransferType)

    class Arguments:
        bank_acc_id = graphene.Int(required=True)
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
    def mutate(
            self, info,
            bank_acc_id, currency, amount,
            benif_name, benif_account_no,
            benif_swift, payment_ref, 
            security_phrase, 
            save_benif_details=False, urgent=False,
            payment_date=timezone.now() + timedelta(days=1),
            **kwargs
        ):
        bank_acc = BankAccount.objects.filter(pk=bank_acc_id).first()
        if bank_acc is None: 
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


class DeleteTransfer(graphene.Mutation):
    transfer_id = graphene.Int()

    class Arguments:
        transfer_id = graphene.Int(required=True)
    
    @user_passes_test(lambda u: u.is_active)
    @staff_member_required
    def mutate(
        self, info, transfer_id, **kwargs
    ):
        user = info.context.user

        is_g3 = UserProfile.objects.filter(user=user).first().g3
        if not is_g3:
            raise Exception('Permission denied, not G3!')

        transfer = Transfer.objects.filter(pk=transfer_id, deleted=False).first()
        if not transfer:
            raise Exception('Transfer not found.')

        try:
            transfer.deleted = True
            transfer.save()
        except: 
            raise Exception('Transfer could not be deleted')

        return DeleteTransfer(transfer_id=transfer.id)


class Mutation (graphene.ObjectType):
    create_transfer = CreateTransfer.Field()
    delete_transfer = DeleteTransfer.Field()