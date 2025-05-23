import os
import logging
from typing import List
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    Settings
)
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.vector_stores.faiss import FaissVectorStore
from llama_index.core.node_parser import SimpleNodeParser
import faiss

logger = logging.getLogger(__name__)

class DocumentIngester:
    def __init__(self, input_dir: str, vector_dir: str,
                 embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.input_dir = input_dir
        self.vector_dir = vector_dir
        self.embedding_model = embedding_model
        self.index = None
        self.doc_count = 0
        self.node_count = 0

        # Configure global settings
        Settings.embed_model = HuggingFaceEmbedding(model_name=self.embedding_model)
        Settings.chunk_size = 512
        Settings.chunk_overlap = 50

    def load_documents(self) -> List:
        """Load PDFs from existing input directory"""
        logger.info(f"Loading documents from {self.input_dir}")
        try:
            # Validate input directory exists
            if not os.path.exists(self.input_dir):
                raise FileNotFoundError(f"Directory {self.input_dir} not found")

            documents = SimpleDirectoryReader(self.input_dir).load_data()
            self.doc_count = len(documents)
            logger.info(f"Loaded {self.doc_count} documents")
            return documents
        except Exception as e:
            logger.error(f"Document loading failed: {str(e)}")
            raise

    def create_index(self, documents: List) -> VectorStoreIndex:
        """Create FAISS index from documents"""
        logger.info("Creating FAISS index")
        try:
            # Get embedding dimension from model
            dimension =   384

            # Create vector store
            faiss_index = faiss.IndexHNSWFlat(dimension, 32)
            vector_store = FaissVectorStore(faiss_index=faiss_index)

            # Parse and index documents
            node_parser = SimpleNodeParser.from_defaults(
                chunk_size=512,
                chunk_overlap=50
            )
            nodes = node_parser.get_nodes_from_documents(documents)

            # Create and persist index
            index = VectorStoreIndex(
                nodes,
                vector_store=vector_store,
                show_progress=True
            )
            index.storage_context.persist(persist_dir=self.vector_dir)
            
            self.node_count = len(index.docstore.docs)
            logger.info(f"Created index with {self.node_count} nodes")
            return index

        except Exception as e:
            logger.error(f"Index creation failed: {str(e)}")
            # Cleanup failed index
            if os.path.exists(self.vector_dir):
                import shutil
                shutil.rmtree(self.vector_dir)
            raise