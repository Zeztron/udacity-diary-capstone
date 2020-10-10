# udacity-diary-capstone
Final capstone project for Udacity's Cloud Developer Nanodegree
This is a Diary Application where users can post their thoughts. Users can delete and update diaries.

# Functionality of the application

This application will allow creating/removing/updating/fetching Diary items. Each user only has access to Diary items that he/she has created.

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless Diary application.