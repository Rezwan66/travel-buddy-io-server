# Travel-Buddy-io Backend Server

Server side for the Travel-Buddy-io carpool and ride-sharing website, built using Express JS and MongoDB CRUD operations, with JWT Authorization using HTTP-only cookie.

### Technologies used

[![Tech](https://skillicons.dev/icons?i=nodejs,express,mongodb,vercel)](https://skillicons.dev)

## Getting Started

Follow these steps to set up and run the backend server on your local machine.

Clone the repository and navigate to the cloned repo.

#### Install Dependencies

```bash
npm install
```

#### Configure Environment Variables

Create a .env file in the root of your project and add the necessary environment variables.

```env
DB_USER=your_mongodb_user
DB_PASS=your_mongodb_pass
ACCESS_TOKEN_SECRET=your_generated_access_token_secret
```

#### Run the Server

After configuring the environment variables, run this command to start the project.

```bash
nodemon index.js
```

[Vercel Live Server](https://travel-buddy-io-server.vercel.app/)
