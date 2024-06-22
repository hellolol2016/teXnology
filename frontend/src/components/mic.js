import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

export default function Dictaphone(){
  const recorderControls = useAudioRecorder()
  const addAudioElement = (blob) => {
    var file = new File([blob],"temp.mp3",{type:blob.type})
    const url = URL.createObjectURL(blob);
    console.log(url);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
  };

  return (
    <div>
      <AudioRecorder 
        onRecordingComplete={(blob) => addAudioElement(blob)}
        recorderControls={recorderControls}
      />
      <button onClick={recorderControls.stopRecording}>Stop recording</button>
    </div>
  )
}