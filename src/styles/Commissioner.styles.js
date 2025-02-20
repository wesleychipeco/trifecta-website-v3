import styled from "styled-components";
import {
  FONT_COLOR,
  FONT_FAMILY,
  HEADER_FONT_FAMILY,
  MOBILE_MAX_WIDTH,
  PRIMARY_ORANGE,
} from "./global";

const ROW_CONTAINER = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HomeContainer = styled.div`
  width: 85%;
  margin-top: 2rem;
`;

export const HomeRowContainer = styled(ROW_CONTAINER)`
  margin: 2rem 0 5rem 0;
`;

/////////////// Assign Draft Slots ////////////////////

export const AssignDraftSlotsRowContainer = styled(ROW_CONTAINER)`
  width: 100%;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

export const AssignDraftSlotsEachRow = styled(ROW_CONTAINER)`
  width: 50%;
  margin-bottom: 2rem;
`;

export const AssignDraftSlotsText = styled.h4`
  margin: 0;
  padding: 0 0 0 3rem;
  font-size: 1.5rem;
  font-weight: 500;
`;

export const SaveButton = styled.button`
  margin: 0;
  padding: 0;
  width: 8rem;
  height: 3rem;
  background-color: ${PRIMARY_ORANGE};
  border-radius: 5rem;
  border: 0;

  font-size: 1.4rem;
  font-family: ${HEADER_FONT_FAMILY};
  font-weight: 700;
  color: ${FONT_COLOR};
  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }

  &:disabled {
    background-color: gray;
    opacity: 0.6;
  }

  @media ${MOBILE_MAX_WIDTH} {
    width: 4rem;
    height: 2rem;

    font-size: 1rem;
    font-weight: 700;
  }
`;

export const SaveMessageText = styled.p`
  margin: 0;
  padding: 0;
  font-size: 1.2rem;
  font-style: italic;

  @media ${MOBILE_MAX_WIDTH} {
    position: static;
    align-self: center;
  }
`;

//////////// Enter Trade ///////////////
export const EnterTradeDateContainer = styled.div`
  width: 25%;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const EnterTradeRowContainer = styled(ROW_CONTAINER)`
  width: 100%;
  margin-top: 2rem;
`;

export const EnterTradeGMContainer = styled.div`
  width: 20%;
`;

export const EnterTradeAssetContainer = styled.div`
  width: 35%;
`;

export const SectionTitle = styled.h4`
  margin: 0 0 1rem 0;
  padding: 0;
  font-size: 1.5rem;
  text-decoration: underline;
  font-weight: 500;
  text-align: center;
`;

export const ManualInput = styled.input`
  width: 65%;
  height: 2rem;
  font-size: 1.15rem;
  font-family: ${FONT_FAMILY};
  text-align: left;

  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;
  outline: none;
  border: 3px solid black;

  &:focus {
    border: 3px solid ${PRIMARY_ORANGE};
  }

  @media ${MOBILE_MAX_WIDTH} {
    padding: 0.25rem;
    width: 16rem;
    height: 1.25rem;
    font-size: 1rem;
    border: 2px solid black;
    text-align: center;
  }
`;

export const AddManualInputButton = styled.button`
  margin: 0 0 0 1rem;
  padding: 0;
  width: 4.5rem;
  height: 2.5rem;
  background-color: ${PRIMARY_ORANGE};
  border-radius: 3.5rem;
  border: 0;

  font-size: 1.4rem;
  font-family: ${HEADER_FONT_FAMILY};
  font-weight: 700;
  color: ${FONT_COLOR};
  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }

  @media ${MOBILE_MAX_WIDTH} {
    width: 4rem;
    height: 2rem;

    font-size: 1rem;
    font-weight: 600;
    margin-top: 0.5rem;
  }
`;

export const AssetContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const XIconContainer = styled.div`
  padding: 0.1rem;
  margin-left: 0.5rem;
  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }
`;

export const EnterTradeSaveButton = styled(SaveButton)`
  position: absolute;
  top: 18%;
  left: 62%;
`;

export const EnterTradeSaveMessageText = styled(SaveMessageText)`
  position: absolute;
  align-self: end;
  right: 11.5rem;
  top: 8.4rem;
  text-align: right;
`;

/////////////////// Initialize Supplemental Draft Picks ////////////////

export const InitializeSupplementalDraftPicksRowContainer = styled(
  ROW_CONTAINER
)`
  width: 25%;
  display: flex;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

export const InitializeSupplementalDraftPicksText = styled.h4`
  margin: 0;
  padding: 2rem 0 0 0;
  font-size: 1.5rem;
  font-weight: 500;
`;

export const InitializeDraftPicksManualInput = styled(ManualInput)`
  width: 50%;
`;

/////////////////// Trade Future Draft Picks ////////////////
export const TradeDraftPicksRowContainer = styled.div`
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

/////////////////// Remove Completed Draft Picks ////////////////
export const DraftPickText = styled.p`
  font-size: 1rem;
  margin: 0.25rem 0 0.25rem 0;
  padding: 0;
`;
