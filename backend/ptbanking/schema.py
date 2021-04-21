import graphene
import graphql_jwt

import transfers.schema
import users.schema
from cosec import schema as client_schema, company_schema

class Query(users.schema.Query, company_schema.Query, client_schema.Query, transfers.schema.Query, graphene.ObjectType):
    pass

class Mutation(users.schema.Mutation, company_schema.Mutation, client_schema.Mutation, transfers.schema.Mutation, graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)