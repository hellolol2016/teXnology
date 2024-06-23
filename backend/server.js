// import Groq from "groq-sdk";
const Groq = require("groq-sdk");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
var path = require("path");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

const groq = new Groq({
  apiKey: "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",
});

const getGroqResponse = async (messages) => {
  return groq.chat.completions.create({
    messages: messages,
    model: "llama3-8b-8192",
  });
};

app.post("/textToLatex", async (req, res) => {
  //groq stuff
  const user_prompt = req.query.prompt;
  const user_message = {
    role: "user",
    content: user_prompt,
  };

  messages = [system_message, user_message];

  const chat_completion = await getGroqResponse(messages);
  const response = chat_completion.choices[0]?.message?.content || "";
  res.send(response);
});



// ///////////////////////////////////////////////////////
// // speech to Text
// const axios = require('axios');

// // Setup groq client
// const client = axios.create({
//     baseURL: 'https://api.groq.com/v1',
//     headers: {
//         'Authorization': 'Bearer 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'
//     }
// });

// // Create Express app
// app.use(express.json());

// // Create endpoint for Groq API call
// app.post('/textToLatex', async (req, res) => {
//     const user_prompt = req.body.prompt;
//     const user_message = {
//         role: 'user',
//         content: user_prompt
//     };
//     const messages = [system_message, user_message];

//     try {
//         const response = await client.post('/chat/completions', {
//             messages: messages,
//             model: "llama3-8b-8192"
//         });
//         res.json({ response: response.data.choices[0].message.content });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error processing request');
//     }
// });

// // Start the server
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
