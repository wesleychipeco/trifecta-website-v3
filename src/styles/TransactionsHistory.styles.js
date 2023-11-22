import styled from "styled-components";
import { StringTableHeaderCell } from "./StandardScreen.styles";
import {
  BACKGROUND_COLOR,
  FONT_COLOR,
  FONT_FAMILY,
  MOBILE_MAX_WIDTH,
  PRIMARY_ORANGE,
} from "./global";
import { FlexColumnCentered } from "./shared";

export const TransactionsHistoryHomeContainer = styled.div`
  width: 90%;
`;

export const TransactionsHistoryHomeRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0 3rem 0;
`;

export const TransactionsHistoryOuterContainer = styled(FlexColumnCentered)`
  width: 80%;

  @media ${MOBILE_MAX_WIDTH} {
    width: 100%;
  }
`;

export const HeaderText = styled.p`
  margin: 0;
  padding: 0;
`;

export const PlayerTableHeaderCell = styled(StringTableHeaderCell)`
  width: 24rem;

  @media ${MOBILE_MAX_WIDTH} {
    width: 16rem;
    padding: 0.5rem;
  }
`;

export const IconContainer = styled.div`
  background-color: ${(props) => (props.isDrop ? "red" : "green")};
  border-radius: 100%;
  margin-right: 0.5rem;
  padding: 0.25rem 0.24rem 0.25rem 0.24rem;
  width: 1rem;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const InputContainer = styled.div`
  display: flex;
  width: 90%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media ${MOBILE_MAX_WIDTH} {
    flex-direction: column;
    justify-content: space-evenly;
    margin-bottom: 0.5rem;
  }
`;

export const TransactionsHistoryDropdownCustomStyles = {
  // each option in dropdown
  option: (provided, state) => ({
    ...provided,
    backgroundColor: PRIMARY_ORANGE,
    color: FONT_COLOR,
    fontWeight: state.isSelected ? 800 : "normal",
    margin: 0,
    "&:hover": {
      opacity: 0.8,
    },
    fontSize: "1.25rem",
  }),
  // overall
  control: (provided) => ({
    ...provided,
    backgroundColor: PRIMARY_ORANGE,
    borderRadius: "0.5rem",
    border: 0,
    borderColor: BACKGROUND_COLOR,
    color: FONT_COLOR,
    boxShadow: "none",
    "&:hover": {
      opacity: 0.8,
    },
  }),
  // placeholder value
  placeholder: (provided) => ({
    ...provided,
    color: FONT_COLOR,
    fontFamily: FONT_FAMILY,
  }),
  // arrow icon
  dropdownIndicator: (provided) => ({
    ...provided,
    color: FONT_COLOR,
    "&:hover": {
      color: FONT_COLOR,
    },
  }),
  // remove line separator
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  // displayed value
  singleValue: (provided) => ({
    ...provided,
    fontSize: "1.25rem",
    color: FONT_COLOR,
  }),
  // remove white on list options
  menuList: (provided) => ({
    ...provided,
    paddingTop: 0,
    paddingBottom: 0,
  }),
};

export const TextInput = styled.input`
  font-family: ${FONT_FAMILY};
  font-size: 1.25rem;
  border-radius: 0.75rem;
  margin-right: 5rem;
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;
  outline: none;
  border: 3px solid black;

  &:focus {
    border: 3px solid ${PRIMARY_ORANGE};
  }

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1rem;
    text-align: center;
    width: 75%;
    margin: 0;
  }
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
  top: 0;
  left: 8rem;
  max-width: 12rem;

  padding: 0.35rem;
`;
