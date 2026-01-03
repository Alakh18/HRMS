# HRMS - Human Resource Management System

A comprehensive full-stack Human Resource Management System built with React, Node.js, Express, and MySQL.

## Features

- **Authentication & Authorization**
  - Secure JWT-based authentication
  - Role-based access control (Admin/HR, Employee)
  - Password validation and hashing

- **Employee Management**
  - Employee profiles with personal and job details
  - Role-based profile editing permissions
  - Employee listing and management (Admin/HR)

- **Attendance Tracking**
  - Daily check-in/check-out functionality
  - Attendance records with status tracking
  - Daily and weekly views
  - Admin overview of all employees

- **Leave Management**
  - Multiple leave types (Paid, Sick, Unpaid, Personal, Emergency)
  - Leave request submission and tracking
  - Approval/rejection workflow (Admin/HR)
  - Automatic attendance integration

- **Payroll Management**
  - Salary structure management
  - Payroll generation and tracking
  - Employee read-only access
  - Admin full control

- **Notifications**
  - In-app notifications system
  - Real-time alerts for leave approvals, attendance, etc.
  - Notification management

- **Dashboard**
  - Employee dashboard with quick access cards
  - Admin/HR dashboard with statistics and overview
  - Recent activity and alerts

## Tech Stack

### Frontend
- React 18
- React Router
- Axios
- Context API
- Pure CSS (no frameworks)
- Vite

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs
- MySQL2

### Database
- MySQL with proper relationships, indexes, and foreign keys

## Project Structure

```
HRMS/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── employeeController.js
│   │   │   ├── attendanceController.js
│   │   │   ├── leaveController.js
│   │   │   ├── payrollController.js
│   │   │   └── notificationController.js
│   │   ├── middlewares/
│   │   │   ├── auth.js
│   │   │   └── validation.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Employee.js
│   │   │   ├── Attendance.js
│   │   │   ├── LeaveRequest.js
│   │   │   ├── Payroll.js
│   │   │   ├── SalaryStructure.js
│   │   │   └── Notification.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── employeeRoutes.js
│   │   │   ├── attendanceRoutes.js
│   │   │   ├── leaveRoutes.js
│   │   │   ├── payrollRoutes.js
│   │   │   └── notificationRoutes.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── Leave.jsx
│   │   │   ├── Payroll.jsx
│   │   │   └── Notifications.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── employeeService.js
│   │   │   ├── attendanceService.js
│   │   │   ├── leaveService.js
│   │   │   ├── payrollService.js
│   │   │   └── notificationService.js
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── Layout.css
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Profile.css
│   │   │   ├── Attendance.css
│   │   │   ├── Leave.css
│   │   │   ├── Payroll.css
│   │   │   └── Notifications.css
│   │   ├── utils/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── formatDate.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── database/
│   └── schema.sql
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE hrms_db;
```

2. Run the schema file:
```bash
mysql -u root -p hrms_db < database/schema.sql
```

Or import the schema file through MySQL Workbench or phpMyAdmin.

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hrms_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

### Sign Up
1. Navigate to the sign-up page
2. Enter Employee ID, Email, Password, and select Role
3. Password must be at least 6 characters with uppercase, lowercase, and number
4. Click "Sign Up"

### Sign In
1. Navigate to the sign-in page
2. Enter email and password
3. Click "Sign In"
4. You'll be redirected to the appropriate dashboard based on your role

### Employee Features
- View and edit profile (limited fields)
- Check in/out for attendance
- View attendance records
- Apply for leave
- View payroll and salary information
- View notifications

### Admin/HR Features
- All employee features
- View and manage all employees
- View all attendance records
- Approve/reject leave requests
- Manage payroll for all employees
- Update salary structures
- Full access to all system features

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Sign up
- `POST /api/auth/signin` - Sign in
- `GET /api/auth/profile` - Get current user profile

### Employees
- `GET /api/employees` - Get all employees (Admin/HR)
- `GET /api/employees/me` - Get current employee profile
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/me` - Update own profile
- `PUT /api/employees/:id` - Update employee (Admin/HR)
- `POST /api/employees` - Create employee (Admin/HR)

### Attendance
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/me` - Get own attendance
- `GET /api/attendance/me/today` - Get today's attendance
- `GET /api/attendance` - Get all attendance (Admin/HR)

### Leave
- `POST /api/leave` - Create leave request
- `GET /api/leave/me` - Get own leave requests
- `GET /api/leave` - Get all leave requests (Admin/HR)
- `GET /api/leave/:id` - Get leave request by ID
- `PUT /api/leave/:id/status` - Update leave status (Admin/HR)
- `DELETE /api/leave/me/:id` - Delete leave request

### Payroll
- `GET /api/payroll/me` - Get own payroll
- `GET /api/payroll` - Get all payroll (Admin/HR)
- `GET /api/payroll/employee/:id` - Get employee payroll
- `POST /api/payroll` - Create payroll (Admin/HR)
- `PUT /api/payroll/:id` - Update payroll (Admin/HR)
- `GET /api/payroll/me/salary-structure` - Get salary structure
- `PUT /api/payroll/salary-structure/:id` - Update salary structure (Admin/HR)

### Notifications
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- SQL injection prevention (parameterized queries)
- CORS configuration

## Notes

- This is a production-ready structure but should be enhanced with:
  - Environment-specific configurations
  - Logging system
  - Error tracking
  - API rate limiting
  - File upload functionality for documents
  - Email notifications
  - More comprehensive testing

## License

This project is provided as-is for educational and development purposes.

