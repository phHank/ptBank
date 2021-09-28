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
 - implement the database schema with `python manage.py makemigrations && python manage.py migrate`
 - create an admin account with `python manage.py createsuperuser` (You may need to perform this step in a CLI with admin privileges)
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
There are several custom built models for this app:

* UserProfile
* ClientProfile
* Company
* Bank
* BankAccount
* Transfer

### users:
**UserProfile includes:**

| Attribute    | Type             | Description           |
|-----------------|------------------|-------------------         |
| user                 | model     | One-To-One to extend Django's default User model |
| client_profile          | model           | ForeignKey to link a non-staff UserProfile with a client account     |
| g1  | Boolean           | Group 1/Legal access; default is False |
| g2  | Boolean           | Group 2/Company Secretarial access; default is False |
| g3  | Boolean           | Group 3/Banking access; default is False |


### cosec (company secreterial/incorporations):
**ClientProfile includes:**

| Attribute    | Type             | Description           |
|-----------------|------------------|-------------------         |
| first_name                 | String     | A client's first name |
| surnames         | String           | A client's surnames  |
| title        | String           | A client's title; Mr, Ms, Miss, None, etc.  |
| gender        | String           | A client's gender  |
| company_name  | String           | Client's company Name; default: "Private Individual" |
| phone  | String           | Contact number |
| email  | String           | Contact email |
| country | String           | Client jurisdiction |
| incorp_cert  | String           | URL of uploaded certificate of incorporation of client company |
| upload_date | DateTime           | Date and time of when the certificate of incorporation was uploaded |
| created_by  | model           | ForeignKey to User who created the client profile |
| date_created  | DateTime           | Date and time the client profile was created |
| updated_by  | model           | ForeignKey to User who last updated the client profile |
| last_updated  | DateTime           | Date and time the client profile was last updated |
| deleted  | Boolean         | Marks whether a GUI user has deleted the user profile and it is hidden from view but not deleted from the database; default: False |


**Company includes:**

| Attribute    | Type             | Description           |
|-----------------|------------------|-------------------         |
| client_profile                 | model     | ForeignKey linking a child company with a parent Client Profile |
| co_name         | String           | Name of the incorporation  |
| address_1       | String           | First line of company's address  |
| address_2       | String           | Second line of company's address  |
| city      | String           | City or province of company  |
| country       | String           | Country of company  |
| incorp_cert  | String           | URL of uploaded certificate of incorporation of company |
| upload_date | DateTime           | Date and time of when the certificate of incorporation was uploaded |
| created_by  | model           | ForeignKey to User who created the company |
| date_created  | DateTime           | Date and time the company was created |
| updated_by  | model           | ForeignKey to User who last updated the company |
| last_updated  | DateTime           | Date and time the company was last updated |
| deleted  | Boolean         | Marks whether a GUI user has deleted the company and it is hidden from view but not deleted from the database; default: False |


### transfers (banking):
**Bank includes:**

| Attribute    | Type             | Description           |
|-----------------|------------------|-------------------         |
| name                 | String     | Name of a Bank; for example "Bank of Ireland" |
| country         | String           | Bank jurisdiction  |

**BankAccount includes:**

| Attribute    | Type             | Description           |
|-----------------|------------------|-------------------         |
| company                | model     | ForeignKey link to company that owns the account |
| bank         | model           | ForeignKey link to bank account provider  |
| acc_name         | String           | Name of the company's bank account  |
| iban         | String           | IBAN identifier of account  |
| swift         | String           | SWIFT/BIC bank identifier  |
| account_no         | String           | Local account identifier  |
| sort_code         | Int           | Sort Code (NSC) local bank branch identifier |
| opended         | Date           | Date the account was opened  |
| currency_code         | String           | Account denomination  |
| deleted  | Boolean         | Marks whether a GUI user has deleted the bank account and it is hidden from view but not deleted from the database; default: False |

**Transfer includes:**

| Attribute    | Type             | Description           |
|-----------------|------------------|-------------------         |
| account                | model     | ForeignKey link to BankAccount; the debiting bank account |
| date_received         | DateTime           | Time the transfer request was created  |
| currency         | String           | The transfer currency  |
| amount        | Float           | Value of the transfer  |
| benif_name         | String           | Beneficiary name/account name of the recipient  |
| benif_account         | String           | IBAN or Local account identifier of recipient  |
| benif_swift         | String           | SWIFT/BIC/Sort Code (NSC) of recipient account |
| save_benif_details         | Boolean           | Save the recipient's details for future transactions (model to be implemented); default: False |
| payment_ref         | String           | Reason for the transfer |
| payment_date  | Date         | Preferred payment/execution date of the transfer; default: Today (should be Tomorrow) |
| urgent         | Boolean           | Is the transfer urgent; default: False |
| security_phrase        | String           | Phrase to authenticate the transfer request is from a legitimate source |
| deleted  | Boolean         | Marks whether a GUI user has deleted the transfer and it is hidden from view but not deleted from the database; default: False |



## Queries

All values of the above fields can be retrieved with the following GraphQL Queries. 

| Query    | Underlying Model            | Paramaters          |
|-----------------|------------------|-------------------         |
| users                | django.contrib.auth.models.User     | N/A |
| userProfile         | UserProfile           | N/A  |
| clients         | ClientProfile           | clientId: Int, search: String, first: Int, skip: Int, orderBy: String |
| companies         | Company           | coId: Int, search: String, first: Int, skip: Int, orderBy: String |
| banks        |  Bank         | search: String, first: Int, skip: Int, orderBy: String |
| bankAccounts         | BankAccount           | search: String, first: Int, skip: Int, orderBy: String |
| bankAccount         | BankAccount           | accId: Int! |
| transfers         | Transfer           | month: Int, year: Int, search: String, orderBy: String |
| transfer         | Transfer           | id: Int! |
| count        | ClientProfile, Company, Bank, BankAccount, Transfer           | target: String! = 'clients'  |



**NB** To query fields, camelCase is used in the GraphQ sytanx, for example, to retrieve the account name, amount, and benificiary name of a transfer with an ID of 42 use the following query:

```javascript
{
  transfer (id: 42 ) {
    account { 
      accName
    }
    amount
    benifName
  }
}
```


## Mutations

| Mutation    | Underlying Model            | Paramaters          |
|-----------------|------------------|-------------------         |
| createUser             | django.contrib.auth.models.User     | username: String!, password: String!, email: String! |
| createUserProfile         | UserProfile           | username: String!, password: String!, email: String!, clientId: Int, isStaff: Boolean, g1: Boolean, g2: Boolean, g3: Boolean |
| tokenAuth         | Django GraphQL JWT           | username: String!, password: String! |
| verifyToken         | Django GraphQL JWT           | token: String! |
| refreshToken         | Django GraphQL JWT           | token: String! |

**NB** To mutate, camelCase is used in the GraphQ sytanx, for example, to create a new user profile the following can be used:

```javascript
mutation {
  createUserProfile (username: "USERNAME" password: "YOUR_PASSWORD", email: "EMAIL@EMAIL.COM", clientId: 1) {
    user {
      id
      username
      email
    }
    g1
  }
}
```

## Authenication and Security
This app is not protected against brute force password guessing or the like. It is recommended to install Django-Axes or to at least implement Captcha, or better yet MFA to beef up security. As this is only a proof of concept, the use of JWT's was fit for purpose.