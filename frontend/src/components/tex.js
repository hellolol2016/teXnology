import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function Tex({texInput}) {
  return (
    <div>
      <Latex>{texInput}</Latex>
    </div>
  )
}