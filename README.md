# Dealer Management System - Backend API

A robust RESTful API for managing dealer information with authentication, search, filtering, and pagination capabilities.

## Features

- Complete CRUD operations for dealers
- User authentication with JWT
- Search functionality across multiple fields
- Filter by status and region
- Sorting and pagination
- Soft delete for dealers
- Input validation
- Error handling
- Security features (Helmet, Rate Limiting, CORS)
- MongoDB with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Environment Variables**: dotenv

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Dealer-Management-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/dealer-management
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   ```

   For MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dealer-management?retryWrites=true&w=majority
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Seed the database** (optional - creates sample data)
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The API will be running at `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Dealers

#### Get All Dealers (with filters, search, pagination)
```http
GET /api/dealers?search=premium&status=ACTIVE&region=North&sortBy=name&sortOrder=asc&page=1&limit=10
```

**Query Parameters:**
- `search` - Search in name, email, phone, address
- `status` - Filter by ACTIVE or INACTIVE
- `region` - Filter by region
- `sortBy` - Sort field (name, createdAt, etc.)
- `sortOrder` - asc or desc
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### Get Single Dealer
```http
GET /api/dealers/:id
```

#### Create Dealer
```http
POST /api/dealers
Content-Type: application/json

{
  "name": "Premium Auto Dealer",
  "email": "contact@premiumauto.com",
  "phone": "1234567890",
  "address": "123 Main Street, New York, NY 10001",
  "operatingHours": "9:00 AM - 7:00 PM",
  "status": "ACTIVE",
  "region": "North"
}
```

#### Update Dealer
```http
PUT /api/dealers/:id
Content-Type: application/json

{
  "name": "Updated Dealer Name",
  "status": "INACTIVE"
}
```

#### Delete Dealer (Soft Delete)
```http
DELETE /api/dealers/:id
```

#### Get Dealer Statistics
```http
GET /api/dealers/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "active": 45,
    "inactive": 5,
    "byRegion": [
      { "_id": "North", "count": 15 },
      { "_id": "South", "count": 12 }
    ]
  }
}
```

## Project Structure

```
Dealer-Management-Backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   └── dealerController.js  # Dealer CRUD logic
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Global error handler
│   │   └── validation.js        # Input validation
│   ├── models/
│   │   ├── Dealer.js            # Dealer schema
│   │   └── User.js              # User schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth routes
│   │   └── dealerRoutes.js      # Dealer routes
│   ├── seed/
│   │   └── seedData.js          # Database seeding
│   └── server.js                # App entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Database Schema

### Dealer Model
```javascript
{
  name: String (required, max 100 chars),
  email: String (required, unique, valid email),
  phone: String (required, 10-15 digits),
  address: String (required),
  operatingHours: String (required),
  status: Enum ['ACTIVE', 'INACTIVE'],
  region: String (required),
  isDeleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: Enum ['admin', 'user'],
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **Helmet**: Sets security headers
- **CORS**: Cross-Origin Resource Sharing configured
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Express Validator
- **Soft Delete**: Dealers are never permanently deleted

## Error Handling

All errors return a consistent format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": []  // Optional validation errors
}
```

## Testing with Sample Data

After running `npm run seed`, you can test with:

**Test Users:**
- Admin: `admin@dealermanagement.com` / `admin123`
- User: `user@dealermanagement.com` / `user123`

**Sample Dealers:**
- 8 pre-configured dealers with various statuses and regions

## Deployment

### Render / Railway / Cyclic

1. Create a new Web Service
2. Connect your GitHub repository
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Build Command: `npm install`
5. Start Command: `npm start`

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
NODE_ENV=production
JWT_SECRET=your_production_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-url.com
```

## API Testing

Use tools like:
- **Postman**: Import collection from docs
- **Thunder Client**: VS Code extension
- **curl**: Command line testing

Example curl:
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dealermanagement.com","password":"admin123"}'

# Get dealers
curl -X GET "http://localhost:5000/api/dealers?page=1&limit=10"
```

## Development Tips

1. **Auto-reload**: Use `npm run dev` for development
2. **Database GUI**: Use MongoDB Compass for visual database management
3. **API Testing**: Postman collection available on request
4. **Logs**: Check console for detailed error logs in development mode

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running locally or Atlas connection string is correct
- Check firewall settings for MongoDB Atlas

### Port Already in Use
- Change PORT in .env file
- Kill process using port: `npx kill-port 5000`

### Authentication Errors
- Verify JWT_SECRET is set in .env
- Check token format: `Bearer <token>`

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.
