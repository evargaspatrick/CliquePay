from google.cloud import storage
from django.conf import settings
import uuid

class CloudStorageService:
    def __init__(self):
        self.client = storage.Client(credentials=settings.GS_CREDENTIALS,
                                   project=settings.GS_PROJECT_ID)
        self.bucket = self.client.bucket(settings.GS_BUCKET_NAME)

    def upload_profile_picture(self, file, old_url=None):
        """
        Upload a profile picture and return its public URL.
        If old_url exists and is not default, delete it first.
        """
        try:
            # Check if old picture exists and is not default
            if old_url and 'Default_pfp.jpg' not in old_url:
                self.delete_profile_picture(old_url)

            # Create unique filename
            extension = file.name.split('.')[-1]
            filename = f"profile_pictures/{str(uuid.uuid4())}.{extension}"
            
            # Upload file
            blob = self.bucket.blob(filename)
            blob.upload_from_file(file, content_type=file.content_type)
            
            # Make public and return URL
            blob.make_public()
            return blob.public_url
            
        except Exception as e:
            print(f"Error uploading file: {str(e)}")
            return None

    def delete_profile_picture(self, url):
        """Delete a profile picture by its URL"""
        try:
            # Extract filename from URL
            filename = url.split('/')[-1]
            blob = self.bucket.blob(f"profile_pictures/{filename}")
            blob.delete()
            return True
        except Exception as e:
            print(f"Error deleting file: {str(e)}")
            return False
        
    def reset_profile_picture(self, current_url):
        """
        Delete current profile picture and return default picture URL.
        Returns default URL even if deletion fails.
        """
        if current_url and 'Default_pfp.jpg' not in current_url:
            self.delete_profile_picture(current_url)
        return 'https://storage.cloud.google.com/cliquepay_profile_photo_bucket/Default_pfp.jpg'