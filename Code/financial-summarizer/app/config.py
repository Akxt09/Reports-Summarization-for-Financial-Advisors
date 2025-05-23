import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    UPLOAD_FOLDER = 'instance/uploads'
    VECTOR_STORE_DIR = 'instance/uploads/vector_store'
    OUTPUT_DIR = 'instance/output'
    ALLOWED_EXTENSIONS = {'pdf'}
    LOG_LEVEL = 'DEBUG'  
    LOG_FILE = 'app.log'
    GROUND_TRUTH = [
        {
            "question": "How much revenue did Apple generate from Services in Q2 2023?",
            "answer": "Apple generated $20.9 billion in Services revenue in Q2 2023."
        },
        {
            "question": "Which regions saw a decline in Apple’s revenue in Q2 2023?",
            "answer": "Apple saw revenue decline in the Americas, Europe, and Greater China in Q2 2023."
        },
        {
            "question": "What was Apple's gross margin in Q2 2023?",
            "answer": "Apple reported a gross margin of 44.3% in Q2 2023."
        },
        {
            "question": "What is the name of Apple’s mixed reality headset?",
            "answer": "Apple's mixed reality headset is called Vision Pro."
        },
        {
            "question": "What operating system does Apple Vision Pro use?",
            "answer": "Apple Vision Pro runs on a new operating system called visionOS."
        },
        {
            "question": "What is the launch price of Apple Vision Pro?",
            "answer": "The Apple Vision Pro is priced at $3,499."
        },
        {
            "question": "What chip powers the Apple Vision Pro headset?",
            "answer": "Apple Vision Pro is powered by the M2 chip and a new R1 chip."
        }
    ]