from django.db.models import Q

import graphene
from graphene_django import DjangoObjectType

from graphql_jwt.decorators import user_passes_test, staff_member_required

from .models import Bank, BankAccount, Transfer
from users.models import UserProfile

from .transfers_schema import TransferType


class BankAccountType(DjangoObjectType):
    transfers = graphene.List(TransferType)

    class Meta:
        model = BankAccount

    def resolve_transfers(parent, info, **kwargs):
        return Transfer.objects.filter(account=parent, deleted=False).all()


class Query(graphene.ObjectType):
    bank_accounts = graphene.List(BankAccountType)
    bank_account = graphene.Field(BankAccountType, acc_id=graphene.Int(required=True))

    @user_passes_test(lambda u: u.is_active)
    def resolve_bank_accounts(self, info, **kwargs):
        return BankAccount.objects.filter(deleted=False).all()

    @user_passes_test(lambda u: u.is_active)
    def resolve_bank_account(self, info, acc_id=None, **kwargs):
        return BankAccount.objects.filter(pk=acc_id, deleted=False).first()


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


class Mutation (graphene.ObjectType):
    create_bank_acc = CreateBankAccount.Field()
    update_bank_acc = UpdateBankAccount.Field()
    delete_bank_acc = DeleteBankAccount.Field()