from datetime import timedelta
from django.utils import timezone
from django.db.models import Q

import graphene
from graphene_django import DjangoObjectType

from graphql_jwt.decorators import user_passes_test, staff_member_required

from graphene_file_upload.scalars import Upload

from .models import Bank, BankAccount, Transfer

from cosec.schema import CompanyType
from users.models import UserProfile

class BankType(DjangoObjectType):
    class Meta:
        model = Bank

class BankAccountType(DjangoObjectType):
    class Meta:
        model = BankAccount

class TransferType(DjangoObjectType):
    class Meta:
        model = Transfer


class Query(graphene.ObjectType):
    banks = graphene.List(BankType, 
        search = graphene.String(),
        first = graphene.Int(),
        skip = graphene.Int(),
        order_by = graphene.String()
    )
    bank_accounts = graphene.List(BankAccountType)
    transfers = graphene.List(TransferType)

    @user_passes_test(lambda u: u.is_active)
    def resolve_banks(self, info, search=None, first=None, skip=None, order_by='name', **kwargs):
        query_set = Bank.objects.order_by(f'{order_by}').all()

        if search:
            filter = (
                Q(name__icontains=search) |
                Q(country__icontains=search)
            )
            query_set = query_set.filter(filter)

        if skip:
            query_set = query_set[skip:]

        if first:
            query_set = query_set[:first]

        return query_set

        return Bank.objects.all()

    @user_passes_test(lambda u: u.is_active)
    def resolve_bank_accounts(self, info, **kwargs):
        return BankAccount.objects.filter(deleted=False).all()

    def resolve_transfers(self, info, **kwargs):
        return Transfer.objects.all()

####################################### Bank Mutations ######################################################

class CreateBank(graphene.Mutation):
    bank = graphene.Field(BankType)

    class Arguments: 
        name = graphene.String(required=True)
        country = graphene.String(required=True)

    @user_passes_test(lambda u: u.is_active)
    @staff_member_required
    def mutate(self, info, name, country, **kwargs):
        user = info.context.user

        is_g3 = UserProfile.objects.filter(user=user).first().g3
        if not is_g3:
            raise Exception('Permission denied, not G3!')

        bank = Bank(name=name, country=country)
        bank.save()

        return CreateBank(bank=bank)



class UpdateBank(graphene.Mutation):
    bank = graphene.Field(BankType)

    class Arguments: 
        bank_id = graphene.Int(required=True)
        name = graphene.String(required=True)
        country = graphene.String(required=True)

    @user_passes_test(lambda u: u.is_active)
    @staff_member_required
    def mutate(self, info, bank_id, name, country, **kwargs):
        user = info.context.user

        is_g3 = UserProfile.objects.filter(user=user).first().g3
        if not is_g3:
            raise Exception('Permission denied, not G3!')

        bank = Bank.objects.filter(id=bank_id).first() 
        if not bank:
            raise Exception('Bank not found!')
        
        bank.name = name
        bank.country = country
        bank.save()

        return UpdateBank(bank=bank)


####################################### BankAccount Mutations ######################################################

class CreateBankAccount(graphene.Mutation):
    bank_acc = graphene.Field(BankAccountType)

    class Arguments:
        co_id = graphene.Int(required=True)
        bank_id = graphene.Int(required=True)
        acc_name = graphene.String(required=True)
        iban = graphene.String()
        swift = graphene.String()
        account_no = graphene.String()
        sort_code = graphene.Int()
        opened = graphene.Date(required=True)
        currency_code = graphene.String(required=True)
    
    @user_passes_test(lambda u: u.is_active)
    @staff_member_required
    def mutate(
        self, info, co_id,
        bank_id, acc_name, 
        opened, currency_code, 
        iban=None, swift=None, 
        account_no=None, sort_code=None,**kwargs
    ):
        user = info.context.user

        is_g3 = UserProfile.objects.filter(user=user).first().g3
        if not is_g3:
            raise Exception('Permission denied, not G3!')

        company = Company.objects.filter(pk=co_id).first()
        if not company:
            raise Exception('Company not found.')

        bank = Bank.objects.filter(pk=bank_id).first()
        if not bank:
            raise Exception('Bank not found.')

        if not (account_no or iban):
            raise Exception('No valid account identifier provided.')

        if not (swift or sort_code):
            raise Exception('No valid branch identifier provided.')

        try:
            account = BankAccount(
                company=company, bank=bank,
                acc_name=acc_name, iban=iban,
                swift=swift, account_no=account_no,
                sort_code=sort_code, opened=opened,
                currency_code=currency_code
            )
            account.save()
        except:
            raise Exception('Bank account could not be saved.')

        return CreateBankAccount(bank_acc=account)


class UpdateBankAccount(graphene.Mutation):
    bank_acc = graphene.Field(BankAccountType)

    class Arguments:
        acc_id = graphene.Int(required=True)
        acc_name = graphene.String(required=True)
        iban = graphene.String()
        swift = graphene.String()
        account_no = graphene.String()
        sort_code = graphene.Int()
        opened = graphene.Date(required=True)
        currency_code = graphene.String(required=True)
    
    @user_passes_test(lambda u: u.is_active)
    @staff_member_required
    def mutate(
        self, info, 
        acc_id, acc_name,
        opened, currency_code, 
        iban=None, swift=None, 
        account_no=None, sort_code=None,**kwargs
    ):
        user = info.context.user

        is_g3 = UserProfile.objects.filter(user=user).first().g3
        if not is_g3:
            raise Exception('Permission denied, not G3!')

        if not (account_no or iban):
            raise Exception('No valid account identifier provided.')

        if not (swift or sort_code):
            raise Exception('No valid branch identifier provided.')

        account = BankAccount.objects.filter(pk=acc_id).first()
        if not account:
            raise Exception('Bank Account not found.')

        try:
            account.acc_name=acc_name
            account.iban=iban
            account.swift=swift
            account.account_no=account_no
            account.sort_code=sort_code
            account.opened=opened
            account.currency_code=currency_code
            account.save()
        except:
            raise Exception('Bank account could not be updated.')

        return UpdateBankAccount(bank_acc=account)


class DeleteBankAccount(graphene.Mutation):
    acc_id = graphene.Int()
    success = graphene.Boolean(default_value=False)

    class Arguments:
        acc_id = graphene.Int(required=True)
    
    @user_passes_test(lambda u: u.is_active)
    @staff_member_required
    def mutate(
        self, info, acc_id, **kwargs
    ):
        user = info.context.user

        is_g3 = UserProfile.objects.filter(user=user).first().g3
        if not is_g3:
            raise Exception('Permission denied, not G3!')

        account = BankAccount.objects.filter(pk=acc_id, deleted=False).first()
        if not account:
            raise Exception('Bank Account not found.')

        try:
            account.deleted = True
            account.save()
        except: 
            raise Exception('Bank Account could not be deleted')

        return DeleteBankAccount(acc_id=account.id, success=True)



####################################### Transfer Mutations ######################################################



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
    create_bank = CreateBank.Field()
    update_bank = UpdateBank.Field()

    create_bank_acc = CreateBankAccount.Field()
    update_bank_acc = UpdateBankAccount.Field()
    delete_bank_acc = DeleteBankAccount.Field()
    
    create_transfer = CreateTransfer.Field()