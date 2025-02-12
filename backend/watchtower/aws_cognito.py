import boto3
import jwt 
import hmac
import hashlib
import base64
from botocore.exceptions import ClientError
from django.conf import settings

class CognitoService:
    def __init__(self):
        self.client = boto3.client(
            'cognito-idp',
            region_name=settings.COGNITO_AWS_REGION
        )
        self.client_id = settings.COGNITO_APP_CLIENT_ID
        self.client_secret = settings.COGNITO_APP_CLIENT_SECRET
        print(settings.COGNITO_AWS_REGION)
    def get_secret_hash(self, username):
        message = username + self.client_id
        dig = hmac.new(
            str(self.client_secret).encode('utf-8'),
            msg=str(message).encode('utf-8'),
            digestmod=hashlib.sha256
        ).digest()
        return base64.b64encode(dig).decode()

    def register_user(self, username, password, email, phone_number=None):
        try:
            username_check = self.check_username_exists(username)
            if username_check['exists']:
                return username_check
                
            user_attributes = [
                {
                    'Name': 'email',
                    'Value': email
                }
                # Uncomment for testing
                # {
                #     'Name': 'email_verified',
                #     'Value': 'true'
                # }
            ]

            if phone_number:
                user_attributes.append({
                    'Name': 'phone_number',
                    'Value': phone_number
                })

            params = {
                'ClientId': self.client_id,
                'Username': username,
                'Password': password,
                'UserAttributes': user_attributes
            }

            if self.client_secret:
                params['SecretHash'] = self.get_secret_hash(username)

            response = self.client.sign_up(**params)
            
            return {
                'status': 'SUCCESS',
                'user_sub': response['UserSub'],
                'message': 'User registration successful'
            }

        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']
            
            return {
                'status': 'ERROR',
                'error_code': error_code,
                'message': error_message
            }

    def confirm_sign_up(self, username, confirmation_code):
        try:
            params = {
                'ClientId': self.client_id,
                'Username': username,
                'ConfirmationCode': confirmation_code
            }

            if hasattr(settings, 'COGNITO_APP_CLIENT_SECRET'):
                params['SecretHash'] = self.get_secret_hash(username)

            self.client.confirm_sign_up(**params)
            
            return {
                'status': 'SUCCESS',
                'message': 'Email verification successful'
            }

        except ClientError as e:
            return {
                'status': 'ERROR',
                'error_code': e.response['Error']['Code'],
                'message': e.response['Error']['Message']
            }
        
    def check_username_exists(self, username):
        try:
            params = {
                'UserPoolId': settings.COGNITO_USER_POOL_ID,
                'Filter': f'username = "{username}"',
            }
            
            response = self.client.list_users(**params)
            
            # If any users are found with this username
            if response.get('Users', []):
                return {
                    'status': 'ERROR',
                    'exists': True,
                    'message': 'Username already exists'
                }
            
            return {
                'status': 'SUCCESS',
                'exists': False,
                'message': 'Username is available'
            }

        except ClientError as e:
            return {
                'status': 'ERROR',
                'error_code': e.response['Error']['Code'],
                'message': e.response['Error']['Message']
            }
    def login_user(self, username, password):
        try:
            params = {
                'USERNAME': username,
                'PASSWORD': password,
            }
            
            if self.client_secret:
                params['SECRET_HASH'] = self.get_secret_hash(username)

            response = self.client.initiate_auth(
                AuthFlow='USER_PASSWORD_AUTH',
                AuthParameters=params,
                ClientId=self.client_id
            )
            return{
                'status': 'SUCCESS',
                'message': 'Login successful',
                'access_token': response['AuthenticationResult']['AccessToken'],
                'refresh_token': response['AuthenticationResult']['RefreshToken'],
                'id_token': response['AuthenticationResult']['IdToken']
            }
        except ClientError as e:
            return {
                'status': 'ERROR',
                'error_code': e.response['Error']['Code'],
                'message': e.response['Error']['Message']
            }

    def renew_tokens(self, refresh_token):
        """
        Renew access and ID tokens using a refresh token
        
        Args:
            refresh_token (str): The refresh token from previous authentication
            
        Returns:
            dict: New tokens or error message
        """
        try:
            # Decode the refresh token to get the username
            decoded_token = jwt.decode(refresh_token, options={"verify_signature": False})
            username = decoded_token.get('username')

            if not username:
                return {
                    'status': 'ERROR',
                    'message': 'Could not extract username from refresh token'
                }

            params = {
                'ClientId': self.client_id,
                'AuthFlow': 'REFRESH_TOKEN_AUTH',
                'AuthParameters': {
                    'REFRESH_TOKEN': refresh_token
                }
            }

            if self.client_secret:
                params['AuthParameters']['SECRET_HASH'] = self.get_secret_hash(username)

            response = self.client.initiate_auth(**params)
            
            if 'AuthenticationResult' in response:
                return {
                    'status': 'SUCCESS',
                    'message': 'Tokens renewed successfully',
                    'access_token': response['AuthenticationResult'].get('AccessToken'),
                    'id_token': response['AuthenticationResult'].get('IdToken'),
                    'expires_in': response['AuthenticationResult'].get('ExpiresIn', 3600)
                }
            
            return {
                'status': 'ERROR',
                'message': 'Failed to renew tokens'
            }

        except jwt.InvalidTokenError:
            return {
                'status': 'ERROR',
                'message': 'Invalid refresh token format'
            }
        except self.client.exceptions.NotAuthorizedException:
            return {
                'status': 'ERROR',
                'message': 'Refresh token has expired or is invalid'
            }
        except Exception as e:
            return {
                'status': 'ERROR',
                'message': str(e)
            }
