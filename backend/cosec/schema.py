from django.contrib.auth import get_user_model
from django.db.models import Q
from django.utils import timezone

import graphene
from graphene_django import DjangoObjectType

from graphene_file_upload.scalars import Upload

from .models import ClientProfile, Company
from users.models import UserProfile as Profile

class ClientType(DjangoObjectType):
    class Meta:
        model = ClientProfile

class CompanyType(DjangoObjectType):
    class Meta:
        model = Company



class Query(graphene.ObjectType):
    clients = graphene.List(
        ClientType, 
        client_id = graphene.Int(), 
        search = graphene.String(),
        first = graphene.Int(),
        skip = graphene.Int(),
        order_by = graphene.String()
    )
    companies = graphene.List(CompanyType, client_id=graphene.Int())
    count = graphene.Int(target=graphene.String())

    def resolve_clients(self, info, client_id=None, search=None, first=None, skip=None, order_by='company_name', **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')

        if not user.is_active:
            raise Exception('Permission Denied!')

        if client_id:
            if not user.is_staff:
                profile = Profile.objects.filter(user=user).first().client_profile

                if not profile:
                    raise Exception('User not associated with client profile.')

                if profile.id != client_id:
                    raise Exception('Access denied for requested profile.')

            client_profile = ClientProfile.objects.filter(pk=client_id).all()

            if not client_profile:
                raise Exception('Client profile not found.')

            return client_profile

        if user.is_staff:
            query_set = ClientProfile.objects.filter(deleted=False).order_by(f'{order_by}').all()

            if search:
                filter = (
                    Q(company_name__icontains=search) |
                    Q(first_name__icontains=search) |
                    Q(surnames__icontains=search)
                )
                query_set = query_set.filter(filter)

            if skip:
                query_set = query_set[skip:]

            if first:
                query_set = query_set[:first]

            return query_set

    def resolve_companies(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')

        if not user.is_active:
            raise Exception('Permission Denied!')

        if user.is_staff:
            return Company.objects.all()

        return Company.objects.filter(client_id=kwargs['client_id']).all()

    def resolve_count(self, info, target='clients', **kwargs):
        user = info.context.user

        if user.is_staff and user.is_active:
            if target == 'clients':
                return ClientProfile.objects.filter(deleted=False).count()
            elif target == 'companies':
                return Company.objects.filter(deleted=False).count()




class CreateClientProfile(graphene.Mutation):
    client_profile = graphene.Field(ClientType)

    class Arguments:
        first_name = graphene.String()
        surnames = graphene.String()
        title = graphene.String()
        gender = graphene.String()
        company_name = graphene.String()
        phone = graphene.String()
        email = graphene.String(required=True)
        country = graphene.String(required=True)

    def mutate(self, info, 
        first_name, surnames, title, 
        gender,  phone,
        company_name, email=None, country=None
    ):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')

        if not user.is_active:
            raise Exception('Permission Denied!')

        if not user.is_staff:
            raise Exception('Permission Denied!')

        creator = get_user_model().objects.filter(pk=user.id).first()

        # TODO: change to g2
        if not Profile.objects.filter(user=creator).first().g3:
            raise Exception('Permission denied, not G2!')

        if not(first_name and surnames) and not company_name:
            raise Exception('No company or individual names provided!')

        new_client = ClientProfile(
            first_name=first_name, surnames=surnames, 
            title=title, gender=gender, 
            company_name=company_name if company_name else 'Private Individual', 
            created_by=creator, updated_by=creator,
            phone=phone, email=email, country=country,
        )
        new_client.save()

        return CreateClientProfile(client_profile=new_client)


class UploadMutation(graphene.Mutation):
    client = graphene.Field(ClientType)
    success = graphene.Boolean(default_value=False)

    class Arguments:
        client_id = graphene.Int(required=True)
        file = Upload(required=True)

    def mutate(self, info, file, client_id, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')

        if not user.is_active:
            raise Exception('Permission Denied!')

        if not user.is_staff:
            raise Exception('Permission Denied!')
        
        client = ClientProfile.objects.filter(pk=client_id).first()

        client.incorp_cert = file
        client.upload_date = timezone.now()
        client.save()

        return UploadMutation(success = True)


class UpdateClientProfile(graphene.Mutation):
    client_profile = graphene.Field(ClientType)

    class Arguments:
        client_profile_id = graphene.Int(required=True)
        first_name = graphene.String(required=True)
        surnames = graphene.String(required=True)
        title = graphene.String(required=True)
        gender = graphene.String(required=True)
        company_name = graphene.String(required=True)
        phone = graphene.String(required=True)
        email = graphene.String(required=True)
        country = graphene.String(required=True)
    
    def mutate(
        self, info, client_profile_id, first_name,
        surnames, title, gender, company_name,
        phone, email, country
    ):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')

        if not user.is_staff and not user.is_active:
            raise Exception('Permission Denied!')

        editor = get_user_model().objects.filter(pk=user.id).first()

        # TODO: change to g2
        if not Profile.objects.filter(user=editor).first().g3:
            raise Exception('Permission denied, not G2!')

        client_profile = ClientProfile.objects.filter(pk=client_profile_id).first()

        if not client_profile:
            raise Exception('Client Profile not found!')

        client_profile.first_name = first_name
        client_profile.surnames = surnames
        client_profile.title = title
        client_profile.gender = gender
        client_profile.company_name = company_name
        client_profile.phone = phone
        client_profile.email = email
        client_profile.country = country
        client_profile.updated_by = editor

        client_profile.save()

        return UpdateClientProfile(client_profile=client_profile)


class DeleteClientProfile(graphene.Mutation):
    client_profile = graphene.Field(ClientType)

    class Arguments:
        client_profile_id = graphene.Int(required=True)

    def mutate(self, info, client_profile_id):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')

        if not user.is_staff and not user.is_active:
            raise Exception('Permission Denied!')

        deleter = get_user_model().objects.filter(pk=user.id).first()

        # TODO: change to g2
        if not Profile.objects.filter(user=deleter).first().g3:
            raise Exception('Permission denied, not G2!')

        client_profile = ClientProfile.objects.filter(pk=client_profile_id).first()

        if not client_profile:
            raise Exception('Client Profile not found!')

        client_profile.deleted = True
        client_profile.updated_by = deleter
        client_profile.save()

        return DeleteClientProfile(client_profile=client_profile)


class CreateCompany(graphene.Mutation):
    company = graphene.Field(CompanyType)

    class Arguments:
        client_id = graphene.Int(required=True)
        co_name = graphene.String(required=True)
        address = graphene.String()
        country = graphene.String()

    def mutate(self, info, client_id, co_name, address, country):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')


        if not user.is_staff:
            raise Exception('Permission Denied!')

        
        client = ClientProfile.objects.filter(pk=client_id).first()
        if not client:
            raise Exception('Client Profile not found!')

        company = Company(client_id=client, co_name=co_name, address=address, country=country, created=creator)
        company.save()

        return CreateCompany(company=company)



class Mutation (graphene.ObjectType):
    create_company = CreateCompany.Field()
    create_client_profile = CreateClientProfile.Field()
    update_client_profile = UpdateClientProfile.Field()
    delete_client_profile = DeleteClientProfile.Field()
    upload = UploadMutation.Field()