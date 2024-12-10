import express from 'express';
import { registerCustomer } from '../services/dreamscape.js';

export const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const customerData = {
      ...req.body,
      country: 'GB',
      account_type: 'personal',
    };

    const result = await registerCustomer(customerData);
    res.json(result);
  } catch (error) {
    console.error('Customer registration error:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message 
    });
  }
});