## TaskManager

App where users can register, login and add tasks. 

### DB : MongDB

- Download mongodb community server from https://www.mongodb.com/try/download/community and unzip and move to any location. 
- Create another folder in the same directory 
- Run the below command to start mongodb

/Users/user/mongodb/bin/mongod --dbpath=/Users/user/mongodb-data

### Sendgrid:

- Create an account at https://signup.sendgrid.com/ and create an API key and add to config file

## To run app in docker

- Install Docker
- Run `make up` from terminal
- To hit routes, follow the pattern mentioned below

`curl -X POST 'http://127.0.0.1:8080/users' -d '{"name": "abc", "email": "abc@gmail.com", "password" : "secret9@"}' -H "Content-Type: application/json"`

## To run the app:

node install
u
npm run dev

## APIs:

### Register new users:

`curl -X POST 'http://127.0.0.1:8080/users' -d '{"name": "abc", "email": "abc@gmail.com", "password" : "secret9@"}' -H "Content-Type: application/json"`

### Login:

`curl -X POST 'http://127.0.0.1:8080/users/login' -d '{"email": "abc@gmail.com", "password" : "secret9@"}' -H "Content-Type: application/json"`

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

### To add tasks for a user:

`curl -X POST 'http://127.0.0.1:8080/tasks' -d '{"description" : "Learn something new everyday", "completed" : false}' -H "Content-Type: application/json" -H "Content-Type: Authorization __token"`

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

### To logout:

`curl -X POST 'http://127.0.0.1:8080/users/logout' -H "Content-Type: application/json" -H "Content-Type: Authorization __token"`

### To logout of all sessions:

`curl -X POST 'http://127.0.0.1:8080/users/logoutAll' -H "Content-Type: application/json" -H "Content-Type: Authorization __token"`

### To update user:

`curl -X PATCH 'http://127.0.0.1:8080/users/me' -d '{"age" : 12, "name": "ABC", "email" : "ABC@gmail.com", "password" : "topSecret77"}'  -H "Content-Type: application/json" -H "Content-Type: Authorization __token"`

### To update task:

`curl -X PATCH 'http://127.0.0.1:8080/tasks/{taskId}' -d '{"description" : "Update tasks", "completed" : true}'  -H "Content-Type: application/json" -H "Content-Type: Authorization __token"`

### To upload a profile pic:

`curl -X POST 'http://127.0.0.1:8080/users/me/avatar' -F image=avatar.jpg -H "Content-Type: Authorization __token"`

### To delete a user:

`curl -X DELETE 'http://127.0.0.1:8080/users/{userId}' -H "Content-Type: Authorization __token"`

### To delete a task:

`curl -X DELETE 'http://127.0.0.1:8080/tasks/{taskId}' -H "Content-Type: Authorization __token"`
