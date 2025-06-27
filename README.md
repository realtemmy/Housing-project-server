# Housing Project Server

This repository (`realtemmy/Housing-project-server`) serves as the backend server for the Housing Project application. It provides APIs and backend logic to support housing listings, user management, authentication, and other core features for a real estate or property management platform.

## Features

- User authentication and authorization
- CRUD operations for property listings
- User profile management
- Search and filter capabilities for listings
- RESTful API design
- Database integration with MongoDB and Mongoose
- Error handling and logging

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (recommend latest LTS)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) server (local or cloud)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/realtemmy/Housing-project-server.git
   cd Housing-project-server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and update the fields according to your setup.
   - Typical environment variables might include:

     ```
     PORT=3000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. **Start the server:**

   ```bash
   npm start
   # or
   yarn start
   ```

   The server should now be running at `http://localhost:3000` (or your specified PORT).

## API Documentation

- API endpoints are organized under `/api/v1/`.
- For detailed API usage, see the [API documentation](./docs/API.md) if available.
- Common endpoints:
  - `/api/auth/user` – User related endpoints
    - `GET /` - Gets all user's
    - `POST /login` - Login user
    - `POST /signup` - Creates new user
    - `GET /:id` - Gets user with Id
    - `/:userid/reviews` - Redirects to all of user's reviews

  - ### Protected

    - `GET /me` - Gets logged in user's data
    - `PATCH /update-password` - Updates user's password
    - `POST /update-user` - Updates user's documents (Only allows edit of name, email, phone number and address)
  - `POST /api/auth/category` – Category related routes
    - `GET /` - Gets all Category
    - `POST /` - Creates new Category (Only accepts one image and uploads to cloudinary) - Admin
    - `GET /:id` - Get's Category with id
    - `PATCH /:id` - Edits category fields - Admin
    - `DELETE /:id` - Delete category with id - Admin
    - `/:categoryid/sections` - Gets all section under category
    - `/:category/property` - Gets all property under category
  - `GET /api/section` – Section related routes
    - `GET /` - Gets all Section
    - `POST /` - Creates new Section
    - `GET /:id` - Get's Section with id
    - `PATCH /:id` - Edits Section fields - Admin
    - `DELETE /:id` - Delete section with id - Admin
    - `/:sectionId/property` - Gets all properties under section
  - `POST /api/property` – Property related routes
    - `GET /lnglat/:lnglat/distance/:distance` - returns properties closest to longitude and latitute and by distance
    - `GET /` - Returns all property
    - `POST /` - Creates a property (max of 8 images to upload) - Admin
    - `GET /:id` - Get's Property with id
    - `PATCH /:id` - Edit Property fields - Admin
    - `DELETE /:id` - Delete property with id - Admin
  - `POST /api/review` – Reviews of properties
      -`GET /` - Returns all reviews
    - `POST /` - Created a review
    - `GET /:id` - Returns property with id
    - `PATCH /:id` - Edit review
    - `DELETE /:id` - Delete review
  - etc.

## Project Structure

```
/Housing-project-server
│
├── src/            # Application source code
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── tests/          # Test cases
├── .env.example    # Example environment variables
├── package.json
└── README.md
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or bug fixes.

## License

This project is licensed under the [MIT License](./LICENSE).

## Contact

For questions or support, please open an issue or contact [realtemmy](https://github.com/realtemmy).
