import styled from "styled-components";
import { MOBILE_NAVBAR_BODY_PADDING } from "App.styles";
import {
  FONT_COLOR,
  FONT_FAMILY,
  HEADER_FONT_FAMILY,
  MOBILE_MAX_WIDTH,
  PRIMARY_ORANGE,
  TITLE_FONT_SIZE,
} from "./global";

export const CommissionerHomeContainer = styled.div`
  width: 85%;
  margin-top: 2rem;
`;

export const CommissionerHomeRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0 5rem 0;
`;
