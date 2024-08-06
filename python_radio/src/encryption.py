# encryption.py
from Crypto.Cipher import AES

import os
from dotenv import load_dotenv
from pathlib import Path

# Encryption Key (Must be 16 bytes for AES-128)
dotenv_path = Path('../javascript_ui/.env')
load_dotenv(dotenv_path=dotenv_path)

# Get the AES_KEY from environment variables
AES_KEY_STRING = os.getenv('AES_KEY')
AES_KEY = AES_KEY_STRING.encode("utf-8")

class Encryption:
    def __init__(self):
        self.aes = AES.new(AES_KEY, AES.MODE_ECB)

    def encrypt(self, data):
        return self.aes.encrypt(data)

    def decrypt(self, encrypted_data):
        return self.aes.decrypt(encrypted_data)