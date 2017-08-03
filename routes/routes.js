const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/employees', (req, res) => {
  res.render('schedule');
});

router.get('/auditlog', (req, res) => {
  let auditlog = [
    {
      item: 'steak',
      quantity: 45,
      price: 8.99,
      date: new Date().toDateString()
    },
    {
      item: 'banana',
      quantity: 20,
      price: 0.39,
      date: new Date().toDateString()
    },
    {
      item: 'beer',
      quantity: 37,
      price: 10.99,
      date: new Date().toDateString()
    }
  ];
  let data = { auditlog }
  res.render('auditlog', data);
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
});

router.get('/schedule', (req, res) => {
  let employees = [
    {
      name: 'Bob Smith',
      timeIn: new Date().toDateString(),
      timeOut: new Date().toDateString()
    },
    {
      name: 'Joe Collins',
      timeIn: new Date().toDateString(),
      timeOut: new Date().toDateString()
    },
    {
      name: 'Diane James',
      timeIn: new Date().toDateString(),
      timeOut: new Date().toDateString()
    }
  ];
  let data = { employees };
  res.render('schedule', data);
})

module.exports = router;
