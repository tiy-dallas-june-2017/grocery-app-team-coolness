const router = require('express').Router();
// const cookieSession = require('cookie-session');
const inventory = require('../model/inventory');
const employee = require('../model/employee');
const mongo = require('../mongo');
const expressValidator = require('express-validator');
// const session = require('express-session');

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
  console.log('SESSION DATA AFTER RELOAD ================================', req.session);
  console.log(req.session.errorMessage);
  let id = req.params.id;
  employee.findOne({ _id: mongo.ObjectID(id) }, (err, results) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      console.log(results);
      results.errorMessage = req.session.errorMessage;
      results.error = req.session.error;
      res.render('edit_employee', results);
      req.session = null;
    };
  });
});

router.post('/edit_employee/:id', (req, res) => {
  let id = req.params.id;
  req.checkBody('name', 'Please enter a name.').notEmpty();
  req.checkBody('time_in', 'Please enter a valid time for time in.').isInt({min: 0, max: 2399}).isLength({min: 4, max: 4});
  req.checkBody('time_out', 'Please enter a valid time for time out.').isInt({min: 0, max: 2399}).isLength({min: 4, max: 4});
  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      req.session.errorMessage = result.array();
      req.session.error = true;
      console.log('SESSION DATA BEFORE RELOAD==================', req.session);
      res.redirect('/editEmployee/' + id);
    } else {
      let editEmployee = req.body;
      employee.update(id, editEmployee, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/schedule');
        }
      })
    }
  })
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
  if (quantity == 0) {
    req.body.isMissing = true;
  } else {
    req.body.isMissing = false;
  }
  let isMissing = req.body.isMissing;
  let newItem = { item, quantity, price, isMissing };
  req.checkBody('item', 'Item must be filled in.').notEmpty();
  req.checkBody('quantity', 'Quantity must be a number.').isInt();
  req.checkBody('price', 'Price must be a number with no more than two decimal places and include a dollar sign.').isCurrency({ symbol: '$', require_symbol: true });
  req.getValidationResult()
  .then(function(result) {
    if (!result.isEmpty()) {
      req.session.errorMessage = result.array().msg;
      let errorMessage = result.array();
      res.render('add_items', { errorMessage });
    }else {
      req.session.errorMessage = '';
      console.log(result);
      inventory.insert(newItem, (err, result) => {
        if (err) {
          console.log(err);
          throw err;
        }else {
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
  req.checkBody('item', 'Item must be filled in.').notEmpty();
  req.checkBody('quantity', 'Quantity must be a number.').isInt();
  req.checkBody('price', 'Price must be a number with no more than two decimal places and include a dollar sign.').isCurrency({ symbol: '$', require_symbol: true });
  req.getValidationResult()
  .then(function(result) {
    if (!result.isEmpty()) {
      req.session.errorMessage = result.array().msg;
      let errorMessage = result.array();
      res.render('add_items', { errorMessage });
    } else {
      inventory.update(id, editedItem, (err, result) => {
        if (err) {
          console.log(err);
          throw err;
        } else {
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
      console.log(err);
      throw err;
      res.redirect('/');
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

// router.post('/editEmployee', (req, res) => {
//   let name = req.body.name;
//   let timeIn = req.body.time_in;
//   let timeOut = req.body.time_out;
//   let editedEmployee = { name, timeIn, timeOut };
//   employee.insert(newEmployee, (err, result) => {
//     if (err) {
//       console.log(err, results);
//       throw err;
//     } else {
//       res.redirect('/schedule');
//     }
//   })
// });

router.post('/remove_employee/:id', (req, res) => {
  let id = req.params.id;
  let name = req.params.name;
  let timeIn = req.params.time_In;
  let timeOut = req.params.time_Out;
  let removedEmployee = { name, timeIn, timeOut };
  employee.remove(id, (err, result) => {
    if (err) {
      console.log(err);
      throw err;
      res.redirect('/schedule');
    } else {
      res.redirect('/schedule');
    }
  });
});

module.exports = router;
