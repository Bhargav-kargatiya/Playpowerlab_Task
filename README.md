# Quiz Application


## Features
- User authentication with JWT.
- AI-generated quizzes and skill improvement suggestions.
- Email notifications with quiz results.
- MongoDB integration for quiz data and submissions.
- Dockerized for easy deployment.


## Technologies
* **Node.js & Express**: Server-side application framework.
* **MongoDB & Mongoose**: Database and ODM for data storage and management.
* **JWT**: For user authentication.
* **Express-Async-Handler**: For handling asynchronous operations in Express routes.
* **Dotenv**: For managing environment variables.
* **Nodemailer**: Email sending functionality.
* **AI Integration**: Using `groq-sdk` for AI-generated content.
 
## Installation
To run this project locally, follow these steps:
   1. **Dwonload Zip File:**
      ```bash
      https://drive.google.com/file/d/1NKzzpkFqGB9ZltqqQ4xiugEG3nfah_In/view?usp=drive_link
      ```

   2. **Install dependencies:**
      ```bash
      npm install   
      ```
   3. **Environment Variables:**
      Create a `.env` file in the root of the backend and frontend    directories and add the following variables:
      ```bash
      GROQ_API_KEY=your-groq-api-key
      MONGO_URI=your-mongodb-uri
      GMAIL_USER=your-email@gmail.com
      GMAIL_PASS=your-gmail-app-password
      PORT=6000
      JWT_SECRET=your-jwt-secret
      JWT_EXPIRES_IN=3d
         ```  
4. **Start the server:**
   ```bash
   npm run server  
   ```

## API Documentation

For detailed API documentation, including available endpoints and request/response examples, please refer to the [Postman Documentation](https://documenter.getpostman.com/view/36171887/2sAXjRWpUq).


