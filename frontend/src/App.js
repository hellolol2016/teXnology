import React, { useEffect, useState } from "react";
import "./App.css";
import "katex/dist/katex.min.css";
import Dictaphone from "./components/mic";
import Latex from "react-latex-next";
import { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";
import { FaRegClipboard } from "react-icons/fa";

function App() {
  const [tex, setTex] = useState("");
  const [isCompile, setIsCompile] = useState(false);

  function openInOverleaf(a) {
    document.getElementById("ol_encoded_snip").value = encodeURIComponent(tex);
    document.getElementById("ol_form").submit();
  }
  let {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    document.getElementById("tex").value = transcript;
  }, [transcript]);
  useEffect(() => {
    document.getElementById("tex").value = tex;
  }, [tex]);

  async function postTextToLatex(text) {
    const response = await axios.post(
      "http://localhost:8080/textToLatex",
      {},
      {
        params: {
          prompt: text,
        },
      }
    );
    return response.data;
  }

  async function refresh() {
    transcript = document.getElementById("tex");
    let latex = await postTextToLatex(transcript.value);
    setTex(latex);
    console.log(tex);
  }
  function updateTex() {
    let ta = document.getElementById("tex");
    transcript = ta.value;
  }
  function clipboard() {
    navigator.clipboard.writeText(tex);
    console.log(tex);
  }

  return (
    <>
      <div className="flex flex-col text-center p-4 h-screen border bg-gradient-to-b from-gray-50 to-gray-150">
        <div className="flex flex-row justify-center content-center items-center">
          <img src="logo.png" className="h-28" />
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-green-800 to-green-900 drop-shadow-lg font-serif leading-tight pb-2">
            teXnology
          </h1>
        </div>
        <div className="flex flex-row justify-center w-full mt-4 gap-7 h-full">
          <div className="flex flex-1 flex-col space-y-4">
            <button
              className={`p-5 rounded-lg flex flex-col justify-center focus:outline-none focus:ring-gray-400 flex items-center `}
            >
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
            <h1 className="text-xl font-bol">LaTeX Code</h1>
            <dl className="">
              <dd className="flex flex-row justify-center">
                <pre className="relative w-5/6">
                  <button
                    className={`${
                      tex.length == 0 ? "hidden" : ""
                    } absolute right-4 bottom-4 hover:bg-gray-200 p-3 rounded-full `}
                    onClick={clipboard}
                  >
                    <FaRegClipboard className="w-6 h-6" />
                  </button>
                  <textarea
                    id="tex"
                    className="bg-gray-100 p-3 text-xl w-full min-h-96 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="Speak your math!"
                    onChange={updateTex}
                  />
                </pre>
              </dd>
              <dt>
                <button
                  href="#"
                  className="border-4 border-black  font-bold font-lg p-3 px-4 rounded-md hover:shadow-md hover:bg-gray-100 m-3"
                  onClick={refresh}
                >
                  Compile
                </button>
              </dt>
            </dl>
          </div>

          <div className="flex-1 flex-col space-y-4">
            <p className="text-2xl font-semibold text-gray-700">
              Latex Preview
            </p>
            <div className="flex align-left bg-gray-200 p-5 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 h-5/6">
              <Latex className="font-xl">{tex}</Latex>
            </div>

            <button
              href="#"
              className="border-4 border-black  font-bold font-lg p-3 px-4 rounded-md hover:shadow-md hover:bg-gray-100 m-3"
              onClick={openInOverleaf}
            >
              Open in Overleaf
            </button>
          </div>
        </div>
        <div className="flex flex-col text-xl drow-shadow-md">
          Made with ❤️ with React
        </div>
      </div>
    </>
  );
}

export default App;
