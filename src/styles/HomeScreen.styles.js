import styled from "styled-components";
import {
  MOBILE_MAX_WIDTH,
  MOBILE_TITLE_FONT_SIZE,
  TITLE_FONT_SIZE,
} from "./global";

export const HomeContainer = styled.div`
  width: 95%;
`;

export const TitleContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const TitleText = styled.h1`
  z-index: 5;
  font-size: ${TITLE_FONT_SIZE};
  margin-bottom: 0.75rem;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: ${MOBILE_TITLE_FONT_SIZE};
  }
`;

export const ImageOpacity = styled.div`
  opacity: 0.7;
`;

export const HorizontalBanner = styled.img`
  position: absolute;
  width: 75%;
  height: auto;
  top: -5rem;

  @media ${MOBILE_MAX_WIDTH} {
    min-width: 125%;
    height: auto;
    top: -1rem;
    left: 50%;

    transform: translate(-48%, 0);
  }
`;

export const Basketball = styled.img`
  position: absolute;
  max-width: 39%;
  max-height: 35rem;
  width: auto;
  heigh: auto;
  top: 60%;
  left: 51%;

  @media ${MOBILE_MAX_WIDTH} {
    min-width: 95%;

    top: 18%;
    left: 50%;
    transform: translate(-50%, 0);
  }
`;

export const Baseball = styled.img`
  position: absolute;
  z-index: 2;
  max-width: 36%;
  max-height: 40rem;
  width: auto;
  height: auto;
  top: 59%;
  left: 13%;

  @media ${MOBILE_MAX_WIDTH} {
    min-width: 95%;

    top: 45%;
    left: 50%;
    transform: translate(-50%, 0);
  }
`;

export const Football = styled.img`
  position: absolute;
  max-width: 47%;
  max-height: 35rem;
  width: auto;
  heigh: auto;
  top: 27%;
  left: 27%;

  @media ${MOBILE_MAX_WIDTH} {
    min-width: 95%;

    top: 75%;
    left: 50%;
    transform: translate(-50%, 0);
  }
`;

export const Trophy = styled.img`
  position: absolute;
  z-index: 3;
  max-width: 30%;
  max-height: 50rem;
  width: auto;
  height: auto;
  top: 33%;
  left: 38%;

  @media ${MOBILE_MAX_WIDTH} {
    min-width: 100%;

    top: 28%;
    left: 50%;
    transform: translate(-50%, 0);
  }
`;
