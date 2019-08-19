import axios from 'axios';

function requestStart() {
  return {
    type: 'REQUEST_CURUSER_START'
  };
}
function requestSuccess(curUser) {
  return {
    type: 'REQUEST_CURUSER_SUCCESS',
    curUser
  };
}
function requestFail(error) {
  return {
    type: 'REQUEST_CURUSER_FAIL',
    error
  };
}

function getEmployeeStart() {
  return {
    type: 'REQUEST_USERS_START'
  };
}

function getEmployeeSuccess(users) {
  return {
    type: 'REQUEST_USERS_SUCCESS',
    users
  };
}

function getEmployeeFail(error) {
  return {
    type: 'REQUEST_USERS_FAIL',
    error
  };
}


export function getCurrentUser(id) {
  return (dispatch, getState) => {
    dispatch(requestStart());
    axios
      .get(`/api/employees/${id}`)
      .then(response => {
        dispatch(requestSuccess(response.data));
      })
      .catch(err => {
        dispatch(requestFail(err.response.statusText));
      });
  };
}


export function editCurrentUser(id, user) {
  return (dispatch, getState) => {
    dispatch(requestStart());
    axios
      .put(`/api/employees/${id}`, user)
      .then(response => {
        dispatch( getEmployeeStart() ) 
        dispatch(getUsers()); 
      })
      .catch(err => {
        dispatch(requestFail(err));
      });
  };
}


export function getUsers() {
  return (dispatch, getState) => {
    dispatch(requestStart());
    axios
      .get('/api/employees')
      .then(response => {
        dispatch(getEmployeeSuccess(response.data));
      })
      .catch(err => {
        dispatch(requestFail(err.response.statusText));
      });
  };
}
