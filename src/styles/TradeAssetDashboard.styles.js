import styled from "styled-components";
import {
  FONT_COLOR,
  FONT_FAMILY,
  HEADER_FONT_FAMILY,
  MOBILE_MAX_WIDTH,
  MOBILE_TITLE_FONT_SIZE,
  PRIMARY_ORANGE,
  TITLE_FONT_SIZE,
} from "./global";

export const TradeAssetHomeContainer = styled.div`
  width: 90%;
`;

export const TradeAssetHomeRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0 3rem 0;
`;

export const FlexColumnCenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 4rem);
  padding-right: 2rem;

  @media ${MOBILE_MAX_WIDTH} {
    width: calc(100vw - 1rem);
    padding-right: 0;
  }
`;

export const Title = styled.h1`
  font-size: ${TITLE_FONT_SIZE};
  text-align: center;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: ${MOBILE_TITLE_FONT_SIZE};
    width: 15rem;
    align-self: center;
  }
`;

export const OuterTradeBlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  @media ${MOBILE_MAX_WIDTH} {
    align-items: flex-start;
  }
`;

export const InnerTradeBlockContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: 100%;
  margin: 1rem 0 2rem 0;

  width: 100%;

  @media ${MOBILE_MAX_WIDTH} {
    flex-direction: column;
  }
`;

export const Subtitle = styled.h2`
  margin: 0;
  padding: 0;
  font-size: 2.25rem;
  font-weight: 700;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1.5rem;
    font-weight: 600;
    align-self: center;
  }
`;

export const SaveButton = styled.button`
  position: absolute;
  align-self: end;

  margin: 0;
  padding: 0;
  width: 6rem;
  height: 2.5rem;
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

  position: absolute;
  align-self: end;
  right: 11.5rem;
  top: 8.4rem;
  text-align: right;

  @media ${MOBILE_MAX_WIDTH} {
    position: static;
    align-self: center;
  }
`;

export const TradeBlockSection = styled.div`
  display: flex;
  flex-direction: column;
  border: 0.25rem solid black;
  border-radius: 1rem;
  padding: 1rem;
  width: 26%;

  @media ${MOBILE_MAX_WIDTH} {
    border: 0.2rem solid black;
    padding: 0.25rem;
    width: 96%;
    margin: 0.5rem 0 0.5rem 0;
  }
`;

export const TradeBlockDisplaySection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
`;

export const TradeBlockWriteSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  margin: 1rem 0 0 0;

  @media ${MOBILE_MAX_WIDTH} {
    flex-direction: column;
  }
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

export const AllAssetsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media ${MOBILE_MAX_WIDTH} {
    flex-direction: column;
  }
`;

export const SportContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  padding: 1rem;
  border: 0.25rem solid black;
  border-radius: 1rem;

  @media ${MOBILE_MAX_WIDTH} {
    border: 0.2rem solid black;
    padding: 0.25rem;
    width: auto;
    margin-bottom: 1rem;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0 0 0.5rem 0;
  padding: 0;
  font-size: 1.75rem;
  font-weight: 600;
  text-align: center;
  text-decoration: underline;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1.15rem;
  }
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const PlayersContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 1.5rem;

  @media ${MOBILE_MAX_WIDTH} {
    margin-right: 0.75rem;
  }
`;

export const DraftPicksContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 9.5rem;
`;

export const AssetText = styled.p`
  font-size: 1.15rem;
  margin: 0;
  padding: 0;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1rem;
  }
`;

export const FaabText = styled(AssetText)`
  text-align: center;
`;

export const AssetContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.35rem 0 0.35rem 0;

  @media ${MOBILE_MAX_WIDTH} {
    margin: 0.15rem 0 0.15rem 0;
  }
`;

export const XIconContainer = styled.div`
  padding: 0.1rem;
  margin-left: 0.5rem;
  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }
`;
