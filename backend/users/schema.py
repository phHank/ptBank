from django.contrib.auth import get_user_model
from .models import UserProfile

import graphene
from graphene_django import DjangoObjectType

from cosec.schema import ClientType

class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()


class UserProfileType(DjangoObjectType):
    class Meta:
        model = UserProfile



class Query(graphene.ObjectType):
    users = graphene.List(UserType)
    user_profile = graphene.List(UserProfileType)
    client_profile = graphene.List(ClientType)

    def resolve_users(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        
        return get_user_model().objects.all()

    def resolve_user_profile(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')

        return UserProfile.objects.filter(user=user.id).all()



class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, username, password, email):
        user = get_user_model()(
            username = username,
            email = email
        )

        user.set_password(password)
        user.save()

        return CreateUser(user=user)


class CreateUserProfile(graphene.Mutation):
    user_profile = graphene.Field(UserProfileType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)
        client_id = graphene.Int()
        is_staff = graphene.Boolean()
        g1 = graphene.Boolean()
        g2 = graphene.Boolean()

    def mutate(
        self, info, username, password, email, 
        client_id=None, g1=False, g2=False, is_staff=False
        ):
        creator = info.context.user
        if creator.is_anonymous:
            raise Exception('Not Logged in!')

        if not creator.is_superuser and is_staff:
            raise Exception('403: Permission denied, only superuser can create staff profile!')
        
        user = get_user_model()(
            username = username,
            email = email
        )
        user.is_staff = is_staff
        user.set_password(password)
        user.save()

        client = ClientProfile.objects.filter(pk=client_id).first()
        
        user_profile = UserProfile(user=user, client_profile=client, g1=g1, g2=g2)
        user_profile.save()

        return CreateUserProfile(user_profile=user_profile)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    create_user_profile = CreateUserProfile.Field()