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

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  const categoryFilter = document.getElementById("categoryFilter").value;
  const quoteDisplay = document.getElementById("quoteDisplay");

  const filteredQuotes =
    categoryFilter === "all"
      ? quotes
      : quotes.filter((q) => q.category === categoryFilter);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available in this category.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
        <p>"${quote.text}"</p>
        <p><em>Category: ${quote.category}</em></p>
    `;

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

async function addQuote() {
  const textInput = document.getElementById("newQuoteText").value;
  const categoryInput = document.getElementById("newQuoteCategory").value;

  if (textInput && categoryInput) {
    const newQuote = { text: textInput, category: categoryInput };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();

    await postQuoteToServer(newQuote);

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

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map((quote) => quote.category))];
  const currentFilter = localStorage.getItem("lastFilter") || "all";

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = currentFilter;
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastFilter", selectedCategory);
  showRandomQuote();
}

function exportToJson() {
  const dataStr = JSON.stringify(quotes);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", url);
  linkElement.setAttribute("download", "quotes.json");
  linkElement.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch (e) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverPosts = await response.json();
    const serverQuotes = serverPosts.slice(0, 5).map((post) => ({
      text: post.title,
      category: "Server",
    }));
    syncQuotes(serverQuotes);
  } catch (error) {
    console.error("Error fetching from server:", error);
  }
}

async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      body: JSON.stringify(quote),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

function syncQuotes(serverQuotes) {
  let newQuotesFound = false;
  serverQuotes.forEach((serverQuote) => {
    const exists = quotes.some(
      (localQuote) => localQuote.text === serverQuote.text
    );
    if (!exists) {
      quotes.push(serverQuote);
      newQuotesFound = true;
    }
  });

  if (newQuotesFound) {
    saveQuotes();
    populateCategories();
    alert("Quotes synced with server!");
  }
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

createAddQuoteForm();
populateCategories();

const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const q = JSON.parse(lastQuote);
  document.getElementById(
    "quoteDisplay"
  ).innerHTML = `<p>"${q.text}"</p><p><em>Category: ${q.category}</em></p>`;
} else {
  showRandomQuote();
}

setInterval(fetchQuotesFromServer, 60000);
