import axios from 'axios';

async function benchmarkOllama() {
  const models = ['qwen3:4b', 'llama3:latest'];
  const testPrompt = "List 3 programming languages. Reply in one sentence only.";
  
  for (const model of models) {
    console.log(`\n Testing ${model}...`);
    const start = Date.now();
    
    try {
      const response = await axios.post('http://localhost:11434/api/generate', {
        model: model,
        prompt: testPrompt,
        stream: false,
        options: {
          temperature: 0.1,
          num_predict: 50
        }
      }, { timeout: 60000 });
      
      const duration = ((Date.now() - start) / 1000).toFixed(2);
      console.log(` ${model} completed in ${duration}s`);
      console.log(`Response: ${response.data.response}`);
    } catch (err) {
      console.log(` ${model} failed: ${err.message}`);
    }
  }
}

benchmarkOllama();