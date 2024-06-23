import React, { useRef } from "react";
import fs from "fs"

const Dictaphone = ({setTranscript}) => { 
  const socketRef = useRef(null) 
  const activateMic = () => {
    console.log("gogogo");

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      if (!MediaRecorder.isTypeSupported("audio/webm")) {
        return alert("Browser not supported!");
      }
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      require("dotenv").config();

      // Add Deepgram so you can get the transcription
      const { Deepgram } = require("@deepgram/sdk");
      const deepgram = new Deepgram(process.env.DEEPGRAM_KEY);

      // Add WebSocket
      const WebSocket = require("ws");
      const wss = new WebSocket.Server({ port: 3002 });

      // Open WebSocket connection and initiate live transcription
      wss.on("connection", (ws) => {
        const deepgramLive = deepgram.transcription.live({
          interim_results: true,
          punctuate: true,
          endpointing: true,
          vad_turnoff: 500,
        });

        deepgramLive.addListener("open", () => console.log("dg onopen"));
        deepgramLive.addListener("error", (error) => console.log({ error }));

        ws.onmessage = (event) => deepgramLive.send(event.data);
        ws.onclose = () => deepgramLive.finish();

        deepgramLive.addListener("transcriptReceived", (data) => ws.send(data));
      });

      const socket = new WebSocket("ws://localhost:3002");

      socket.onopen = () => {
        console.log({ event: "onopen" });
        mediaRecorder.addEventListener("dataavailable", async (event) => {
          if (event.data.size > 0 && socket.readyState === 1) {
            socket.send(event.data);
          }
        });
        mediaRecorder.start(1000);
      };

      socket.onmessage = (message) => {
        const received = JSON.parse(message.data);
        const transcript = received.channel.alternatives[0].transcript;
        if (transcript) {
          console.log(transcript);
          setTranscript(transcript);
        }
      };


      socket.onclose = () => {
        console.log({ event: "onclose" });
      };

      socket.onerror = (error) => {
        console.log({ event: "onerror", error });
      };


      socketRef.current = socket;
    });
  };
  return (

    <button onClick={activateMic} type="button">
      Record
    </button>
  );
};
export default Dictaphone;
