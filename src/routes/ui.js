import { Router } from 'express';
const router = Router();

router.get('/', (_req, res) => {
  res.render('index', {
    title: 'Calculator',
    ops: [
      { value: 'sqrt', label: 'Square Root' },
      { value: 'fact', label: 'Factorial' },
      { value: 'ln', label: 'Logarithm' },
      { value: 'pow', label: 'Power' }
    ]
  });
});

export default router;
