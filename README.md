# Axion

## Overview
Axion is a web application designed to manage schools, classrooms, and students. It includes role-based access control for superadmins and school admins.

## Features
- User authentication and authorization
- Role-based access control
- School, classroom, and student management

## Installation

1. **Clone the repository:**
    
   ```sh
   git clone https://github.com/Anandesh-Sharma/soar-test.git
   cd soar-test
   ```

2. **Install dependencies**
    
    ```sh
    npm install
    ```

3. **Set up environment variables**

    Create a `.env` file in the root directory.
    Add the necessary environment variables as specified in `index.config.js`.
    
    ```
    SERVICE_NAME=school_ms
    USER_PORT=5111
    ADMIN_PORT=5222
    ADMIN_URL=http://localhost:5222
    ENV=development
    REDIS_URI=redis://127.0.0.1:6379
    
    CORTEX_REDIS=redis://127.0.0.1:6379
    CORTEX_PREFIX=none
    CORTEX_TYPE=your_sschool_mservice_name
    OYSTER_REDIS=redis://127.0.0.1:6379
    OYSTER_PREFIX=none
    
    CACHE_REDIS=redis://127.0.0.1:6379
    CACHE_PREFIX=school_ms:ch
    
    MONGO_URI=mongodb://localhost:27017/school_ms
    LONG_TOKEN_SECRET=d4f5e6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5
    SHORT_TOKEN_SECRET=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
    NACL_SECRET=$2b$10$7QJ8b1Q5z1Z8Q1Q5z1Z8QO1Q5z1Z8Q1Q5z1Z8Q1Q5z1Z8Q1Q5z1Z8Q
    ```
    
4. **Start MongoDB** 

    Ensure MongoDB is running and accessible at the URI specified in the `.env` file.


5. **Run Application**
    ```sh
    npm run start
    ```

6. **Access the application**

    The application should now be running and accessible at the port specified in the `.env` file (default is `5111`)
    