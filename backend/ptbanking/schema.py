import graphene
import graphql_jwt

import users.schema
from cosec import schema as client_schema, company_schema
from transfers import schema as banks_schema, bank_acc_schema, transfers_schema

class Query(
    users.schema.Query, 
    company_schema.Query, client_schema.Query, 
    banks_schema.Query, bank_acc_schema.Query, transfers_schema.Query,
    graphene.ObjectType
):
    pass

class Mutation(
    users.schema.Mutation, 
    company_schema.Mutation, client_schema.Mutation, 
    bank_acc_schema.Mutation, banks_schema.Mutation, transfers_schema.Mutation,
    graphene.ObjectType
):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)