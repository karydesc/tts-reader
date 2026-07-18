from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager


def create_app():
    app = Flask(__name__)

    # explicit cors configuration
    CORS(app, resources={r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }})

    app.config['JWT_SECRET_KEY'] = 'mysecretkey'
    jwt = JWTManager(app)

    from app.routes.generate import tts_bp
    app.register_blueprint(tts_bp)

    return app