import axios from 'axios';

function requestStart() {
  return {
    type: 'REQUEST_CURDR_START'
  };
}
function requestSuccess(curDR) {
  return {
    type: 'REQUEST_CURDR_SUCCESS',
    curDR
  };
}
function requestFail(error) {
  return {
    type: 'REQUEST_CURDR_FAIL',
    error
  };
}



export function getCurrentDR(id) {
  return (dispatch, getState) => {
    dispatch(requestStart());
    axios
      .get(`/api/dr/${id}`)
      .then(response => {
        dispatch(requestSuccess(response.data));
      })
      .catch(err => {
        dispatch(requestFail(err.response.statusText));
      });
  };
}