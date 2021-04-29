from datetime import timedelta
from django.utils import timezone
from django.db.models import Q

import graphene
from graphene_django import DjangoObjectType

from graphql_jwt.decorators import user_passes_test, staff_member_required

from graphene_file_upload.scalars import Upload

from .models import Bank
from users.models import UserProfile

class BankType(DjangoObjectType):
    class Meta:
        model = Bank


class Query(graphene.ObjectType):
    banks = graphene.List(BankType, 
        search = graphene.String(),
        first = graphene.Int(),
        skip = graphene.Int(),
        order_by = graphene.String()
    )

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


class Mutation (graphene.ObjectType):
    create_bank = CreateBank.Field()
    update_bank = UpdateBank.Field()