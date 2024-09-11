# school-management-system-Express.js

# SchoolPro

SchoolPro is a comprehensive school management system designed to simplify and enhance the administrative processes in educational institutions. This system provides tools for managing students, teachers, classes, subjects, assignments, events, and more, all in one place.

## Features

- **User Management**: Admins, teachers, students, and parents can have their own accounts with specific roles and permissions.
- **Class Management**: Create, update, and manage classes and their schedules.
- **Subject Management**: Assign subjects to classes and track their details.
- **Assignment Tracking**: Create and manage assignments and their submissions.
- **Event Management**: Schedule and manage school events.
- **Attendance Tracking**: Monitor and record student attendance.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/schoolpro.git
   cd schoolpro
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add your environment variables:

   ```env
   MONGODB_URI=your_mongodb_uri
   PORT=3000
   ```

4. **Run the Application**:
   ```bash
   npm start
   ```

## API Endpoints

- **Admin**

  - `POST /admin/register` - Register a new admin.
  - `POST /admin/login` - Log in an admin.

- **Classroom**

  - `POST /classroom` - Create a new classroom.
  - `GET /classroom/:id` - Get details of a specific classroom.
  - `DELETE /classroom/:id` - Delete a specific classroom.
  - `GET /classrooms` - List all classrooms.

- **Event**

  - `POST /event` - Create a new event.
  - `GET /event/:id` - Get details of a specific event.
  - `DELETE /event/:id` - Delete a specific event.
  - `GET /events` - List all events.

- **Assignment**

  - `POST /assignment` - Create a new assignment.
  - `GET /assignment/:id` - Get details of a specific assignment.
  - `DELETE /assignment/:id` - Delete a specific assignment.
  - `GET /assignments` - List all assignments.

- **Parent**
  - `POST /parent` - Add a new parent.
  - `GET /parent/:id` - Get details of a specific parent.
  - `DELETE /parent/:id` - Delete a specific parent.
  - `GET /parents` - List all parents.

## Contributing

We welcome contributions to improve SchoolPro. Please fork the repository and submit pull requests with your proposed changes. For major changes, please open an issue to discuss what you would like to change before submitting a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or support, please contact [bittar.work@gmail.com](mailto:bittar.work@gmail.com).
