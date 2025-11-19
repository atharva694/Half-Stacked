import { GoogleGenerativeAI } 
    from "https://esm.run/@google/generative-ai";

const API_KEY = "AIzaSyBlkaYFHOpl3ySPG4YgenuSNLmJ7OagY1I";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "models/gemini-2.0-flash-lite",
    temperature: 1.0
});

document.getElementById("submitBtn").addEventListener("click", handleUserInput);

async function generateWithRetry(prompt, retries = 3, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (err) {
            if (i === retries - 1) throw err;
            await new Promise(r => setTimeout(r, delay));
        }
    }
}

async function handleUserInput() {
    const income = document.getElementById("income").value.trim();
    const state = document.getElementById("state").value.trim();
    const category = document.getElementById("category").value.trim();
    const course = document.getElementById("course").value.trim();
    const additional = document.getElementById("additional").value.trim();

    const responseBox = document.getElementById("responseBox");

    if (!income || !state || !category || !course) {
        responseBox.innerHTML = `<span style="color:red;">Please fill in all mandatory fields.</span>`;
        return;
    }

    responseBox.innerHTML = `<span style="color:gray;">Generating response... ⏳</span>`;

    // Updated prompt: short list with scholarship name, documents, and amount
    const prompt = `
You are an AI Education Aid Advisor.

Given the student details, provide a **short list of scholarships** only.
For each scholarship, include:

1. Name of the scholarship  
2. Documents required (short list)  
3. Approximate amount awarded  

Format:
1. Scholarship Name  
   - Documents: -doc1
                -doc2
                -doc3
   - Amount: ...

Do not include other schemes or extra instructions.

Student Details:
- Family Monthly Income: ${income}
- State: ${state}
- Category: ${category}
- Course / Stream: ${course}
${additional ? `- Additional Info: ${additional}` : ''}
`;

    try {
        const output = await generateWithRetry(prompt, 3, 2000);

        // Split by double line breaks or numbers to make readable list
        let entries = output.split(/\n\d+\./).map(e => e.trim()).filter(e => e);

        let formattedHTML = '';
        entries.forEach((entry, idx) => {
            formattedHTML += `
            <div class="scheme-card">
                <strong>${idx + 1}. ${entry}</strong>
            </div>
            `;
        });

        responseBox.innerHTML = formattedHTML;

    } catch (err) {
        responseBox.innerHTML = `<span style="color:red;">Error generating response. Please try again later.</span>`;
        console.error("AI Error:", err);
    }
}
