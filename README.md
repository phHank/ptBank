# PT Banking

A proof of concept web app which is suited to a small financial services company offering incorporations, legal, and banking services, among others. 

Authenticated users of the app are able to view, create, edit and delete client profiles, company profiles, bank information, bank accounts, and bank transfers, of course, all depending on their role and staff status. 

The web app was built with ReactJS and [Apollo Client](https://github.com/apollographql/apollo-client) on the frontend and Django 3.1 with [Graphene-Python](https://github.com/graphql-python/graphene) on the backend.

As the backend and frontend are served seperately, [Django-GraphQL-JWT](https://github.com/flavors/django-graphql-jwt) is used for authentication. 


# Requirements
The app was built and tested with:
 - Python 3.8.3
 - Node 14.16.1


# Setup
- Clone the code locally with `git clone https://github.com/phHank/ptBank.git` 
- Follow the installation instructions for the backend and frontend using their respective README files.
- [Backend README.md](https://github.com/phHank/ptBank/blob/main/backend/README.md)
- [Frontend README.md](https://github.com/phHank/ptBank/blob/main/frontend/README.md)


# Automated Testing
This proof of concept was initially built in a time sensitive manner; shamefully, automated testing is still to be implemented in both the backend and the frontend.