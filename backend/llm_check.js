const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { SocksProxyAgent } = require('socks-proxy-agent');  // Correct import

const proxyAgent = new SocksProxyAgent('socks5://127.0.0.1:9050');  // SOCKS5 proxy



movie_path={
  "Stranger Things": "Horror/1.jpeg",
  "The Nun": "Horror/2.jpg",
  "Annabelle": "Horror/3.jpg",
  "The Grudge": "Horror/4.jpg",
  "Demonte Colony": "Horror/5.avif",
  "Extraction": "Action/1.jpg",
  "Extraction 2": "Action/2.jpg",
  "Mad Max": "Action/3.jpg",
  "Tomb Raider": "Action/4.jpeg",
  "Journey 2: The Mysterious Island": "Action/5.avif"
}



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
      
     give only the movie name if any movie name is give as input return the movie name similar to that ......no other words.`
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
    console.log(movie_path[answer]);
    return {path:movie_path[answer],movie:answer};
  } catch (error) {
    throw new Error(`Failed to get response: ${error.message}`);
  }
}

async function getinfo(db, query, k = 8) {
  try {
    const docs = db.docs.slice(0, k);
    const docsPageContent = docs.join(' ');

    const prompt = `
      You are an AI assistant for movie selection 
      Answer the following question: ${query}
      by analyzing the contents: ${docsPageContent}
      
     give description of this movie with movie name as starting......in a single paragraph`
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
    console.log(answer);
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
    const response = await getResponse(db, 'i want some movies with good action based......give me a movie img path ');
    console.log(response);
  } catch (error) {
    console.error(error.message);
  }
}


module.exports = {
  createVectorDB,
  chunkDocument,
  getResponse,
  getinfo
};