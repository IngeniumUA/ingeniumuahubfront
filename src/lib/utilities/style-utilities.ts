/**
 * Uusally used when converting enum names to something nice to displau
 * @param input_str
 */
export const makePretty = (input_str: string): string => {
    if (input_str.startsWith('_')) {return input_str}
    return input_str.substring(0, 1).toUpperCase().concat(input_str.substring(1).replace("_", " "));
}

/**
 * TODO Function, quick and dirty at the moment
 * @param input_str
 */
export const prettyDate = (input_str: string): string => {
    return input_str.split("T")[0]
}

export const prettyDateTime = (input_str: string): string => {
	return `${prettyDate(input_str)} ${input_str.split('T')[1].split('.')[0]}`;
};

/**
 * 
 */
export const hexToRGB = (hex_str: string): string | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex_str);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`: null;
}

/**
 * Transforms the received database color into a rgba color
 * @param db_color
 * @param a alpha value
 */
export const transformColorToRGBA = (db_color: string, a: number = 1): string => {
    const stripped = db_color.replace(/[ ()]|rgb/g, '');
    const split = stripped.split(',', 3)
    return `rgba(${split[0]}, ${split[1]}, ${split[2]}, ${a.toString()})`;
}

/**
 * Calculate the intensity of a color
 * @param rgbaIn
 */
export function calcColorIntensity(rgbaIn: string): number {
    // https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
    // Remove the "rgb(" or "rgba(" prefix and the ")" suffix
    const isRGBA = rgbaIn.startsWith("rgba");
    const split = rgbaIn.slice(isRGBA ? 5 : 4, -1).split(",");

    const red = parseInt(split[0].trim())
    const green = parseInt(split[1].trim())
    const blue = parseInt(split[2].trim())

    return red*0.299 + green*0.587 + blue*0.114
}