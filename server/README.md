


# 📘 EduPoint – Online Course Platform

An online course platform built with **React**, **Redux**, **Node.js/Express**, and **Razorpay** for secure payments.
Students can browse, purchase, and enroll in courses with a smooth learning experience.

---

## ✨ Features

* 🔐 **User Authentication** – Login/Signup with JWT
* 🎓 **Course Management** – Browse, enroll, and manage courses
* 💳 **Secure Payments** – Razorpay integration for course purchases
* 📧 **Email Notifications** – Confirmation emails on successful payments
* 🛒 **Cart System** – Add/remove courses before checkout
* 📊 **Dashboard** – View enrolled courses and track progress

---

## 🛠️ Tech Stack

**Frontend**

* React
* Redux Toolkit
* TailwindCSS
* React Hot Toast (notifications)

**Backend**

* Node.js
* Express.js
* MongoDB (Mongoose)

**Payments**

* Razorpay

---

## ⚙️ Installation & Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies

**Frontend**

```bash
cd client
npm install
```

**Backend**

```bash
cd server
npm install
```

### 3. Setup environment variables

#### For **Backend** (`server/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### For **Frontend**

* If using **Create React App** → `client/.env`

```env
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

* If using **Vite** → `client/.env`

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 4. Run the app

**Backend**

```bash
cd server
npm run dev
```

**Frontend**

```bash
cd client
npm start   # or npm run dev (if Vite)
```

---

## 📦 Project Structure

```
.
├── client/               # React frontend
│   ├── src/
│   │   ├── apis/
│   │   ├── slices/
│   │   ├── components/
│   │   └── pages/
│   └── .env
├── server/               # Express backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── .env
└── README.md
```

---

## 🚀 Deployment

* Frontend → Vercel / Netlify
* Backend → Render / Railway / Heroku
* Database → MongoDB Atlas

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.




