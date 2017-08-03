const router = require('express').Router();
const inventory = require('../model/inventory');
const employee = require('../model/employee');
const mongo = require('../mongo');

router.get('/', (req, res) => {

  res.render('index');
});

router.get('/auditlog', (req, res) => {
  inventory.getAll((err, results) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      let data = { inventory: results };
      res.render('auditlog', data);
    }
  })
});

router.get('/currentinventory', (req, res) => {
  inventory.getAll((err, results) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      console.log(results);
      let data = { inventory: results }
      res.render('current', data);
    }
  })
});

router.get('/editEmployee/:id', (req, res) => {
  let id = req.params.id;
  employee.findOne({ _id: mongo.ObjectID(id) }, (err, results) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      console.log(results);
      res.render('addEmployee', results);
    };
  });
});

router.get('/schedule', (req, res) => {
  employee.getAll((err, results) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      console.log(results);
      let data = { employees: results };
      res.render('schedule', data);
    }
  });
});

router.get('/add_item', (req, res) => {
  res.render('add_items');
});

router.get('/addEmployee', (req, res) => {
  res.render('addEmployee');
});

router.get('/edit_item/:id', (req, res) => {
  let id = req.params.id;
  inventory.findOne({ _id: mongo.ObjectID(id) }, (err, results) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      let data = { item: results };
      console.log(data);
      res.render('add_items', data);
    }
  })
})

router.post('/add_item', (req, res) => {
  let item = req.body.item;
  let quantity = req.body.quantity;
  let price = req.body.price;
  let newItem = { item, quantity, price };
  inventory.insert(newItem, (err, result) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      res.redirect('/currentinventory');
    }
  })
});

router.post('/addEmployee', (req, res) => {
  let name = req.body.name;
  let timeIn = req.body.time_in;
  let timeOut = req.body.time_out;
  let newEmployee = { name, timeIn, timeOut };
  employee.insert(newEmployee, (err, result) => {
    if (err) {
      console.log(err, results);
      throw err;
    } else {
      res.redirect('/schedule');
    }
  })
});


module.exports = router;
