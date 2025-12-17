let quotes = JSON.parse(localStorage.getItem("quotes")) || [
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

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

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

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText").value;
  const categoryInput = document.getElementById("newQuoteCategory").value;

  if (textInput && categoryInput) {
    quotes.push({ text: textInput, category: categoryInput });
    saveQuotes();
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
            <button onclick="addQuote()">Add Quote</button>
        </div>
    `;
}

// --- Task 1: JSON Export & Import ---

function exportToJson() {
  const dataStr = JSON.stringify(quotes);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const exportFileDefaultName = "quotes.json";
  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", url);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
      showRandomQuote();
    } catch (e) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event Listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initialization
createAddQuoteForm();

const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  document.getElementById(
    "quoteDisplay"
  ).innerHTML = `<p>"${quote.text}"</p><p><em>Category: ${quote.category}</em></p>`;
}
