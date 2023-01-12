import styled from "styled-components";
import { FONT_COLOR, HEADER_FONT_FAMILY, PRIMARY_GREEN } from "./variables";

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
`;

export const Title = styled.h1`
  font-size: 3rem;
  text-align: center;
`;

export const OuterTradeBlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const InnerTradeBlockContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: 100%;
  margin: 1rem 0 2rem 0;

  width: 100%;
`;

export const Subtitle = styled.h2`
  margin: 0;
  padding: 0;
  font-size: 2rem;
  font-weight: 700;
`;

export const SaveButton = styled.button`
  position: absolute;
  align-self: end;

  margin: 0;
  padding: 0;
  width: 6rem;
  height: 2.5rem;
  background-color: ${PRIMARY_GREEN};
  border-radius: 3.5rem;
  border: 0;

  font-size: 1.5rem;
  font-family: ${HEADER_FONT_FAMILY};
  font-weight: 700;
  color: ${FONT_COLOR};
  &:hover {
    opacity: 0.6;
    cursor: pointer;
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
`;

export const TradeBlockSection = styled.div`
  display: flex;
  flex-direction: column;
  border: 0.25rem solid rgba(169, 169, 169, 0.5);
  border-radius: 1rem;
  padding: 1rem;
  width: 25%;
`;

export const TradeBlockDisplaySection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
`;

export const TradeBlockWriteSection = styled.div`
  display: flex;
  background-color: blue;
`;

export const AllAssetsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const SportContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  padding: 1rem;
  border: 0.25rem solid rgba(169, 169, 169, 0.5);
  border-radius: 1rem;
`;

export const SportTitle = styled.h2`
  margin: 0 0 0.5rem 0;
  padding: 0;
  font-size: 1.75rem;
  font-weight: 600;
  text-align: center;
  text-decoration: underline;
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const PlayersContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 1.5rem;
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
`;

export const FaabText = styled(AssetText)`
  text-align: center;
`;

export const AssetContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.35rem 0 0.35rem 0;
`;

export const XIconContainer = styled.div`
  padding: 0.1rem;
  margin-left: 0.5rem;
  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }
`;
