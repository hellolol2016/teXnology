import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaRegCirclePlay} from 'react-icons/fa6';
import { FaRegStopCircle} from 'react-icons/fa';



const Dictaphone = ({transcript, listening, resetTranscript, browserSupportsSpeechRecognition}) => {
  const[recording,setRecording] = useState(false);


  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  
  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
    setRecording(true)
  } 
  const stopListening = () => {
    SpeechRecognition.stopListening();
    setRecording(false)
  }
  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p> 

      
      
      
      {!recording && <button onClick={startListening} className='bg-blue-200 p-2'><FaRegCirclePlay  className="ml-2 w-6 h-6" /></button>}
      {recording && <button onClick={stopListening} className='bg-red-200 p-2'><FaRegStopCircle className="ml-2 w-6 h-6"/></button>}
      <button onClick={resetTranscript} className='bg-yellow-200 p-2'>Reset</button>
    </div>
  );
};
export default Dictaphone;
