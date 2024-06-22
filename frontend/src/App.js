import React, { useState } from "react";
import "./App.css";
import Dictaphone from "./components/mic";
import { LaTeX, Latex } from '@fileforge/react-print';
import {Fileforge} from "@fileforge/client"

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
  function refresh(e) {
    setTex(e.target.value);
  }




const Example = () => {

    return (

      <React.Fragment>  


        <p> Fourier Transform </p>


        <Latex>{String.raw`

            \relax{x} = \int_{-\infty}^\infty

            \hat\xi\,e^{2 \pi i \xi x}

            \,d\xi

        `}</Latex>


        <p> Inverse Fourier Transform </p>


        <Latex>{String.raw`

            \hat\xi = \int_{-\infty}^\infty

            x\,e^{-2 \pi i \xi x}

            \,dx

        `}</Latex>


      </React.Fragment>

    );

  };


const fileforge = new Fileforge("process.env.FILEFORGE_API_KEY"); //replace with you API key





  return (
    <>
      <div className="flex flex-col text-center">
        <h1>teXhnology</h1>
        <div className="flex flex-row w-full ">
          <div className="flex flex-1 flex-col space-y-4">
            <h2>Live Transcript </h2>
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
              <dd>
                <pre>
                  <textarea
                    id="tex"
                    onChange={refresh}
                    value={tex}
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
            <Latex>{tex} </Latex>
          </div>
        </div>{" "}
      </div>
    </>
  );
}

export default App;