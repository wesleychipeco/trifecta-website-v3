import { createGlobalStyle } from "styled-components";

export const BACKGROUND_COLOR = "#E6BE8A";

export const FONT_FAMILY = "'Roboto', sans-serif";
export const HEADER_FONT_FAMILY = "'Rubik', sans-serif";
export const FONT_COLOR = "#000000";

export const PRIMARY_ORANGE = "#EC5800";

const MOBILE_PIXEL_WIDTH = "450px";
export const MOBILE_MAX_WIDTH = `(max-width: ${MOBILE_PIXEL_WIDTH})`;

export default createGlobalStyle`
    html, body {
        display: flex;
        font-family: ${FONT_FAMILY};
        font-size: 1rem;
        width: 100%;
        margin: 0;
        padding: 0;
        scroll-behavior: smooth;
        background-color: ${BACKGROUND_COLOR};
        color: ${FONT_COLOR};
    }
    h1, h2, h3, h4, h5, h6 {
        font-family: ${HEADER_FONT_FAMILY};
        color: ${FONT_COLOR};
    }
    #root {
        display: flex;
        flex: 1;
        width: 100%;
    }
`;
