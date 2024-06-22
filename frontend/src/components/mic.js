import React, { useState } from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

export default function Dictaphone() {
  const [audioBlob, setAudioBlob] = useState(null);
  const recorderControls = useAudioRecorder();

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    console.log(url);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
    
    // Save the blob internally
    saveAudioInternally(blob);
  };

  const saveAudioInternally = (blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      localStorage.setItem('audioRecording', base64data);
      alert('Audio saved internally!');
    };
  };

  const retrieveAudioFromStorage = () => {
    const savedAudio = localStorage.getItem('audioRecording');
    if (savedAudio) {
      const audio = new Audio(savedAudio);
      audio.controls = true;
      document.body.appendChild(audio);
    } else {
      alert('No audio found in storage.');
    }
  };

  return (
    <div>
      <AudioRecorder 
        onRecordingComplete={(blob) => addAudioElement(blob)}
        recorderControls={recorderControls}
        downloadOnSavePress={true}
        downloadFileExtension="webm"
      />
      <button onClick={recorderControls.stopRecording}>Stop recording</button>
      <button onClick={retrieveAudioFromStorage}>Retrieve Saved Audio</button>
    </div>
  );
}
