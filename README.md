# TaskManager

App where users can register, login and add tasks. 

DB : MongDB

- Download mongodb community server from https://www.mongodb.com/try/download/community and unzip and move to any location. 
- Create another folder in the same directory 
- Run the below command to start mongodb

/Users/user/mongodb/bin/mongod --dbpath=/Users/user/mongodb-data

Sendgrid:

- Create an account at https://signup.sendgrid.com/ and create an API key and add to config file

# To run app in docker

- Install Docker
- Run `make up` from terminal
- To hit routes, follow the pattern mentioned below

`curl -X POST 'http://127.0.0.1:8080/users' -d '{"name": "abc", "email": "abc@gmail.com", "password" : "secret9@"}' -H "Content-Type: application/json"`



# To run the app:

node install
u
npm run dev

# APIs:

# To add users:

POST /users

{
	"name" : "any_name",
	"email" : "any_email_id",
	"password" : "any_password"
}

# Header:

{
  "Authorization" : "Bearer __token"
}

__token generated via POST /users/login API

# To login:

POST /users/login

{
  "email" : "users_email_id",
  "password" : "users_password"
}

Response:

{
    "user": {
        "age": int,
        "_id": "uuid",
        "name": "string",
        "email": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "__v": int
    },
    "token": "string"
}

# To add tasks for a user:

POST /tasks

{
	"description" : "string",
	"completed" : boolean
}

Response:

{
    "_id": string,
    "description": string,
    "completed": boolean,
    "owner": string,
    "createdAt": string,
    "updatedAt": string,
    "__v": int
}

# To logout:

POST /users/logout

# To logout of all sessions:

POST /users/logoutAll

# To update user:

PATCH /users/me

{
	"age" : int  // or any parameter to be modified
}

# To update task:

PATCH /tasks/{taskId}

{
	"description" : string
}

# To upload a profile pic:

POST /users/me/avatar

form-data : "avatar" : choose any file to upload

# To delete a user:

DEL /users/{userId}

# To delete a task:

DEL /tasks/{taskId}
