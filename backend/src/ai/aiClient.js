import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq=new Groq({
    apiKey:process.env.Groq_API_KEY
});
export default groq;