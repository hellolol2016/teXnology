import "./App.css";
import Dictaphone from "./components/mic";
import { Latex } from "@onedoc/react-print";

function openInOverleaf(a) {
  /*
   * Get the unformatted code from the formatted code box.
   *
   * Using the browser's selection isn't ideal, because it clobbers whatever
   * the user may have had in their clipboard.
   * It's almost possible to use innerText, but that does not work on FF.
   * FF supports textContent, but that discards the newlines, which are
   * represented by BR tags in the formatted code. So, we have to walk the DOM.
   */
  function unformat(e) {
    var ret = "";
    if (e.nodeType === 1) {
      // element node
      if (e.tagName === "BR") {
        return "\n";
      } else {
        for (e = e.firstChild; e; e = e.nextSibling) {
          ret += unformat(e);
        }
        return ret;
      }
    } else if (e.nodeType === 3 || e.nodeType === 4) {
      // text node
      return e.nodeValue;
    }
  }
  var code = document.getElementById("tex").innerText;
  console.log(code);
  document.getElementById("ol_encoded_snip").value = encodeURIComponent(
    unformat(code)
  );
  document.getElementById("ol_form").submit();
}

function App() {
  return (
    <>
      <div className="flex flex-row w-full ">
        <div className="flex flex-1 flex-col space-y-4">
          <h2>text </h2>
          <button className="bg-gray-200 p-5 ">
            <Dictaphone />
            microphone icon
          </button>

          <form
            id="ol_form"
            action="https://www.overleaf.com/docs"
            method="post"
            target="_blank"
          >
            <input id="ol_encoded_snip" type="hidden" name="encoded_snip" />
          </form>
          <dl class="codebox">
            <dt>
              Code:{" "}
              <a href="#" onClick={openInOverleaf}>
                Open in Overleaf
              </a>
            </dt>
            <dd>
              <pre>
                <code id="tex">...</code>
              </pre>
            </dd>
          </dl>
        </div>

        <div className="flex-1">pdf display</div>
      </div>
    </>
  );
}

export default App;
