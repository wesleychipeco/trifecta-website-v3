import { createGlobalStyle } from "styled-components";

import {
  BACKGROUND_COLOR,
  FONT_COLOR,
  FONT_FAMILY,
  HEADER_FONT_FAMILY,
} from "./variables";

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
