import './App.css';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from 'antd';

function App() {
  const aws_token = "eyJraWQiOiI3ZGprRm1BaDFcL1hxd056bnA2VmM5OFNLVFRBb1dXZmZWNU9ZXC9pdUdGNGs9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxNDAxNDdiYi01N2IzLTRlN2MtOWU4Yy03YTVhNWY1ZWJlZWEiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9FbkhKMDhIWk4iLCJjbGllbnRfaWQiOiI2azlpcTJtYm0zbmVrMDNpa29raG9lcmdtayIsIm9yaWdpbl9qdGkiOiJhZDk5ZjU5My1hMGQ2LTQ1MzAtOWNmMy0wMjNhNjdlOTZkYzYiLCJldmVudF9pZCI6ImQwOTczY2VkLWE2ZDQtNGUzOC1iNGYwLWQ1MzljZDgxZTU2OSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2NzUwMjM5NTksImV4cCI6MTY3NTAyNzU1OSwiaWF0IjoxNjc1MDIzOTU5LCJqdGkiOiIxOThjYjMzNy0zM2QyLTQ0NjgtODJmYS01N2RiZGZkYTExYWIiLCJ1c2VybmFtZSI6InJhdmkrMTVAZGVjb3ZlcmhxLmNvbSJ9.hULZCEBRCjF8ApR7aK65dErNuf3CsASjeDK0cHeCisSqpAhUNa3LVz6LHfmOaYVil-RWF7u1eKNESq06Sc0CQI-hrOtQVTbKaefoJzJkdIIoq8y55H9BnbYFhe9dtrRw8jCgaT8JTcn77gEfy5Xwmfwochorj-2IrSpUJhjbocMhC2Aap0FMi9lvPvFaR4BAv-H-IZDnDXzVZcTTOf08mrn_QCZYIDAzCuxoKedoN0jJBRIax3YR1wOESqBcvVW-tnB2j8PZDW67NUzLiTkqaLaoTkW0LYVPEueaYpYvc9j0I92LlMqCdSrnRuiJPuVGqRrfJPngB-x0n18Uvs3Gbw";
  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={() => {      
            fetch('http://localhost:8080/master/health', {
              method: 'GET'
            }).then(response => response.json()).then(response => {
              alert('Works!')
            }).catch(error => {
              console.log(error);
            });          
        }}>Test CORS</Button>
        <Button onClick={() => {      
            fetch('http://localhost:8080/master/api/v1/authenticate', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${aws_token}`,
              },
            }).then(response => response.json()).then(response => {
              alert('Works!');
              console.log(response);
            }).catch(error => {
              console.log(error);
            });
          
        }}>Test AWS Login</Button>
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
            const bearerToken = credentialResponse.credential;
            fetch('http://localhost:8080/master/api/v1/authenticate', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${bearerToken}`,
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
        <Button onClick={() => {
          fetch('http://localhost:8080/master/api/v1/authorizeApplication', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${aws_token}`,
            },
            body: JSON.stringify({
              'exchangeToken': 'exchangeToken',
              'userId': 'userId',
              'emailId': 'emailId',
              'userName': 'userName',
              'dataSource': 'GMAIL',
              'redirectUrl': 'process.env.REACT_APP_OAUTH2_REDIRECT_URL',
              'clientId': 'process.env.REACT_APP_GOOGLE_CLIENT_ID',
              'clientSecret': 'process.env.REACT_APP_GOOGLE_CLIENT_SECRET'
            }),
          }).then(response => response.json()).then(response => {
            alert('Works!');
            console.log(response);
          }).catch(error => {
            console.log(error);
          });
        }}>Test AWS Authorize Application</Button>
      </header>
    </div>
  );
}

export default App;
