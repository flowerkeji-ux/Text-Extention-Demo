
const searchButton = document.getElementById('Search-Button');
const searchInput = document.getElementById('Search-Input');
const result_box = document.getElementById('result');

function highlightWord(word) {

  document.querySelectorAll("mark.wf-highlight").forEach((mark) => {
    const parent = mark.parentNode;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });

  if (!word) return 0;   // stop if nothing
  const excaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matcher = new RegExp(`\\b(${excaped})\\b`, 'gi');

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
  acceptNode: (node) => {
    const tag = node.parentNode.nodeName;
    if (["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(tag)) {
      return NodeFilter.FILTER_REJECT;
    }
    return NodeFilter.FILTER_ACCEPT;
  },
});

const textNodes = [];
while (walker.nextNode())  textNodes.push(walker.currentNode);

// do the highlighting
let count = 0;
let firstMark = null;

textNodes.forEach((node) => {
  const parts = node.textContent.split(matcher);
  if (parts.length > 1) {

    const fragment = document.createDocumentFragment();
    parts.forEach((part, index) => {
      if (index % 2 === 1) {

        const NeonInk = document.createElement("mark");
        NeonInk.className = "wf-highlight";
        NeonInk.style.background = "#8000ff";
        NeonInk.style.color = "#5ac761";
        NeonInk.textContent = part;
        fragment.appendChild(NeonInk);
        if (!firstMark) firstMark = NeonInk;
        count++;
      } else if (part) {
        fragment.appendChild(document.createTextNode(part));
      }
    });

    node.parentNode.replaceChild(fragment, node);
  }
  });



  if (firstMark) {
    firstMark.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  return count;
  
  }
   
  async function runSearch() {
    const word = searchInput.value.trim();
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
   
    try {
      const answ = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: highlightWord,
        args: [word],
      });
      const count = answ[0].result;
      if (!word) result_box.textContent = "no search cleared highlights";
      else if (count === 0) result_box.textContent = "Can't find word :/";
      else result_box.textContent = count + (count === 1 ? " match" : " matches") + " found";
    }
    catch (error) {
      console.error("Error executing script:", error);
      result_box.textContent = "Couldn't complete search. Error type: " + error.name + " (" + error.message + ")";
    }
}
// easter egg

let Timez4Rainbow;


function rainbow () {
  const div = document.getElementById("main-box")
  if (!div) return;

  div.style.background = "linear-gradient(to right, rgba(21, 255, 0, 0.3), rgba(0, 236, 252, 0.3), rgba(0, 46, 252, 0.3), rgb(187, 0, 255, 0.3), rgb(255, 0, 191, 0.3),  rgb(255, 0, 0, 0.3), rgb(255, 123, 0, 0.3), rgb(255, 255, 0 , 0.3))";

  result_box.textContent = "Secret Easter egg 🙃";
  clearTimeout(Timez4Rainbow);
  Timez4Rainbow = setTimeout(() => {
   result_box.textContent = "";

 div.style.background = " linear-gradient(145deg, rgba(24, 17, 61, 0.94), rgba(10, 13, 39, 0.96))";
}, 3000);
}
searchInput.addEventListener('keydown', (e) => { if (e.key === '#') rainbow(); });


searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') runSearch(); });
searchButton.addEventListener("click", runSearch);