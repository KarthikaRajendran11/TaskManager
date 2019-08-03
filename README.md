# TaskManager

App where users can register, login and add tasks. 

DB : MongDB

# To run the app:

node install

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
