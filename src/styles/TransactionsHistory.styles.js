import styled from "styled-components";
import { StringTableHeaderCell } from "./StandardScreen.styles";
import {
  BACKGROUND_COLOR,
  FONT_COLOR,
  FONT_FAMILY,
  MOBILE_MAX_WIDTH,
  PRIMARY_ORANGE,
} from "./global";

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
  background-color: ${(props) => (props.isDrop ? "red" : "#3174ad")};
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
  width: 75%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media ${MOBILE_MAX_WIDTH} {
    width: 100%;
    flex-direction: row;
    justify-content: space-evenly;
    margin-bottom: 0.25rem;
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
    font-size: 0.75rem;
    text-align: center;
    width: 7.5rem;
    margin: 0;
  }
`;
