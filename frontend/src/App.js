import './App.css';
import { GoogleLogin } from '@react-oauth/google';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
            fetch('http://localhost:8080/api/v1/authenticate', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${credentialResponse.credential}`,
                
              },
            }).then(response => {
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
