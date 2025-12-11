// Importing necessary modules and packages
const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

// Setting up port number
// const PORT = process.env.PORT || 4000;

// Loading environment variables from .env file
dotenv.config();

// Connecting to database
database.connect();
 
// Middlewares
app.use(express.json());
app.use(cookieParser());
// Configure CORS: prefer explicit origins when credentials are enabled
const allowedOrigins = [
	process.env.CLIENT_URL || "https://edu-point-chi.vercel.app",
	process.env.DEPLOYED_CLIENT_URL || "https://edu-point-chi.vercel.app",
	process.env.BACKEND_URL || "https://edupoint-backend.onrender.com",
	"http://localhost:3000",
	"http://localhost:3001",
]

app.use(
	cors({
		origin: function (origin, callback) {
			// allow requests with no origin (like mobile apps or curl)
			if (!origin) return callback(null, true)
			if (allowedOrigins.indexOf(origin) !== -1) {
				callback(null, true)
			} else {
				callback(new Error("Not allowed by CORS"))
			}
		},
		credentials: true,
		optionsSuccessStatus: 200,
	})
)

// Ensure preflight requests are handled for all routes
app.options("*", cors())

// Fallback middleware to always set CORS headers (helps when errors occur before headers are set)
app.use((req, res, next) => {
	const origin = req.headers.origin
	if (origin && allowedOrigins.indexOf(origin) !== -1) {
		res.setHeader("Access-Control-Allow-Origin", origin)
	}
	res.setHeader("Access-Control-Allow-Credentials", "true")
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	)
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
	next()
})
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

// Connecting to cloudinary
cloudinaryConnect();

// Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// Testing the server
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Listening to the server
app.listen(4000, () => {
	console.log(`App is listening at ${4000}`);
});

// End of code.