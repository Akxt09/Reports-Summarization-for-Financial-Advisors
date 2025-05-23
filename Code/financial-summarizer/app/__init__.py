import os
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask
from .config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # 1. First create all required directories
    create_required_directories(app)
    
    # 2. Configure logging after directories exist
    configure_logging(app)
    
    # 3. Register blueprints
    from .routes import main_bp
    app.register_blueprint(main_bp)

    app.logger.info("Application initialized successfully")
    return app

def create_required_directories(app):
    """Create all necessary directories first"""
    required_dirs = [
        app.config['UPLOAD_FOLDER'],
        app.config['VECTOR_STORE_DIR'],
        app.config['OUTPUT_DIR'],
        os.path.join(app.instance_path, 'logs')  # Add logs directory
    ]
    
    for directory in required_dirs:
        os.makedirs(directory, exist_ok=True)
        app.logger.debug(f"Created directory: {directory}")

def configure_logging(app):
    """Configure logging after directories exist"""
    # Clear default handlers
    app.logger.handlers.clear()
    
    # Set log level from config
    log_level = getattr(logging, app.config.get('LOG_LEVEL', 'DEBUG'))
    app.logger.setLevel(log_level)

    # Console handler for all environments
    console_handler = logging.StreamHandler()
    console_handler.setLevel(log_level)
    
    # File handler only in production
    if not app.debug:
        log_file = os.path.join(app.instance_path, 'logs', 'app.log')
        file_handler = RotatingFileHandler(
            filename=log_file,
            maxBytes=1024 * 1024 * 10,  # 10MB
            backupCount=10,
            encoding='utf-8'
        )
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s [%(levelname)s] %(name)s: %(message)s [%(pathname)s:%(lineno)d]'
        ))
        app.logger.addHandler(file_handler)

    # Common formatter for all handlers
    formatter = logging.Formatter(
        '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
    )
    console_handler.setFormatter(formatter)
    app.logger.addHandler(console_handler)

    # Suppress noisy library logs
    logging.getLogger('werkzeug').setLevel(logging.WARNING)
    logging.getLogger('PIL').setLevel(logging.WARNING)