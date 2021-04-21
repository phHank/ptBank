from django.contrib.auth import get_user_model
from django.db.models import Q

from django.utils import timezone

import graphene
from graphene_django import DjangoObjectType

from graphql_jwt.decorators import user_passes_test, staff_member_required

from graphene_file_upload.scalars import Upload

from .models import ClientProfile, Company
from users.models import UserProfile as Profile
from transfers.models import BankAccount



class CompanyType(DjangoObjectType):
    class Meta:
        model = Company



class Query(graphene.ObjectType):
    companies = graphene.List(
        CompanyType, 
        co_id = graphene.Int(),
        search = graphene.String(),
        first = graphene.Int(),
        skip = graphene.Int(),
        order_by = graphene.String()    
    )

    @user_passes_test(lambda u: u.is_authenticated and u.is_active)
    def resolve_companies(self, info, co_id=None, search=None, first=None, skip=None, order_by='co_name', **kwargs):
        user = info.context.user

        if co_id:
            company = Company.objects.filter(pk=co_id, deleted=False).all()

            if not company:
                raise Exception('Company not found.')

            if not user.is_staff:
                profile = Profile.objects.filter(user=user).first().client_profile

                if not profile:
                    raise Exception('User not associated with a client profile.')

                if profile != company.client_profile:
                   raise Exception('Access denied for requested company.')

            return company

        if user.is_staff:
            query_set = Company.objects.filter(deleted=False).order_by(f'{order_by}').all()

            if search:
                filter = (
                    Q(co_name__icontains=search) |
                    Q(city__icontains=search) |
                    Q(country__icontains=search)
                )
                query_set = query_set.filter(filter)

            if skip:
                query_set = query_set[skip:]

            if first:
                query_set = query_set[:first]

            return query_set




class CreateCompany(graphene.Mutation):
    company = graphene.Field(CompanyType)

    class Arguments:
        client_id = graphene.Int(required=True)
        co_name = graphene.String(required=True)
        address_1 = graphene.String(required=True)
        address_2 = graphene.String()
        city = graphene.String(required=True)
        country = graphene.String(required=True)

    @user_passes_test(lambda u: u.is_authenticated and u.is_active)
    @staff_member_required
    def mutate(
        self, info, client_id, 
        co_name, address_1, address_2, 
        city, country
    ):
        user = info.context.user
        creator = get_user_model().objects.filter(pk=user.id).first()

        # TODO: change to g2
        is_g2 = Profile.objects.filter(user=creator).first().g3
        if not is_g2:
            raise Exception('Permission denied, not G2!')
        
        client = ClientProfile.objects.filter(pk=client_id).first()
        if not client:
            raise Exception('Client Profile not found!')

        company = Company(
            client_profile=client, co_name=co_name, 
            address_1=address_1, address_2=address_2, 
            city=city, country=country, 
            created_by=creator, updated_by=creator)
        company.save()

        return CreateCompany(company=company)

class CompanyUpload(graphene.Mutation):
    company = graphene.Field(CompanyType)
    success = graphene.Boolean(default_value=False)

    class Arguments:
        co_id = graphene.Int(required=True)
        file = Upload(required=True)

    @user_passes_test(lambda u: u.is_authenticated and u.is_active)
    @staff_member_required
    def mutate(self, info, file, co_id, **kwargs):
        # TODO: validate file
        try:
            company = Company.objects.filter(pk=co_id).first()

            company.incorp_cert = file
            company.upload_date = timezone.now()
            company.save()
        except: 
            raise Exception('File could no be uploaded.')

        return CompanyUpload(company=company, success=True)


class UpdateCompany(graphene.Mutation):
    company = graphene.Field(CompanyType)

    class Arguments:
        co_id = graphene.Int(required=True)
        client_id = graphene.Int()
        co_name = graphene.String(required=True)
        address_1 = graphene.String(required=True)
        address_2 = graphene.String()
        city = graphene.String(required=True)
        country = graphene.String(required=True)
    
    @user_passes_test(lambda u: u.is_authenticated and u.is_active)
    @staff_member_required
    def mutate(
        self, info, co_id, co_name,
        address_1, address_2, city,
        country, client_id=None, **kwargs
    ):
        user = info.context.user
        editor = get_user_model().objects.filter(pk=user.id).first()

        # TODO: change to g2
        is_g2 = Profile.objects.filter(user=editor).first().g3
        if not is_g2:
            raise Exception('Permission denied, not G2!')

        company = Company.objects.filter(pk=co_id).first()

        if not company:
            raise Exception('Company not found!')

        company.co_name = co_name
        company.address_1 = address_1
        company.address_2 = address_2
        company.city = city
        company.country = country
        company.updated_by = editor

        if client_id:
            new_client = ClientProfile.objects.filter(pk=client_id).first()
            
            if not new_client:
                raise Exception('update client could not be found.')
            
            company.client_profile = new_client 

        company.save()

        return UpdateCompany(company=company)


class DeleteCompany(graphene.Mutation):
    company = graphene.Field(CompanyType)

    class Arguments:
        co_id = graphene.Int(required=True)

    @user_passes_test(lambda u: u.is_authenticated and u.is_active)
    @staff_member_required
    def mutate(self, info, co_id):
        user = info.context.user
        deleter = get_user_model().objects.filter(pk=user.id).first()

        # TODO: change to g2
        is_g2 = Profile.objects.filter(user=deleter).first().g3
        if not is_g2:
            raise Exception('Permission denied, not G2!')

        company = Company.objects.filter(pk=co_id).first()

        if not company:
            raise Exception('Company not found!')

        # cascade deletion to bank accounts
        child_bank_accounts = BankAccount.objects.filter(company=company).all()
        for account in child_bank_accounts:
            account.deleted = True
            account.save()

        company.deleted = True
        company.updated_by = deleter
        company.save()

        return DeleteCompany(company=company)


class Mutation (graphene.ObjectType):
    create_company = CreateCompany.Field()
    company_upload = CompanyUpload.Field()
    update_company = UpdateCompany.Field()
    delete_company = DeleteCompany.Field()