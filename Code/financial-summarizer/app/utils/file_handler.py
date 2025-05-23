# app/utils/file_handler.py
import os
import logging
from werkzeug.utils import secure_filename
from typing import List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class FileHandler:
    """Secure file handler without workspace clearance"""
    
    def __init__(self, 
                 upload_folder: str = "uploads",
                 allowed_extensions: Optional[List[str]] = None,
                 max_file_size: int = 50 * 1024 * 1024):
        self.upload_folder = upload_folder
        self.allowed_extensions = allowed_extensions or ['pdf']
        self.max_file_size = max_file_size
        self._ensure_directory_exists(upload_folder)

    def _ensure_directory_exists(self, path: str) -> None:
        """Create directory if missing"""
        os.makedirs(path, exist_ok=True)

    def save_uploaded_files(self, files: List) -> List[str]:
        """Secure file saving without cleanup"""
        saved_paths = []
        for file in files:
            if not file or file.filename == '':
                continue
            try:
                filename = secure_filename(file.filename)
                if not self._is_valid_file(file, filename):
                    continue
                save_path = self._get_unique_path(filename)
                file.save(save_path)
                saved_paths.append(save_path)
                logger.info(f"Saved: {save_path}")
            except Exception as e:
                logger.error(f"Failed to save {filename}: {str(e)}")
        return saved_paths

    # Keep the validation methods unchanged
    def _is_valid_file(self, file, filename: str) -> bool:
        return all([
            self._allowed_filename(filename),
            self._within_size_limit(file),
            not self._is_executable(filename)
        ])

    def _allowed_filename(self, filename: str) -> bool:
        return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in self.allowed_extensions

    def _within_size_limit(self, file) -> bool:
        file.seek(0, os.SEEK_END)
        size = file.tell()
        file.seek(0)
        return size <= self.max_file_size

    def _is_executable(self, filename: str) -> bool:
        forbidden_extensions = ['exe', 'bat', 'sh', 'dll', 'js']
        return filename.rsplit('.', 1)[1].lower() in forbidden_extensions

    def _get_unique_path(self, filename: str) -> str:
        base, ext = os.path.splitext(filename)
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        return os.path.join(self.upload_folder, f"{base}_{timestamp}{ext}")

    def validate_filename(self, filename: str) -> bool:
        safe_filename = secure_filename(filename)
        path = os.path.join(self.upload_folder, safe_filename)
        return os.path.isfile(path) and safe_filename == filename