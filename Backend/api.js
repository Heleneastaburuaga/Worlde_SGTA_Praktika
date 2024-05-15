const { Groq } = require('@langchain/groq');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  apiEndpoint: 'https://api.growcloud.com'
});

groq.get('/v1/your-endpoint', (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(data);
  }
});