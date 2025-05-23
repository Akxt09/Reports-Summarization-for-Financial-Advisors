import os
import logging
from .document_ingester import DocumentIngester
from .summary_generator import SummaryGenerator

logger = logging.getLogger(__name__)

class FinancialDocumentProcessor:
    def __init__(self, input_dir: str, output_dir: str, openai_api_key: str):
        if not os.path.exists(input_dir):
            raise ValueError(f"Input directory {input_dir} not found")
        self.input_dir = input_dir
        self.output_dir = output_dir
        self.vector_dir = os.path.join(input_dir, "vector_store")
        self.openai_api_key = openai_api_key

        # Ensure vector store directory exists
        os.makedirs(self.vector_dir, exist_ok=True)

        self.document_ingester = DocumentIngester(
            input_dir=self.input_dir,
            vector_dir=self.vector_dir
        )
        self.index = None
        self.summary_generator = None

    def process_documents(self) -> bool:
        """Process existing PDFs in input folder"""
        try:
            # Load and index documents
            documents = self.document_ingester.load_documents()
            self.index = self.document_ingester.create_index(documents)

            # Generate summaries
            self.summary_generator = SummaryGenerator(
                self.index,
                self.output_dir,
                self.openai_api_key
            )

            two_page = self.summary_generator.generate_two_page_summary()
            self.summary_generator.generate_one_page_summary(two_page)

            return True

        except Exception as e:
            logger.error(f"Processing failed: {str(e)}")
            return False