/**
 * Change the namespace to the namespace on Pinecone you'd like to store your embeddings.
 */

if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error('Missing Pinecone index name in .env file');
}

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? '';
const PINECONE_TEST_NAME_SPACE = process.env.PINECONE_TEST_NAME_SPACE ?? '';
const PINECONE_NAME_SPACE = 'pdf-test'; //namespace is optional for your vectors

export { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE, PINECONE_TEST_NAME_SPACE };
