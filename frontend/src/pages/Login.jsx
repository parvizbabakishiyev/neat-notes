import { useLocation } from 'react-router-dom';
import LoginForm from '../features/auth/LoginForm';

export default function Login() {
  const { state } = useLocation();

  return <LoginForm loginMessage={state?.loginMessage} />;
}
