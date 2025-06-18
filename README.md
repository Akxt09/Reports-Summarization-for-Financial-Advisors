# Financial Report Summarizer using LLMs

## Overview

This project provides an AI-driven solution to automatically summarize complex financial reports (such as 10-K filings) into clear and concise one-page and two-page Word documents. Built with Retrieval-Augmented Generation (RAG) using LlamaIndex and LangChain, the system allows financial advisors and analysts to save time and extract insights quickly. An intuitive Flask-based UI enables easy document upload, summary generation, and evaluation.

## Features

* **Document Ingestion**: Upload and parse PDFs using LlamaIndex.
* **Vector Indexing**: Store embeddings for fast and semantic search.
* **RAG-based Summarization**: Generate one-page and two-page summaries with prompt-driven summarization using LangChain.
* **Evaluation with RAGAs**: Assess summary quality with Answer Relevance, Faithfulness, and Context Recall.
* **User Interface**: Upload documents, generate/download summaries, and view evaluation metrics via Flask app.

## Project Structure

```
├── document_ingester.py      # PDF loading and FAISS indexing (LlamaIndex)
├── summary_generator.py      # Section-wise summarization and summary formatting
├── RagaEvaluator.py          # Evaluates summary quality with RAGAS
├── run.py                    # Flask app entry point
├── templates/
│   └── index.html            # UI for document upload and controls
├── static/                   # (Optional) Static assets
├── requirements.txt          # Project dependencies
├── .env                      # API keys configuration
```

## Setup Instructions

1. **Extract & Navigate**

   ```bash
   unzip financial-summarizer.zip
   cd financial-summarizer
   ```
2. **Install Dependencies**

   ```bash
   python -m pip install -r requirements.txt
   ```
3. **Configure API Key**
   Create a `.env` file in the root directory:

   ```
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. **Run Application**

   ```bash
   python run.py
   ```

   Visit `http://localhost:5000/` in your browser.

## Usage

* **Upload PDFs**: Add one or more 10-K financial reports.
* **Generate Summary**: Automatically get downloadable one-page and two-page summaries in `.docx` format.
* **Evaluate Quality**: See relevance, faithfulness, and recall scores (only preconfigured for Apple Inc. by default).

## Tech Stack

* **LlamaIndex**: PDF parsing, chunking, and embedding
* **LangChain**: RAG pipeline and prompt orchestration
* **FAISS**: Efficient similarity search
* **Flask**: Web application framework
* **python-docx**: Generate styled Word summaries
* **RAGAS**: Summary evaluation framework
