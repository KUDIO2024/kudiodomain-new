import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as domainRouter } from './routes/domain.js';
import { router as customerRouter } from './routes/customer.js';
import { router as paymentRouter } from './routes/payment.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/domains', domainRouter);
app.use('/api/customers', customerRouter);
app.use('/api/payments', paymentRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});