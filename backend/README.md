# PT Banking - Backend

GraphQL API running at 'http://localhost:8000/' after startup. The API offers full CRUD interactivity with the application's models. Models and example queries and mutations can be seen below. The API can be inspected at 'http://localhost:8000/graphql/' or with Postman. 

A valid JWT can be obtained from the API after creating a user and by running the following mutation: 

```javascript
mutation {
  tokenAuth (username: "YOUR_USERNAME" password: "YOUR_PASSWORD") {
    token
  }
}
```

## Requirements
The app was built and tested with:
 - Python 3.8.3
 - pip 21.0
 - virtualenv 20.4.3 (recommended)

## Setup
 - After cloning the project with `git clone https://github.com/phHank/ptBank.git`
 - `cd backend/`
 - install the dependencies with `pip install -r requirements.txt` **NB** It is advisable to perform this step and subsequent steps while in a virtual environment.
 - implement the database schema with `python manage.py migrate`
 - create an admin account with `python manage.py createsuperuser`
 - Now immediately give your newly created superuser permissions to view banking/g3 info (where g3, short for Group 3, is banking, g1 is legal, and g2 is incorporations/company secretarial):
    - `python manage.py shell`
    - &gt; `from users.models import UserProfile`
    - &gt; `from django.contrib.auth.models import User`
    - &gt; `superuser = User.objects.first()`
    - &gt; `user_profile = UserProfile(user=superuser, g3=True)`
    - &gt; `user_profile.save()`
    - &gt; `exit()`
 - run the dev server with `python manage.py runserver`
 - go to http://localhost:8000/graphql/ to query the GraphQL API
 - **OR** follow the instructions in [Frontend README.md](https://github.com/phHank/ptBank/blob/main/frontend/README.md) to use the GUI.

## Models
 **TODO**: give models and their datatypes and defaults if set. 


## Queries
 **TODO**: give example Queries 

## Mutations
 **TODO**: give example Mutations


## Authenication and Security
This app is not protect against brute force password guessing or the like. It is recommended to install Django-Axes or to at least implement Captcha, or better yet MFA to beef up security. As this is only a proof of concept, the use of JWT's was fit for purpose.