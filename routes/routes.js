const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/employees', (req, res) => {
  res.render('schedule');
});

router.get('/auditlog', (req, res) => {
  res.render('auditlog');
});

module.exports = router;
