let quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    category: "Motivation",
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    category: "Leadership",
  },
  { text: "Stay hungry, stay foolish.", category: "Inspiration" },
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");

  quoteDisplay.innerHTML = "";
  const quoteText = document.createElement("p");
  const quoteCategory = document.createElement("p");

  quoteText.textContent = `"${quote.text}"`;
  quoteCategory.textContent = `Category: ${quote.category}`;
  quoteCategory.style.fontStyle = "italic";

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText").value;
  const categoryInput = document.getElementById("newQuoteCategory").value;

  if (textInput && categoryInput) {
    quotes.push({ text: textInput, category: categoryInput });

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("Quote added successfully!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}

function createAddQuoteForm() {
  const container = document.getElementById("formContainer");

  container.innerHTML = `
        <div>
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button id="addQuoteBtn">Add Quote</button>
        </div>
    `;

  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

createAddQuoteForm();
