import { Font } from '@react-pdf/renderer';

let registered = false;

export function registerPoppinsFont() {
  if (registered) return;
  Font.register({
    family: 'Poppins',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/poppins/v22/pxiEyp8kv8JHgFVrFJA.ttf', fontWeight: 400 },
      { src: 'https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLCz7V1s.ttf', fontWeight: 700 },
    ],
  });
  registered = true;
}
