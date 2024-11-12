export function calcIntensity(rgbaIn: string): number {
  // https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
  // Remove the "rgb(" or "rgba(" prefix and the ")" suffix
  const isRGBA = rgbaIn.startsWith("rgba");
  const split = rgbaIn.slice(isRGBA ? 5 : 4, -1).split(",");

  const red = parseInt(split[0].trim())
  const green = parseInt(split[1].trim())
  const blue = parseInt(split[2].trim())

  return red*0.299 + green*0.587 + blue*0.114
}
