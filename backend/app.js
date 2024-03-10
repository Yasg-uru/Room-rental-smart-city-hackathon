import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";
import reviewRouter from "./routes/review.routes.js";
import bookingRouter from "./routes/booking.routes.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/user", userRouter);
app.use("/property", propertyRouter);
app.use("/review", reviewRouter);
app.use("/book", bookingRouter);
export default app;
