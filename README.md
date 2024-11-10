# Voting Application

This is a backend application for a voting system where users can vote for candidates. It provides functionalities for user authentication, candidate management, and voting.

## Motivation

Voting is a fundamental part of any democratic system, and creating an efficient, secure, and accessible voting system is essential. This project explores building a RESTful API-based voting application with secure user authentication and authorization mechanisms, enabling users to vote while ensuring data integrity. The project also showcases backend CRUD operations, JWT handling, and database interactions.

## Features

- User registration and login with Aadhaar number and password
- Role-based access for user (voter) and admin
- Users can view candidates and cast votes
- Admins can manage candidates (add a candidate, update a candidate, delete a candidate)
- Secure data management and JWT-based authentication

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT) for authentication

## Installation

1. Clone the repository:

   ```bash
   git@github.com:Dibya-z/VotingApp.git

2. Install dependencies:

   ```bash
   npm install

3. Configure environment variables

   Create a .env file in the root directory and add the following variables:

   ```bash
   PORT=3000
   MONGODB_URL_LOCAL=<your-mongodb-url>
   JWT_SECRET=<your-jwt-secret>  

4. Start the application:

   ```bash
   npm start


# API Endpoints

## User Routes

### Sign Up
- `POST /user/signup`: Sign up a user

Request Body:
      ```bash
      {
      "name": "string",
      "age": "number",
      "mobile": "string",
      "email": "string",
      "address": "string",
      "aadharCardNumber": "number",
      "password": "string",
      "role": "voter or admin"
      }

Responses:
   
   Copy code
   200 OK: Returns user data and JWT token.
   400 Bad Request: Aadhaar validation error or admin already exists.
   500 Internal Server Error



### Login
- `POST /user/login`: Login a user

   Request Body:
   {
      "aadharCardNumber": "number",
      "password": "string"
   }

   Responses:
   200 OK: Returns JWT token.
   401 Unauthorized: Incorrect credentials.
   500 Internal Server Error

### Get Profile
- `GET /user/profile`: Gets the authenticated user's profile

   Header: Authorization (Bearer Token)

   Responses:
   200 OK: Returns user profile.
   500 Internal Server Error

### Update Password
- `PUT /user/profile/password`: Updates the authenticated user's password

   Request Body:
   {
      "currentPassword": "string",
      "newPassword": "string"
   }

   Responses:
   200 OK: Password updated.
   401 Unauthorized: Invalid current password.
   500 Internal Server Error

## Candidate Routes

### Add Candidate (Admin Only)
- `POST /candidate/`: Add a new candidate (Admin only)
   Header: Authorization (Bearer Token)
   Request Body:
   {
      "name": "string",
      "party": "string",
      "age": "number"
   }

   Responses:
   200 OK: Candidate added.
   403 Forbidden: Non-admin user.
   500 Internal Server Error


### Update Candidate (Admin Only)
- `PUT /candidate/:candidateID`: Updates candidate information by ID (Admin only)
   Header: Authorization (Bearer Token)
   Request Body:
   {
      "name": "string",
      "party": "string",
      "age": "number"
   }

   Responses:
   200 OK: Candidate updated.
   403 Forbidden: Non-admin user.
   404 Not Found: Candidate does not exist.
   500 Internal Server Error


### Delete Candidate (Admin Only)
- `DELETE /candidate/:candidateID`: Delete a candidate by ID (Admin only)
   Header: Authorization (Bearer Token)

   Responses:
   200 OK: Candidate deleted.
   403 Forbidden: Non-admin user.
   404 Not Found: Candidate does not exist.
   500 Internal Server Error

## Voting Routes

### Get Vote Count
- `GET /candidate/vote/count`: Gets the vote count for all candidates, sorted by votes

   Responses:
   200 OK: List of candidates with vote count.
   500 Internal Server Error

### Vote for Candidate (User Only)
- `POST /candidate/vote/:candidateID`: Vote for a candidate (User only)

   Header: Authorization (Bearer Token)

   Responses:
   200 OK: Vote recorded.
   403 Forbidden: Admins cannot vote.
   400 Bad Request: User has already voted.
   404 Not Found: Candidate does not exist.
   500 Internal Server Error

### List Candidates
- `GET /candidate/` : Gets a list of all candidates with name and party

   Responses:
   200 OK: List of candidates.
   500 Internal Server Error

## Error Handling

The API returns standard HTTP status codes to indicate success or error conditions. Each error response includes an appropriate status code and message.

## Security

JWT Authentication: Ensures only authenticated users can access restricted routes.
Role-Based Access Control: Admins have exclusive access to candidate management routes.