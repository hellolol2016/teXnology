import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaRegCirclePlay} from 'react-icons/fa6';
import { FaRegStopCircle} from 'react-icons/fa';
import { RxReset} from 'react-icons/rx';



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
    <div className='w-full'> 
      
      <div className='flex flex-row w-full justify-center'>
      {!recording && <button onClick={startListening} className='hover:bg-gray-200 bg-gray-100 p-5 rounded-full shadow-md'><FaRegCirclePlay  className="w-24 h-24" /></button>}
      {recording && <button onClick={stopListening} className='hover:bg-gray-200 bg-gray-100 p-5 rounded-full shadow-md'><FaRegStopCircle className="w-24 h-24"/></button>}
      <div className='w-20'></div>

      <button onClick={resetTranscript} className='hover:bg-gray-200 bg-gray-100 p-5 rounded-full shadow-md'><RxReset className='w-24 h-24' /></button>
</div>
    </div>
  );
};
export default Dictaphone;
