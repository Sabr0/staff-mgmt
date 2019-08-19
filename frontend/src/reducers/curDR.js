const curDR = (
  state = { isLoading: false, error: '', data: [] },
  action
) => {
  switch (action.type) {
    case 'REQUEST_CURDR_START':
      return {
        ...state,
        isLoading: true
      };
    case 'REQUEST_CURDR_SUCCESS':
      return {
        ...state,
        isLoading: false,
        data: action.curDR
      };
    case 'REQUEST_CURDR_FAIL':
      return {
        ...state,
        data: {},
        isLoading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default curDR;
