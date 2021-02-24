from django.contrib.auth import get_user_model

import graphene
from graphene_django import DjangoObjectType

from .models import ClientProfile, Company

import time

class ClientType(DjangoObjectType):
    class Meta:
        model = ClientProfile

class CompanyType(DjangoObjectType):
    class Meta:
        model = Company



class Query(graphene.ObjectType):
    clients = graphene.List(ClientType)
    companies = graphene.List(CompanyType, client_id=graphene.Int())

    def resolve_clients(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')

        if user.is_staff:
            return ClientProfile.objects.all()
        else:
            raise Exception('Permission Denied!')

    def resolve_companies(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')

        if user.is_staff:
            return Company.objects.all()

        return Company.objects.filter(client_id=kwargs['client_id']).all()




class CreateClientProfile(graphene.Mutation):
    client_profile = graphene.Field(ClientType)

    class Arguments:
        first_name = graphene.String()
        surnames = graphene.String()
        title = graphene.String()
        gender = graphene.String()
        company_name = graphene.String()
        phone = graphene.String()
        email = graphene.String()

    def mutate(self, info, first_name, surnames, title, gender, company_name, phone, email):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')

        creator = get_user_model().objects.filter(pk=user.id).first()

        if not user.is_staff:
            raise Exception('Permission Denied!')

        if (not first_name and not surnames) or not company_name:
            raise Exception('No company or individual names provided')

        new_client = ClientProfile(
            first_name=first_name, surnames=surnames, 
            title=title, gender=gender, 
            company_name=company_name, created_by=creator,
            date_created=int(time.time()), updated_by=creator,
            phone=phone, email=email, 
            )
        new_client.save()

        return CreateClientProfile(client_profile=new_client)



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

        creator = get_user_model().objects.filter(pk=user.id).first()

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