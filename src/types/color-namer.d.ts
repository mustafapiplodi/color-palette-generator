declare module 'color-namer' {
  interface ColorName {
    name: string;
    hex: string;
    distance: number;
  }

  interface ColorNames {
    ntc: ColorName[];
    basic: ColorName[];
    html: ColorName[];
    x11: ColorName[];
    pantone: ColorName[];
  }

  function colorNamer(color: string): ColorNames;
  export default colorNamer;
}
