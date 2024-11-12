export function calcIntensity(rgbaIn: string): number {
  // https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
  const stripped = rgbaIn.replace(/[ ()]|rgba/g, '');
  const split = stripped.split(',', 3)

  const red = parseInt(split[0])
  const green = parseInt(split[1])
  const blue = parseInt(split[2])

  return red*0.299 + green*0.587 + blue*0.114
}
