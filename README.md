Project Report: Sheetsight - A MERN Stack Excel Analytics Platform
1. Project Overview
Sheetsight is a dynamic, full-stack web application built from the ground up using the MERN stack (MongoDB, Express.js, React, Node.js). The platform provides users with a secure, personalized environment to upload Excel spreadsheets, parse the data within them, and generate meaningful, downloadable data visualizations on the fly. The project successfully fulfills all core requirements of a modern data analytics tool, from user authentication to live deployment.
2. Core Features Implemented
Secure User Authentication: Users can register for a new account and log in securely. The system uses JSON Web Tokens (JWT) for managing user sessions, ensuring that private data and functionality are protected.
Excel File Upload & Parsing: A robust file handling system allows logged-in users to upload Excel files (.xls or .xlsx). The backend, using libraries like Multer and SheetJS, efficiently parses the file data in memory.
Data Persistence: Parsed data from uploaded files is successfully stored in a MongoDB Atlas database. Each data set is linked to the specific user who uploaded it, creating a personalized history for each user.
Dynamic Data Visualization: The core feature of the application allows users to select any file from their upload history and dynamically map its columns to X and Y axes. The application then renders an interactive bar chart using Chart.js.
Chart Export: Users can download any chart they generate as a high-quality PNG image file, allowing them to save or share their analysis.
Polished User Interface: The application features a clean, professional, and responsive user interface with a consistent design across the Login, Register, and Dashboard pages, providing a smooth user experience.
3. Technology Stack
Backend: Node.js, Express.js
Frontend: React.js
Database: MongoDB (with Mongoose ODM)
Key Libraries:
axios for frontend-backend communication.
jsonwebtoken & bcrypt.js for authentication.
multer for file handling.
xlsx (SheetJS) for Excel data parsing.
chart.js & react-chartjs-2 for data visualization.
Deployment:
Backend: Deployed as a Web Service on Render.
Frontend: Deployed as a Static Site on Netlify.
4. Final Outcome
The project was brought to a successful conclusion with both the frontend and backend being deployed to live, publicly accessible URLs. The final application is fully functional, stable, and meets all the primary objectives outlined in the initial project brief. The development journey involved significant real-world problem-solving, particularly in configuring the frontend build tools and resolving cross-origin (CORS) issues in a deployed environment, all of which were successfully overcome.
