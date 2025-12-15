🎓 ShikshaMitra Frontend

![alt text](<Screenshot 2025-08-18 215257.png>)

This repository contains the frontend application for the ShikshaMitra e-learning platform.
It provides a responsive UI for course browsing, authentication, payments, and user dashboards.

🚀 Features

Modern & responsive design built with React.js

Authentication pages (login/signup)

![alt text](<Screenshot 2025-08-18 215342.png>)

Interactive student dashboard

Course enrollment & progress tracking

Secure Razorpay payment integration

Email confirmation on successful payment

🛠️ Tech Stack

React.js (Frontend Framework)
![alt text](<Screenshot 2025-08-18 215239.png>)

Redux Toolkit (State Management)

Tailwind CSS (Styling)

Axios (API calls)

Razorpay Checkout.js (Payments)
![alt text](<Screenshot 2025-08-18 215316.png>)

📂 Project Structure
frontend/
│── src/
│   ├── assets/        # Images, icons, logos
│   ├── components/    # Reusable components
│   ├── pages/         # Page-level components
│   ├── slices/        # Redux slices
│   ├── utils/         # Helper functions
│   ├── App.js         # Root component
│── public/
│── .env               # Environment variables
│── package.json       # Dependencies
│── README.md          # Documentation

⚙️ Installation

Clone the repository:

git clone https://github.com/your-username/shikshamitra-frontend.git
cd shikshamitra-frontend


Install dependencies:

npm install


Set up environment variables in .env:

REACT_APP_BASE_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY_ID=your_key_id


Run the development server:

npm start

🔑 Pages
![alt text](<Screenshot 2025-08-18 215357.png>)

Home Page – Landing page with platform overview

Login / Signup – User authentication

Dashboard – Student dashboard to access courses

Courses Page – List & enroll in courses

Payment Page – Secure Razorpay checkout flow

Enrolled Courses – Manage enrolled courses



Here’s a glimpse of the ShikshaMitra frontend:

🔐 Authentication Page

📚 Course Dashboard

💳 Razorpay Payment Flow

✅ Payment Success

🎓 Enrolled Courses

📧 Success Email

👨‍💻 About Me

Hi, I’m the developer of ShikshaMitra 🚀
Passionate about building scalable web apps and integrating secure payment systems.

🤝 Contribution

Fork the repository.

Create a new branch:

git checkout -b feature-name


Commit changes and push:

git commit -m "Added feature X"
git push origin feature-name


Open a Pull Request.

📜 License

This project is licensed under the MIT License.
