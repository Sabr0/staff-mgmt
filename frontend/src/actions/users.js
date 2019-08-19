import axios from 'axios';

function requestStart() {
  return {
    type: 'REQUEST_USERS_START'
  };
}
function requestSuccess(users) {
  return {
    type: 'REQUEST_USERS_SUCCESS',
    users
  };
}
function requestFail(error) {
  return {
    type: 'REQUEST_USERS_FAIL',
    error
  };
}

export function getUsers() {
  return (dispatch, getState) => {
    dispatch(requestStart());
    axios
      .get('/api/employees')
      .then(response => {
        dispatch(requestSuccess(response.data));
      })
      .catch(err => {
        dispatch(requestFail(err.response.statusText));
      });
  };
}


export function addUser(user) {
  return (dispatch, getState) => {
    dispatch(requestStart());
    axios({
      method:'post',
      url: '/api/employees',
      data: user
    })
      .then(response => {
        dispatch(requestSuccess(response.data));
      })
      .catch(err => {
        dispatch(requestFail(err.response.statusText));
      });
  };
}

export function deleteUser(id) {
  return (dispatch, getState) => {
    dispatch(requestStart());
    axios
      .delete(`/api/employees/${id}`)
      .then(response => {
        dispatch(requestSuccess(response.data));
      })
      .catch(err => {
        dispatch(requestFail(err.response.statusText));
      });
  };
}


