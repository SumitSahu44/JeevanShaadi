import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RedirectIfLoggedIn() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('userToken') || localStorage.getItem('isLoggedIn')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return null;
}

// Phir <Routes> ke andar ya layout mein add kar dena
<RedirectIfLoggedIn />