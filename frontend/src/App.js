import React, { useEffect, useState } from "react";
import "./App.css";
import Dictaphone from "./components/mic";
import { LaTeX, Latex, compile } from "@fileforge/react-print";
import LatexToPDF from "./components/tex";
import { useSpeechRecognition } from "react-speech-recognition";
import LatexPreview from "./components/tex";
import axios from "axios";

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
  var code = document.getElementById("tex").innerHTML;
  console.log(code);
  document.getElementById("ol_encoded_snip").value = encodeURIComponent(code);
  document.getElementById("ol_form").submit();
}

function App() {
  const [tex, setTex] = useState("");
  const [isCompile, setIsCompile] = useState(false);

  let {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    document.getElementById("tex").value = transcript;
  }, [transcript]);

  async function postTextToLatex(text) {
    const response = await axios.post(
      "/textToLatex",
      {},
      {
        params: {
          prompt: text,
        },
      }
    );
    return response.data;
  }

  function refresh(e) {
    transcript = e.target.value;
    setTex(postTextToLatex(transcript));
    setIsCompile(true);
  }

  return (
    <>
      <div className="flex flex-col text-center">
        <h1 class="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 drop-shadow-lg">teXnology</h1>
        <div className="flex flex-row w-full ">
          <div className="flex flex-1 flex-col space-y-4">
            <h2>Live Transcript </h2>
            <p>"{transcript}"</p>
            <button className="bg-gray-200 p-5 ">
              <Dictaphone
                transcript={transcript}
                listening={listening}
                resetTranscript={resetTranscript}
                browserSupportsSpeechRecognition={
                  browserSupportsSpeechRecognition
                }
              />
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
              <dd>
                <pre>
                  <textarea
                    id="tex"
                    onChange={refresh}
                    className="bg-gray-100 p-3 w-1/2"
                    placeholder="Speak your math!"
                  />
                </pre>
              </dd>
              <dt>
                <button
                  href="#"
                  className="bg-green-200 p-2 rounded-md"
                  onClick={openInOverleaf}
                >
                  {" "}
                  Open in Overleaf
                </button>
              </dt>
            </dl>
          </div>

          <div className="flex-1 ">
            pdf display
            <LatexPreview isCompile={setIsCompile} content={tex} />
          </div>
        </div>{" "}
      </div>
    </>
  );
}

export default App;
