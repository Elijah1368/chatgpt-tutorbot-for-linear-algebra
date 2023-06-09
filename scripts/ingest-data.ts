import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { CustomPDFLoader } from '@/utils/customPDFLoader';
import path from 'path';
import {
  PINECONE_INDEX_NAME,
  PINECONE_NAME_SPACE,
  PINECONE_TEST_NAME_SPACE,
} from '@/config/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import * as fs from 'fs/promises';

/* Name of directory to retrieve your files from */
const filePath = 'docs';

export const run = async () => {
  try {
    /*load raw docs from the all files in the directory */
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path) => new CustomPDFLoader(path),
    });

    // const loader = new PDFLoader(filePath);
    let rawDocs = await directoryLoader.load();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    for (let i = 0; i < rawDocs.length; i++) {
      const doc = await textSplitter.splitDocuments([rawDocs[i]]);
      const json = JSON.stringify(Array.from(doc.entries()));

      let directory = path.dirname(rawDocs[i].metadata.source);
      const splitPath = directory.split(path.sep);
      const namespace = 'Linear-Algebra' + splitPath[splitPath.length - 1];

      await fs.writeFile(`${namespace}.json`, json);
      // console.log('namespace: ', namespace);

      //const namespace = path.basename(docs[0].metadata.source);
      console.log('doc count:', doc.length);

      console.log('creating vector store...');
      /*create and store the embeddings in the vectorStore*/
      const embeddings = new OpenAIEmbeddings();
      const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name

      const splitDocs = doc;
      const upsertChunkSize = 50;
      // for (let i = 0; i < splitDocs.length; i += upsertChunkSize) {
      //   const chunk = splitDocs.slice(i, i + upsertChunkSize);
      //   console.log('chunk', i, chunk);
      //   await PineconeStore.fromDocuments(chunk, embeddings, {
      //     pineconeIndex: index,
      //     namespace: PINECONE_TEST_NAME_SPACE,
      //     textKey: 'text',
      //   });
      // }
    }
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();
  console.log('ingestion complete');
})();
