import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

// Initial state for user login
const userLoginInitialState = {
  userInfo: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
};

// User login reducer
const userLoginReducer = (state = userLoginInitialState, action) => {
  switch (action.type) {
    case 'USER_LOGIN_REQUEST':
      return { loading: true };
    case 'USER_LOGIN_SUCCESS':
      return { loading: false, userInfo: action.payload };
    case 'USER_LOGIN_FAIL':
      return { loading: false, error: action.payload };
    case 'USER_LOGOUT':
      return {};
    default:
      return state;
  }
};

// Combine all reducers
const reducer = combineReducers({
  userLogin: userLoginReducer,
});

// Create store with middleware
const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;