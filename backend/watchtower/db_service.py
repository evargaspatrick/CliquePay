import uuid
from .models import User

class DatabaseService:
    @staticmethod
    def create_user(cognito_id, name, email):
        """
        Create a new user record in the database
        """
        try:
            user = User.objects.create(
                id=str(uuid.uuid4()),
                cognito_id=cognito_id,
                name=name,
                email=email
            )
            return {
                'status': 'SUCCESS',
                'message': 'User created successfully',
                'user_id': user.id
            }
        except Exception as e:
            return {
                'status': 'ERROR',
                'message': str(e)
            }

    @staticmethod
    def get_user_by_cognito_id(cognito_id):
        """
        Retrieve user by Cognito ID
        """
        try:
            user = User.objects.get(cognito_id=cognito_id)
            return {
                'status': 'SUCCESS',
                'user': user
            }
        except User.DoesNotExist:
            return {
                'status': 'ERROR',
                'message': 'User not found'
            }