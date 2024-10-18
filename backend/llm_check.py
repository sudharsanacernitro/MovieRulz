const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { SocksProxyAgent } = require('socks-proxy-agent');  // Correct import

const proxyAgent = new SocksProxyAgent('socks5://127.0.0.1:9050');  // SOCKS5 proxy

async function createVectorDB(filename) {
  try {
    const filePath = path.join(__dirname, 'llm_dataset', filename);
    const transcript = fs.readFileSync(filePath, 'utf-8');

    const chunkSize = 1000;
    const chunkOverlap = 100;
    const docs = chunkDocument(transcript, chunkSize, chunkOverlap);

    const db = { docs }; // Simplified in-memory storage
    return db;
  } catch (error) {
    throw new Error(`Failed to create vector DB: ${error.message}`);
  }
}

function chunkDocument(text, chunkSize, overlap) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    const chunk = text.substring(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
}

async function getResponse(db, query, k = 8) {
  try {
    const docs = db.docs.slice(0, k);
    const docsPageContent = docs.join(' ');

    const prompt = `
      You are an AI assistant for movie selection based on a person's moods.....give only one movie.
      Answer the following question: ${query}
      by analyzing the contents: ${docsPageContent}
      
      Give the only the name of a most suitable movie.`
    ;

    const response = await axios.post('http://127.0.0.1:11434/api/generate', {
      model: 'llama2',
      prompt: prompt,
      stream: false
    }, {
      httpAgent: proxyAgent,   // Use the SOCKS proxy agent for HTTP requests
      httpsAgent: proxyAgent    // Use the SOCKS proxy agent for HTTPS requests (if applicable)
    });

    const answer = response.data.response.trim();
    return answer;
  } catch (error) {
    throw new Error(`Failed to get response: ${error.message}`);
  }
}


// ==================================================================[ Main function ]========================================================
async function main() {
  try {
    const filename = 'movies_dataset.txt';
    const db = await createVectorDB(filename);
    const response = await getResponse(db, 'i want some movies with good action based......give me a movie......if you know any movie better than this kindly recommend that also.....return the file name that is mentioned in the below of txt file');
    console.log(response);
  } catch (error) {
    console.error(error.message);
  }
}

main();
