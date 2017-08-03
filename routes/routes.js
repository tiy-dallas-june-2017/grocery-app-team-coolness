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

router.get('/currentinventory', (req, res) => {
  let inventory = [
    {
      item: 'steak',
      quantity: 45,
      price: 8.99
    },
    {
      item: 'banana',
      quantity: 20,
      price: 0.39
    },
    {
      item: 'beer',
      quantity: 37,
      price: 10.99
    }
  ];
  let data = { inventory }
  res.render('current', data);
})

module.exports = router;
