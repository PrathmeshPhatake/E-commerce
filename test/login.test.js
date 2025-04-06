import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from '../../redux/reducers';
import Login from './Login';
import { useLoginMutation } from '../../redux/api/usersApiSlice';
import { setCredentials } from '../../redux/features/auth/authSlice';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('../../redux/api/usersApiSlice', () => ({
  useLoginMutation: jest.fn(() => [jest.fn(), { isLoading: false }]),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe('Login component', () => {
  const store = createStore(rootReducer);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    expect(getByText('Sign In')).toBeInTheDocument();
  });

  it('renders email input field', () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    expect(getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('renders password input field', () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    expect(getByPlaceholderText('Enter password')).toBeInTheDocument();
  });

  it('renders sign in button', () => {
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    expect(getByText('Sign In')).toBeInTheDocument();
  });

  it('calls submitHandler when sign in button is clicked', () => {
    const submitHandler = jest.fn();
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Login submitHandler={submitHandler} />
        </BrowserRouter>
      </Provider>
    );
    const signInButton = getByText('Sign In');
    fireEvent.click(signInButton);
    expect(submitHandler).toHaveBeenCalledTimes(1);
  });

  it('calls login mutation when submitHandler is called', () => {
    const loginMutation = jest.fn();
    useLoginMutation.mockImplementation(() => [loginMutation, { isLoading: false }]);
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    const signInButton = getByText('Sign In');
    fireEvent.click(signInButton);
    expect(loginMutation).toHaveBeenCalledTimes(1);
  });

  it('navigates to redirect URL when login is successful', () => {
    const navigate = jest.fn();
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Login navigate={navigate} />
        </BrowserRouter>
      </Provider>
    );
    const signInButton = getByText('Sign In');
    fireEvent.click(signInButton);
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it('displays error message when login fails', () => {
    const loginMutation = jest.fn(() => Promise.reject({ data: { message: 'Error message' } }));
    useLoginMutation.mockImplementation(() => [loginMutation, { isLoading: false }]);
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    const signInButton = getByText('Sign In');
    fireEvent.click(signInButton);
    expect(toast.error).toHaveBeenCalledTimes(1);
  });
});