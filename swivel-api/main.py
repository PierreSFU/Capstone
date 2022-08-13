from dotenv import load_dotenv

# Load environment configuration before any other imports to make it's safe to
# use env variables in any imported package.
load_dotenv()

import os
from flask import Flask
from services.status import StatusService
from services.telemetry import TelemetryService

app = Flask(__name__)
app.register_blueprint(StatusService, url_prefix="/status")
app.register_blueprint(TelemetryService, url_prefix="/telemetry")

if __name__ == "__main__":
    app.run(host=os.environ.get("API_HOST"), port=os.environ.get("API_PORT"))
