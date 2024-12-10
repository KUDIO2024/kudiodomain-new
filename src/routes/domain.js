import express from 'express';
import { checkDomainAvailability, registerDomain, registerEmailHosting } from '../services/dreamscape.js';

export const router = express.Router();

router.get('/availability', async (req, res) => {
  try {
    const { domain } = req.query;
    if (!domain) {
      return res.status(400).json({ error: 'Domain name is required' });
    }

    const data = await checkDomainAvailability(domain);
    res.json(data);
  } catch (error) {
    console.error('Domain availability error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { domain, customerId, emailPlan } = req.body;

    // Register domain
    const domainResult = await registerDomain({
      domain_name: domain,
      customer_id: customerId,
      period: 12,
    });

    // If email plan is selected, register email hosting
    if (emailPlan) {
      await registerEmailHosting({
        domain_name: domain,
        customer_id: customerId,
        plan_id: emailPlan,
        period: 12,
      });
    }

    res.json({ status: true });
  } catch (error) {
    console.error('Domain registration error:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message 
    });
  }
});