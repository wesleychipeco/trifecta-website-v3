import styled from "styled-components";
import { colorPositionMatcher } from "./DraftCardColors";

export const PaddingContainer = styled.div`
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0.25rem 0.1rem 0.25rem 0.1rem;
  width: 98%;

  background-color: ${(props) =>
    colorPositionMatcher(props.sport, props.position)};
`;

export const DraftPickNumberText = styled.p`
  font-size: 0.85rem;
  margin: 0;
  padding: 0;
`;

export const ExtraContainer = styled.div`
  width: 100%;
  min-width: 0;
  flex: 1;
`;

export const PlayerText = styled.h6`
  font-size: 1rem;
  margin: 0.25rem 0 0.25rem 0;
  padding: 0;
  font-weight: 500;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const TooltipContainer = styled.div`
  &:hover .tooltip-text {
    visibility: visible;
  }
`;

export const TooltipText = styled.span`
  visibility: hidden;
  position: absolute;
  z-index: 1;
  color: white;
  font-size: 0.85rem;
  background-color: #192733;
  border-radius: 0.5rem;

  padding: 0.35rem 0.1rem 0.35rem 0;
`;
