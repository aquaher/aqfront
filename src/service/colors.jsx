
const colorsGenerator = {
    hexLight: () => {
        let color = "#";
        for (let i = 0; i < 3; i++)
            color += ("0" + Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)).slice(-2);
        return color;
    },
    hexDark: () => {
        let color = "#";
        for (let i = 0; i < 3; i++)
            color += ("0" + Math.floor(Math.random() * Math.pow(16, 2) / 2).toString(16)).slice(-2);
        return color;
    },
    hexRamdon: () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    },
    rgbDark: () => {
        const red = Math.floor(Math.random() * 256 / 2);
        const green = Math.floor(Math.random() * 256 / 2);
        const blue = Math.floor(Math.random() * 256 / 2);
        return "rgb(" + red + ", " + green + ", " + blue + ")";
    },
    rgbLight: () => {
        const red = Math.floor((1 + Math.random()) * 256 / 2);
        const green = Math.floor((1 + Math.random()) * 256 / 2);
        const blue = Math.floor((1 + Math.random()) * 256 / 2);
        return "rgb(" + red + ", " + green + ", " + blue + ")";
    }
}

export default colorsGenerator;