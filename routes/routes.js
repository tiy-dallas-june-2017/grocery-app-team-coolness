const router = require('express').Router();
const inventory = require('../model/inventory');
const employee = require('../model/employee');
const mongo = require('../mongo');
const expressValidator = require('express-validator');
const session = require('express-session');

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
  console.log(req.session);
  res.render('add_items', { errorMessage: req.session.errorMessage });
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
      res.render('edit_item', data);
    }
  })
})

router.post('/add_item', (req, res) => {
  let item = req.body.item;
  let quantity = req.body.quantity;
  let price = req.body.price;
  let newItem = { item, quantity, price };
  req.checkBody('item', 'Item entry may only include letters.').notEmpty().isAlpha();
  req.getValidationResult()
  .then(function(result) {
    if (!result.isEmpty()) {
      console.log('result=======================', result.array()[0].msg, '===================');
      req.session.errorMessage = result.array()[0].msg;
      console.log('before redirect', req.session);
      res.render('add_items', { errorMessage: req.session.errorMessage });
    } else {
      req.session.errorMessage = '';
      console.log(result);
      inventory.insert(newItem, (err, result) => {
        if (err) {
          console.log(err);
          throw err;
        } else {
          res.redirect('/currentinventory');
        }
      })
    }
  });
});

router.post('/edit_item/:id', (req, res) => {
  let id = req.params.id;
  let item = req.body.item;
  let quantity = req.body.quantity;
  let price = req.body.price;
  let editedItem = { item, quantity, price };
  req.checkBody('item', 'Item entry may only include letters').notEmpty().isAlpha();
  req.getValidationResult()
  .then(function(result) {
    if (!result.isEmpty()) {
      let errorMessage = result.array()[0].msg;
      let data = { item: editedItem, errorMessage };
      res.render('edit_item', data);
    } else {
      inventory.update(id, editedItem, (err, result) => {
        if (err) {
          console.log('error=====================', err);
          throw err;
        } else {
          console.log('edited item ====================', result, 'end of result==================');
          res.redirect('/currentinventory');
          }
        });
      }
  });
});

router.post('/remove_item/:id', (req, res) => {
  let id = req.params.id;
  let item = req.body.item;
  let quantity = req.body.quantity;
  let price = req.body.price;
  let removedItem = { item, quantity, price };
  inventory.remove(id, (err, result) => {
    if (err) {
      console.log('error====================', err);
      // throw err;
      res.redirect('/');
    } else {
      console.log('edited item ========================', result, 'end of result=====================');
      res.redirect('/currentinventory');
    }
  });
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
