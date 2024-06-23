import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictaphone = ({transcript, listening, resetTranscript, browserSupportsSpeechRecognition}) => {

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  
  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  } 

  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p> 
      <button onClick={startListening} className='bg-blue-200 p-2'>Start</button>
      <button onClick={SpeechRecognition.stopListening} className='bg-red-200 p-2'>Stop</button>
      <button onClick={resetTranscript} className='bg-yellow-200 p-2'>Reset</button>
    </div>
  );
};
export default Dictaphone;
