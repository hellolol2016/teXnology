import React from 'react';
import { Latex, compile } from '@fileforge/react-print';
import { Fileforge } from "@fileforge/client";

export const Tex = () => {
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

export async function run(){
    const html = await compile(<Example/>);
    const { file } = await fileforge.render({
        html,
        test: false,
        save: false,
        expiresIn: 10,
        assets: [
        ],
    });

    fs.writeFileSync("./example.pdf", Buffer.from(file));
};