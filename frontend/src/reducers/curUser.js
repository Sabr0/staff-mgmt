const curUser = (
  state = { isLoading: false, error: '', data: [] },
  action
) => {
  switch (action.type) {
    case 'REQUEST_CURUSER_START':
      return {
        ...state,
        isLoading: true
      };
    case 'REQUEST_CURUSER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        data: action.curUser
      };
    case 'REQUEST_CURUSER_FAIL':
      return {
        ...state,
        isLoading: false,
        error: action.error
      };




    case 'REQUEST_USERS_START':
      return {
        ...state,
        isLoading: true
      };
    case 'REQUEST_USERS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        data: action.users
      };
    case 'REQUEST_USERS_FAIL':
      return {
        ...state,
        isLoading: false,
        error: action.error
      };

    default:
      return state;
  }
};

export default curUser;
