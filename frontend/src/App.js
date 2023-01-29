import './App.css';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from 'antd';

function App() {  
  const aws_token = "eyJraWQiOiI3ZGprRm1BaDFcL1hxd056bnA2VmM5OFNLVFRBb1dXZmZWNU9ZXC9pdUdGNGs9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxNDAxNDdiYi01N2IzLTRlN2MtOWU4Yy03YTVhNWY1ZWJlZWEiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9FbkhKMDhIWk4iLCJjbGllbnRfaWQiOiI2azlpcTJtYm0zbmVrMDNpa29raG9lcmdtayIsIm9yaWdpbl9qdGkiOiJkNGQ3ZjY5Yi0wMjVlLTQyODktOThiOS1mYzZjYjNlNWU5OGUiLCJldmVudF9pZCI6ImViNzY4OTFiLTQ5OTAtNDAzYS1iNDdhLWMwODg1Yzk3ZDIyNyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2NzQ5NTk0MTAsImV4cCI6MTY3NDk2MzAxMCwiaWF0IjoxNjc0OTU5NDEwLCJqdGkiOiI0ODY3ZGVmMC05Y2IzLTRmZmMtYTBkMS0zYmY1MjhiOGRlN2QiLCJ1c2VybmFtZSI6InJhdmkrMTVAZGVjb3ZlcmhxLmNvbSJ9.NPXMXNomIQv2SCcd7Vvc9TMGO3VCuxw-PGg_b5loubJu1GnrVSthr45tgkoo59gImI0dE9NDOKeRorb4fKOjKIBZplXzlPi_v1tUMd6Cbzo0R1-BfR75XIKeE9gydKYr-af3yPfqNp1NxzI9cMwla2rBWMZCAG5bJbx5ywbs4f3A8TkArHnaocMX8TJpYDhROqb35JVlQrRFFLddkNnhplwBvAH7xFOjNhWWXtET1mF72eboQ60GcMjFqwhIMHAc7EkjdM0SvQzxYjg0iPf7LwlkAtbep9H0aXZZ3KYPfk4oBIaoRcEj8rbRuH40VPlTkQJJBzF84XqZjo6-97xqvA";
  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={() => {      
            fetch('http://localhost:8080/api/v1/health', {
              method: 'GET'
            }).then(response => response.json()).then(response => {
              alert('Works!')
            }).catch(error => {
              console.log(error);
            });          
        }}>Test CORS</Button>
        <Button onClick={() => {      
            fetch('http://localhost:8080/api/v1/aws/authenticate', {
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
            fetch('http://localhost:8080/api/v1/sso/authenticate', {
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
      </header>
    </div>
  );
}

export default App;
