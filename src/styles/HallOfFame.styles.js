import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FONT_COLOR, HEADER_FONT_FAMILY } from "./variables";

const CONTENT_WIDTH = "75%";
const BOX_SHADOW = "0 0 0.1rem 0.3rem rgba(0, 0, 0, 0.9)";

export const FlexColumnCenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: ;
`;

export const ChampionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  width: ${CONTENT_WIDTH};
  border-radius: 1rem;
  box-shadow: ${BOX_SHADOW};
  padding: 1rem;
  margin-bottom: 3rem;
`;

export const ChampionsTextContainer = styled.div`
  position: absolute;
  left: 8rem;
  padding-top: 6.8rem;
`;

export const ChampionsColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

export const Champion = styled.div`
  margin-bottom: 1rem;
`;

export const ChampionsText = styled.p`
  font-size: 1.75rem;
  padding: 0;
  margin: 0.5rem 0 0.5rem 0;
  color: ${FONT_COLOR};
`;

export const HallOfFameContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: ${CONTENT_WIDTH};
  min-width: 50%;
  border-radius: 1rem;
  box-shadow: ${BOX_SHADOW};
  padding: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

export const HallOfFameLabelTextContainer = styled.div`
  position: absolute;
  left: 8rem;
  padding-top: 0.75rem;
`;

export const LabelText = styled.h4`
  font-size: 2rem;
  margin: 0;
  padding: 0;
  color: ${FONT_COLOR};
`;

export const StandingsColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const StandingsRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  &:first-child {
    margin-bottom: 1.5rem;
  }
`;

export const OwnerProfilesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: ${CONTENT_WIDTH};
  min-width: 50%;
  border-radius: 1rem;
  box-shadow: ${BOX_SHADOW};
  padding: 1rem;
  margin-bottom: 3rem;
`;

export const OwnerProfilesLabelTextContainer = styled.div`
  position: absolute;
  left: 8rem;
  padding-top: 4rem;
`;

export const OwnerProfilesColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;

  margin-right: ${(props) => {
    if (props.column === 1) {
      return "2rem;";
    }
    return "0;";
  }}

  margin-left: ${(props) => {
    if (props.column === 3) {
      return "2rem;";
    }
    return "0;";
  }}  
`;

export const OwnerProfilesLink = styled(NavLink)`
  display: flex;
  flex-direction: row;
  font-size: 1.75rem;
  text-decoration: none;
  font-family: ${HEADER_FONT_FAMILY};
  color: ${FONT_COLOR};
  margin-bottom: 1.5rem;

  &:hover {
    opacity: 0.6;
    text-decoration: underline;
  }
`;
