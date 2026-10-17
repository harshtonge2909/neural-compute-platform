"""
Configuration Management for NCA Platform.
Handles reading and writing persistent settings to JSON with schema validation.
"""
import os
import json
from pathlib import Path
from backend.app.models.schemas import AppSettings

# Directory paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = DATA_DIR / "models"
SETTINGS_FILE = DATA_DIR / "settings.json"

# Ensure directories exist
DATA_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)

class SettingsManager:
    _instance = None
    _settings: AppSettings

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SettingsManager, cls).__new__(cls)
            cls._instance._load_settings()
        return cls._instance

    def _load_settings(self):
        if SETTINGS_FILE.exists():
            try:
                with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self._settings = AppSettings(**data)
                    return
            except Exception as e:
                print(f"[SettingsManager] Error loading {SETTINGS_FILE}: {e}. Using defaults.")
        
        self._settings = AppSettings()
        self.save_settings(self._settings)

    def get_settings(self) -> AppSettings:
        return self._settings

    def save_settings(self, new_settings: AppSettings) -> AppSettings:
        self._settings = new_settings
        try:
            with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
                json.dump(self._settings.model_dump(), f, indent=2)
        except Exception as e:
            print(f"[SettingsManager] Failed to persist settings: {e}")
        return self._settings

settings_manager = SettingsManager()
