import { config } from "dotenv";
//import { ChatPromptTemplate } from "@langchain/core/prompts";
//import { FewShotChatMessagePromptTemplate } from "langchain/prompts";

import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { HumanMessage, AIMessage } from "langchain/schema";
import { ChatGroq } from "@langchain/groq";
import { ConversationChain } from "langchain/chains";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";

config({path:"../../.env"});


const model = new ChatGroq({
  temperature: 0,
  model: "llama3-70b-8192",
  verbose: true
});

const pastMessages = [
  new HumanMessage("Guess the word: _ _ _ _ _"),
  new AIMessage({"guess": "apple"}),
];

const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
     `Game goal is to guess a 5-letter word. Each guess will be marked with colors: 
      Green for correct letter in correct position, yellow for correct letter in wrong position, and gray for incorrect letter.
      Best guess in example format?`
    ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{/^[a-z]{5}$/i}"),
]);

const memory = new BufferMemory({
  chatHistory: new ChatMessageHistory(pastMessages),
  returnMessages: false, memoryKey: "history"
});

const chain = new ConversationChain({ 
    llm: model,
    memory: memory,
    prompt: chatPrompt
});

// Función para generar una palabra que cumpla con la expresión regular
async function generateWord(regex) {
    const res = await chain.invoke({ input: regex });
    const guess = JSON.parse(res.response);
    return guess;
  }

export default generateWord;