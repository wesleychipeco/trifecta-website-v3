import styled from "styled-components";
import {
  HEADER_FONT_FAMILY,
  MOBILE_MAX_WIDTH,
  MOBILE_TITLE_FONT_SIZE,
  PRIMARY_ORANGE,
  TITLE_FONT_SIZE,
} from "./global";
import { FlexColumnCenterContainer } from "./StandardScreen.styles";

export const HorizontalBanner = styled.img`
  width: 75%;
  height: auto;
  margin-top: -3rem;

  @media ${MOBILE_MAX_WIDTH} {
    min-width: 125%;
    margin-top: 1.5rem;
  }
`;

export const TextContainer = styled(FlexColumnCenterContainer)`
  width: 75%;

  @media ${MOBILE_MAX_WIDTH} {
    width: 100%;
  }
`;

export const Subtext = styled.h1`
  font-size: 2rem;
  margin: 0;
  padding: 0;
  text-align: center;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1rem;
  }
`;

export const ErrorTextCentered = styled(Subtext)`
  font-size: 4rem;
  font-weight: 800;
  color: red;
  margin-top: -4rem;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1.75rem;
    margin-top: 0;
  }
`;

export const ReferenceLink = styled.a`
  font-size: 2rem;
  text-decoration: underline;
  font-family: ${HEADER_FONT_FAMILY};
  color: ${PRIMARY_ORANGE};

  &:hover {
    opacity: 0.6;
  }

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1.25rem;
  }
`;
