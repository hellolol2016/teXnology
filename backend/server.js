// import Groq from "groq-sdk";
const Groq = require("groq-sdk");
const express = require("express");
const parser = require("./latex/latex-log-parser");
const fileupload = require("express-fileupload");
const app = express();
var cors = require("cors");
var path = require("path");
var temp = require("temp");
const { Buffer } = require("buffer");

app.use(cors());
app.use(fileupload());
app.use(express.static(path.join(__dirname, "/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

const groq = new Groq({
  apiKey: "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",
});

const system_message = {
  role: "system",
  content: `convert this text to latex. return ONLY the latex code, translating ONLY what the user told you. The following input was gotten 
    from speech to text, so there may be some typos. You can make some minor adjustments as you deem necessary, but don't make any major
    changes to the original. Try to avoid adding parenthesis, brackets, and curly braces on your own, followng what the user explicity 
    states. For example, only add them if they explicity say "open parenthsis" or "closed curly brace". Remember, return ONLY the latex equivalent
    of the input from the user.`,
};

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

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
