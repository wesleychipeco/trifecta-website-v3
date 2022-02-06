import styled from "styled-components";

export const App = styled.div`
  width: 100%;
`;

const NAVBAR_BODY_PADDING = "8rem";
export const Body = styled.div`
  padding-left: ${NAVBAR_BODY_PADDING};
  width: calc(100% - ${NAVBAR_BODY_PADDING});
`;
