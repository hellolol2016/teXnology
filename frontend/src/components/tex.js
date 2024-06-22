import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {Audio} from "react-loader-spinner";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


function LatexPreview({ content}) {
  const [rawFile, setRawFile] = useState("");
  const [rawResponse, setRawResponse] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
 
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    handleCompile();
  }, [content]);

  
  const postData = () => {
    const formData = new FormData();
    formData.append("foo", content);

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        setIsLoading(false);
        if (response.ok) {
          return response.blob();
        } else {
          return response.json();
        }
      })
      .then((response) => {
  
        if (response.error) {  
          setRawResponse(response.error);
          throw new Error();
        }
        return response;
      })
      .then((response) => {
        var reader = new FileReader();
        reader.onloadend = () => {
          var base64data = reader.result;
          setRawResponse("");
          setRawFile(base64data);
        };
        reader.readAsDataURL(response);
      })
      .catch((error) => console.log(error));
  };


  const handleSaveClick = () => {
    let link = document.createElement("a");
    link.href = rawFile;
    link.download = "download.pdf";
    link.click();
  };
  const handleCompile = () => {
    setIsLoading(true);
    postData();
  };
  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  return (
    <div
          id="preview"
          className={`html-div `}
        >
          {(() => {
            if (isLoading) {
              var color;
              if (localStorage.getItem("theme")) {
                color = JSON.parse(localStorage.getItem("theme")).primaryColor;
              } else {
              }
              return (
                <div>
                  <Audio
                    type="Puff"
                    height={100}
                    color={color}
                    width={100}
                    timeout={3000}
                  />{" "}
                </div>
              );
            }

            if (Object.keys(rawResponse).length !== 0) {
              return <div>{rawResponse}</div>;
            }
            if (Object.keys(rawFile).length !== 0) {
              return (
                <div>
                  <Document
                    file={rawFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page
                        renderTextLayer={false}
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        scale={1.5}
                      />
                    ))}
                  </Document>
                </div>
              );
            }
          })()}
        </div>
  );
}

export default LatexPreview;

