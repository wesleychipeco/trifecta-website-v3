import styled from "styled-components";
import { FONT_COLOR, HEADER_FONT_FAMILY, MOBILE_MAX_WIDTH } from "./global";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;

  @media ${MOBILE_MAX_WIDTH} {
    flex-direction: column;
    padding: 0.5rem;
  }
`;

export const OwnerName = styled.div`
  font-size: 1.75rem;
  text-decoration: none;
  font-family: ${HEADER_FONT_FAMILY};
  color: ${FONT_COLOR};

  @media ${MOBILE_MAX_WIDTH} {
    text-align: center;
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;

  @media ${MOBILE_MAX_WIDTH} {
    flex-direction: row;
    margin-left: 0;
    margin-bottom: 1rem;
  }
`;

export const Spacer = styled.div`
  margin-top: 1rem;

  @media ${MOBILE_MAX_WIDTH} {
    margin-top: 0;
    margin-right: 1rem;
  }
`;
