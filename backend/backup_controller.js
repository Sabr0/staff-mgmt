'use strict';
const mongoose = require('mongoose');
const Employee = require('./Employee');

const async = require('async');

const getAll = (req, res) => {

  Employee.find({})
    .populate('manager')
    .exec()
    .then(
      employees => {
        res.status(200).json(employees);
      }
    )
    .catch( err => {
      res.status(500).json({error: err});
    });

}


const getCurEmployee = (req, res) => {
  Employee.findById(req.params.id)
    .populate('manager')
    .exec((err, employee) => {
      if (err) {
        res.status(500).json({error: err});
      } else {
        res.status(200).json(employee);
      }
    });
}



const createEmployee = (req, res) => {

  if (req.body.manager) {
    Employee.findById(req.body.manager, (err, manager) => {
      if (err) {
        res.status(500).json({error : err})
      } else {
        let newDR = manager.directReports + 1;
        Employee.findByIdAndUpdate(manager._id, {directReports: newDR}, (err, employee) => {
          if (err) {
            res.status(500).json({error : err})
          } else {
            Employee.create(req.body, (err, employee) => {
              if (err) {
                res.status(500).json({error: err});
              } else {
                getAll(req, res);
              }
            });
          }
        });
      }
    });
  } else {
    Employee.create(req.body, (err, employee) => {
      if (err) {
        res.status(500).json({error: err});
      } else {
        getAll(req, res);
      }
    });
  }


}



const deleteEmployee = (req, res) => {

  /* Cur employee is a manager, need to delete all ref firstly, then delete this manager */
  let newManager = null;
  Employee.updateMany({manager: req.params.id}, {manager: newManager}, err => {
    if (err) {
      res.status(500).json({error: err});
    } else {
      /* delete B:  A --> B --> (E, F) */
      /* Has a manager, update the # of managers' directReports  */
      Employee.findById(req.params.id, (err, employee) => {// find this person
        if (err) {
          res.status(500).json({error: err});
        } else {
          /* Has manager */
          if (employee.manager) {
            Employee.findById(employee.manager, (err, curManager) => { // update this person's manager
              let newDR = curManager.directReports - 1;
              Employee.findByIdAndUpdate(employee.manager, {directReports: newDR}, err => {
                if (err) {
                  res.status(500).json({error : err});
                } else {
                  /* delete this employee */
                  Employee.findByIdAndRemove(req.params.id, err => {
                    if (err) {
                      res.status(500).json({error: err});
                    } else {
                      getAll(req, res);
                    }
                  });
                }
              });
            });
          } else {
            /* delete this employee directly */
            Employee.findByIdAndRemove(req.params.id, err => {
              if (err) {
                res.status(500).json({error: err});
              } else {
                getAll(req, res);
              }
            });
          }

        }
      });
    }
  });

}

const editEmployee = (req, res) => {
  let newManager = req.body.manager;

  Employee.findById(req.params.id, (err, employee) => {
    if (!employee.manager && !newManager) {
      /* no manager && newManger == null*/
      Employee.findByIdAndUpdate(req.params.id, req.body, err => {
        if (err) {
          res.status(500).json({error : err})
        } else {
          getAll(req, res);
        }
      });
    }
    else if (!employee.manager) {
      /* null --> sb of Manager */
      Employee.findById(newManager,  (err, manager) => { // find new Manager
        if (err) {
          res.status(500).json({error : err})
        } else {
          /*
          Have error here, directReports = null
           */
          let newDR = manager.directReports + 1;
          Employee.findByIdAndUpdate(newManager, {directReports: newDR}, (err, employee) => {
            if (err) {
              res.status(500).json({error : err});
            } else {
              Employee.findByIdAndUpdate(req.params.id, req.body, err => {
                if (err) {
                  res.status(500).json({error : err})
                } else {
                  getAll(req, res);
                }
              });
            }
          });
        }
      });
    } else if (newManager === null) {
      /*  sb of Manager --> null */
      Employee.findById(employee.manager,  (err, manager) => {// find pre Manager
        if (err) {
          res.status(500).json({error : err})
        } else {
          let newDR = manager.directReports - 1;
          Employee.findByIdAndUpdate(employee.manager, {directReports: newDR}, (err, employee) => {
            if (err) {
              res.status(500).json({error : err});
            } else {
              Employee.findByIdAndUpdate(req.params.id, req.body, err => {
                if (err) {
                  res.status(500).json({error : err})
                } else {
                  getAll(req, res);
                }
              });
            }
          });
        }
      });
    } else { /*  change manager */

      Employee.findById(employee.manager, (err, preManager) => {
        let preDR = preManager.directReports - 1;
        Employee.findByIdAndUpdate(employee.manager,{directReports: preDR}, err => {
          if (err) {
            res.status(500).json({error : err});
          } else{
            Employee.findById(newManager, (err, curManager) => {
              if (err) {
                res.status(500).json({error : err});
              } else {
                let newDR = curManager.directReports + 1;
                Employee.findByIdAndUpdate(newManager, {directReports: newDR}, err => {
                  if (err) {
                    res.status(500).json({error : err});
                  } else {
                    Employee.findByIdAndUpdate(req.params.id, req.body, err => {
                      if (err) {
                        res.status(500).json({error: err});
                      } else {
                        getAll(req, res);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      });


    }
  });


}


const getCurDirectReport = (req, res) => {

  Employee.find({manager: req.params.id}, (err, dr) => {
    if (err) {
      res.status(500).json({error: err});
    } else {
      res.status(200).json(dr);
    }
  });
}

const getAllDirectReport = (req, res) => {

}



module.exports = {getAll, getCurEmployee, createEmployee, deleteEmployee, editEmployee, getCurDirectReport, getAllDirectReport};

