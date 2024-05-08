import os
from google.cloud import storage
from google.oauth2 import service_account
import json

# Load credentials from JSON
credentials_dict = json.loads(os.environ['GOOGLE_APPLICATION_CREDENTIALS_JSON'])
credentials = service_account.Credentials.from_service_account_info(credentials_dict)

# Create a client
storage_client = storage.Client(credentials=credentials, project=credentials_dict['project_id'])

# Function to upload a file
def upload_file_to_bucket(blob_name, file_path, bucket_name):
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.upload_from_filename(file_path)
    return blob.public_url
