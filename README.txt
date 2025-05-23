HOW TO RUN THE PROJECT

1. Setup the Environment
   - Make sure you have Python 3.8 or higher installed.
   - Unzip the project folder into your preferred directory.
   - Open a terminal/command prompt and navigate to the extracted project directory.

2. Install Dependencies
   Run the following command:
   pip install -r requirements.txt

3. Configure API Key
   - Open the `.env` file in the project root directory.
   - Add your OpenAI API key:
     OPENAI_API_KEY=your_openai_api_key_here

4. Run the Application
   - Start the Flask server with:
     python run.py
   - Open your browser and go to:
     http://localhost:5000/

5. Use the Interface
   - Upload financial PDF files.
   - Download the generated one-page and two-page summaries.
   - Optionally, evaluate summaries using the provided button to view Relevance, Faithfulness, and Recall scores.

NOTE: For evaluation, only Apple Inc.’s financial report has predefined ground truth data. For others, add relevant Q&A in `config.py`.
