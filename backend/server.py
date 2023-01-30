from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from google.oauth2 import id_token
from google.auth.transport import requests
import cognitojwt

REGION = 'us-east-1'
USERPOOL_ID = 'us-east-1_EnHJ08HZN'
APP_CLIENT_ID = '6k9iq2mbm3nek03ikokhoergmk'


# This is a middleware to remove the prefix from the request path.
class RemovePrefixMiddleware(object):
    def __init__(self, app, prefix='/master'):
        self.app = app
        self.prefix = prefix

    def __call__(self, environ, start_response):
        request_uri = environ.get('PATH_INFO', '')
        if request_uri.startswith(self.prefix):
            environ['PATH_INFO'] = request_uri[len(self.prefix):]
        return self.app(environ, start_response)



app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.wsgi_app = RemovePrefixMiddleware(app.wsgi_app)

@app.route('/health')
def health():
    return jsonify({'status': 'ok'})


@app.route('/api/v1/aws/authenticate')
def authenticate_aws():
    aws_bearer_token = request.headers.get('Authorization').split()[1]
    print(f'Bearer token: {aws_bearer_token}')
    try:
        verified_claims: dict = cognitojwt.decode(
            aws_bearer_token,
            REGION,
            USERPOOL_ID,
            app_client_id=APP_CLIENT_ID,  # Optional
            testmode=True  # Disable token expiration check for testing purposes
        )
        print(f'User ID: {verified_claims["sub"]}')
        return jsonify({'status': 'ok', 'userid': verified_claims['sub']})
    except cognitojwt.CognitoJWTException as e:
        print(e)
        return "Authentication failed", 403


# https://developers.google.com/identity/sign-in/web/backend-auth
@app.route('/api/v1/sso/authenticate')
def authenticate_google_sso():
    token = request.headers.get('Authorization').split()[1]
    print(f'Bearer token: {token}')
    client_id = '246380703851-q0oqjngtma7mnmm1p0f5l3po88uik65j.apps.googleusercontent.com'

    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), client_id)

        # Or, if multiple clients access the backend server:
        # idinfo = id_token.verify_oauth2_token(token, requests.Request())
        # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
        #     raise ValueError('Could not verify audience.')

        # If auth request is from a G Suite domain:
        # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
        #     raise ValueError('Wrong hosted domain.')

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        userid = idinfo['sub']
        print(f'User ID: {userid}')
        return jsonify({'status': 'ok', 'userid': userid})
    except ValueError:
        # Invalid token
        return "Authentication failed", 403


@app.route('/api/v1/authenticate')
def index():
    # Extract the bearer token from the request headers
    jwt_token = request.headers.get('Authorization').split()[1]
    # Authenticate the token with the Google SSO server
    print(f'Bearer token: {jwt_token}')
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        client_id = "246380703851-q0oqjngtma7mnmm1p0f5l3po88uik65j.apps.googleusercontent.com"
        id_info = id_token.verify_oauth2_token(jwt_token, requests.Request(), client_id)

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        print(f'Email: {id_info["email"]}')
        user_id = id_info['sub']
        email_id = id_info['email']
        print(f'User ID: {user_id}')
        return user_id, email_id
    except ValueError:
        # Invalid token
        return "Authentication failed", 403


if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=8080)
