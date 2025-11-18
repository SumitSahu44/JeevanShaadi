# JeevanShaadi Backend

## Admin Authentication

The admin system uses environment-based authentication for simplicity and security. Admin credentials are stored in the .env file and there is no need for a database-stored admin account.

### Environment Variables

Required variables for admin authentication:
- `ADMIN_EMAIL`: The email address for admin login
- `ADMIN_PASSWORD`: The password for admin login
- `JWT_SECRET`: Secret key for JWT token generation

Example `.env` configuration:
```
ADMIN_EMAIL=admin@jeevanjodimatrimonial.com
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret
```

### Admin API Endpoints

- POST `/admin/login`: Admin login endpoint
  - Requires email and password in request body
  - Returns JWT token on successful authentication

Protected routes (require valid JWT token):
- GET `/admin/dashboard/stats`: Get dashboard statistics
- GET `/admin/users`: Get all users
- PATCH `/admin/users/:userId/status`: Update user status
- DELETE `/admin/users/:userId`: Delete a user

### Security Notes

1. The admin credentials in .env should be kept secure and never committed to version control
2. The JWT token expiry is set to 24 hours
3. All protected routes verify both the JWT token and admin email
4. Failed login attempts return generic error messages to prevent email enumeration