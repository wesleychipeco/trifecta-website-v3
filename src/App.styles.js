import styled from "styled-components";
import { MOBILE_MAX_WIDTH } from "styles/global";

export const App = styled.div`
  width: 100%;
`;

const NAVBAR_BODY_PADDING = "8rem";
const MOBILE_NAVBAR_BODY_PADDING = "1.5rem";
export const Body = styled.div`
  padding-left: ${NAVBAR_BODY_PADDING};
  width: calc(100% - ${NAVBAR_BODY_PADDING});

  @media ${MOBILE_MAX_WIDTH} {
    padding-left: ${MOBILE_NAVBAR_BODY_PADDING};
    width: calc(100% - ${MOBILE_NAVBAR_BODY_PADDING});
  }
`;
