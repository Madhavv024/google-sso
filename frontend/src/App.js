import './App.css';
import { GoogleLogin } from '@react-oauth/google';
import { useEffect } from 'react';
import { Button } from 'antd';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={() => {      
            fetch('http://localhost:8080/api/v1/', {
              method: 'GET'
            }).then(response => response.json()).then(response => {
              alert('Works!')
            }).catch(error => {
              console.log(error);
            });
          
        }}>Test CORS</Button>

        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
            fetch('http://localhost:8080/api/v1/authenticate', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${credentialResponse.credential}`,
              },
            }).then(response => response.json()).then(response => {              
              alert('Works!')
              console.log(response);
            }).catch(error => {
              console.log(error);
            });
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </header>
    </div>
  );
}

export default App;
