import { GoogleGenerativeAI } 
    from "https://esm.run/@google/generative-ai";

// -------------------------------
// ADD YOUR PRIVATE API KEY BELOW
// -------------------------------
const API_KEY = "AIzaSyBlkaYFHOpl3ySPG4YgenuSNLmJ7OagY1I";

const genAI = new GoogleGenerativeAI(API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash-lite" });



// Connect button click to function
document.getElementById("submitBtn").addEventListener("click", handleUserInput);


// Temporary function to check which models your API key supports
async function listModels() {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    const data = await res.json();
    console.log("AVAILABLE MODELS:", data);
}

// Run it once
listModels();
// 

async function handleUserInput() {
    const input = document.getElementById("userInput").value;
    const responseBox = document.getElementById("responseBox");

    responseBox.innerText = "Generating response...";

    const prompt = `
    You are an Education Aid Advisor.

    Based on the student's details, list:
    - eligible scholarships
    - government schemes
    - fee waivers
    - required documents
    - application steps
    - deadlines (if available)

    Student Details:
    ${input}
    `;

    try {
        const result = await model.generateContent(prompt);
        responseBox.innerText = result.response.text();
    } catch (err) {
        responseBox.innerText = "Error: " + err;
    }
}
