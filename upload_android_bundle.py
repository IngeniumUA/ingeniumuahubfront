from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2 import service_account

# Path to your service account key JSON file
SERVICE_ACCOUNT_FILE = './ingeniumuahub-play-console.json'

# Package name of your app
PACKAGE_NAME = 'development.com.app.ingeniumua'

# Path to the app bundle file
APP_BUNDLE_PATH = './android/app/build/outputs/bundle/release/app-release-signed.aab'

# Authenticate with the service account
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE,
    scopes=['https://www.googleapis.com/auth/androidpublisher']
)

# Create the API client
service = build('androidpublisher', 'v3', credentials=credentials)

# Start an edit session
edit_request = service.edits().insert(body={}, packageName=PACKAGE_NAME)
edit_response = edit_request.execute()
edit_id = edit_response['id']

# Upload the app bundle
bundle_request = service.edits().bundles().upload(
    editId=edit_id,
    packageName=PACKAGE_NAME,
    media_body=MediaFileUpload(APP_BUNDLE_PATH, mimetype='application/octet-stream')
)
bundle_response = bundle_request.execute()

# Commit the changes
commit_request = service.edits().commit(editId=edit_id, packageName=PACKAGE_NAME)
commit_response = commit_request.execute()
