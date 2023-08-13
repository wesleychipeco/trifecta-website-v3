import styled from "styled-components";

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const FlexColumnCentered = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const FlexRowCentered = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const FlexColumnStart = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
`;

export const FlexRowStart = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
`;

export const HorizontalSpacer = styled.div`
  margin-left: ${(props) => `${props.factor * 0.25}rem;`}
  margin-right: ${(props) => `${props.factor * 0.25}rem;`} 
`;

export const VerticalSpacer = styled.div`
  margin-top: ${(props) => `${props.factor * 0.25}rem;`}
  margin-bottom: ${(props) => `${props.factor * 0.25}rem;`} 
`;
