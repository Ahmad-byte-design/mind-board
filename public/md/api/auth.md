
POST
/api/v1/auth/register


//the request
{
  "name": "John Doe",
  "email": "john1@example.com",
  "password": "Password123!",
  "password_confirmation": "Password123!"
   "avatar":null 
}



//the response

{
  "message": "Registration successful.",
  "user": {
    "id": 2,
    "name": "John Doe",
    "email": "john1@example.com",
    "avatar": null,
    "email_verified_at": null,
    "created_at": "2026-08-26T15:12:12.000000Z",
    "updated_at": "2026-08-26T15:12:12.000000Z"
  }
}




POST
/api/v1/auth/login
{
  "email": "john@example.com",
  "password": "Password123!",
  "remember": false
}


{
  "message": "Login successful.",
  "user": {
    "id": 2,
    "name": "John Doe",
    "email": "john1@example.com",
    "avatar": null,
    "email_verified_at": null,
    "created_at": "2026-08-26T15:12:12.000000Z",
    "updated_at": "2026-08-26T15:12:12.000000Z"
  }
}



Post
/api/v1/auth/logout
"message": "Logged out successfully."


GET
/api/v1/auth/me

{
  "user": {
    "id": 2,
    "name": "John Doe",
    "email": "john1@example.com",
    "avatar": null,
    "email_verified_at": null,
    "created_at": "2026-08-26T15:12:12.000000Z",
    "updated_at": "2026-08-26T15:12:12.000000Z"
  }
}