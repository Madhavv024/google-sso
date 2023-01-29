from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from google.oauth2 import id_token
from google.auth.transport import requests
import cognitojwt

REGION = 'us-east-1'
USERPOOL_ID = 'us-east-1_EnHJ08HZN'
APP_CLIENT_ID = '6k9iq2mbm3nek03ikokhoergmk'

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


@app.route('/api/v1/health')
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

    # Authenticate the token with the Google SSO server
    url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token
    r = requests.get(url)
    print(f'Google SSO server response: {r}')
    if r.status_code != 200:
        return "Authentication failed", 403
    else:
        return "Authentication successful", 200


if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=8080)
