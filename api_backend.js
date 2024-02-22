// load API key from env file 
require('dotenv').config();

// importing express framework 
const express = require('express');
// importing body parser for data handling
const bodyParser = require('body-parser');

// importing OpenAI API
const OpenAIApi = require('openai');
// using cross origin resource sharing to allow frontend and backend to communicate
const cors = require('cors');

// intializing a web server with express
const app = express();
const PORT = 3001;

// parse incoming data
app.use(bodyParser.json());

// accessing API with key
const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAIApi({ key: API_KEY });

// Only allow requests from your frontend domain
app.use(cors()); 

// defining a route handle for POST request
app.post('/get-recommendations', async (req, res) => { 
  try {
    //logging request to console and retrieving user input
    console.log(req.body);
    const movies = req.body.movies;

    // generating a string from the user input
    const movieDescriptions = movies.map((movie, index) => 
      `${movie.rating}/5 for ${movie.title}`
    ).join(', ');

    // asking ChatGPT to generate movie recommendations after passing the string to it
    const message = `Given a rating of ${movieDescriptions}, give me 10 movie recommendations I might enjoy, please don't write anything else in your response, just list them out with a line break in between each one`;

    // sending the message to GPT-3.5
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-3.5-turbo",
    });

    // Handling the response from ChatGPT - chaining to avoid errors if user input is incomplete
    const responseContent = chatCompletion.choices && chatCompletion.choices[0]?.message?.content;
    // sending response to client in JSON
    if (responseContent) {
      res.json({ recommendations: responseContent });
    // return an error message if response failed
    } else {
      res.status(500).json({ error: 'Failed to get recommendations' });
    }
    // catching the error and logging it and sending error message to user
  } catch (error) {
    console.error("Error making API call:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// starting the express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
