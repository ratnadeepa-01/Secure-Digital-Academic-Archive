# Secure Academic Workspace  
(A Role-Based Assignment & Document Management System)

## 📌 Project Overview

Secure Academic Workspace is a role-based web application designed to manage academic assignments and personal document storage.

The system allows:
- Students to submit assignments and store private academic documents.
- Staff to create assignments and evaluate submissions.
- Secure role-based access control using JWT authentication.

This project is built using the MERN stack architecture.

---

## 🚀 Tech Stack

### Frontend (Planned)
- React (Vite)

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose (ODM)

### Authentication
- JWT (JSON Web Tokens)

### File Upload Handling
- Multer (with file size & type validation)

---

## 🏗️ System Architecture

User (Browser)
↓  
React Frontend  
↓ (API Requests with JWT)  
Node.js + Express Backend  
↓  
Middleware Layer  
• JWT Authentication  
• Role-Based Authorization  
• Multer File Validation  
↓  
MongoDB (Data Storage)  
↓  
File System (Uploads)

---

## 👥 User Roles

### 👨‍🎓 Student
- Register / Login
- View assignments
- Submit assignments
- Re-submit if rejected
- View remarks and status
- Upload and manage personal documents

### 👨‍🏫 Staff
- Login
- Create assignments
- Set deadlines
- Review submissions
- Approve or reject with remarks

### 👨‍💼 Admin (Future Scope)
- Manage users and roles

---

## 🗂️ Database Entities

### User
- name
- email
- password
- role (student / staff / admin)

### Assignment
- title
- description
- dueDate
- status
- createdBy (staff reference)

### Submission
- assignmentId
- studentId
- filePath
- version
- status
- remarks

### PersonalDocument
- studentId
- filePath
- uploadedAt

---

## 🔐 Security Features

- JWT-based authentication
- Role-based access control
- Backend file validation (type & size)
- Secure file storage
- Separation of assignment submissions and personal documents

---
