import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import indexRouter from './routes/index.js';
import alumniRouter from './routes/alumni.js';
import exStudentRouter from './routes/exStudent.js';
import downloadExcelRouter from './routes/downloadExcel.js';
import downloadAlumni from './routes/downloadAlumni.js'

dotenv.config();
console.log('MONGODB_URI:', process.env.MONGODB_URI);
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// Use the route files
app.use('/', indexRouter);
app.use('/alumni', alumniRouter);
app.use('/ex-student', exStudentRouter);
app.use('/download-excel', downloadExcelRouter);
app.use("/download-alumni", downloadAlumni);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
