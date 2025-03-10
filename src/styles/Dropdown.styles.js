import {
  BACKGROUND_COLOR,
  FONT_COLOR,
  FONT_FAMILY,
  PRIMARY_ORANGE,
} from "./global";

export const MatchupsDropdownCustomStyles = {
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

export const StandingsDropdownCustomStyles = {
  // each option in dropdown
  option: (provided, state) => ({
    ...provided,
    backgroundColor: PRIMARY_ORANGE,
    color: FONT_COLOR,
    fontWeight: state.isSelected ? 800 : "normal",
    margin: 0,
    "&:hover": {
      opacity: 0.8,
      cursor: "pointer",
    },
    fontSize: "1.75rem",
    width: "9.5rem",
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
      cursor: "pointer",
    },
    width: "9.5rem",
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
      cursor: "pointer",
    },
    position: "absolute",
    right: "0rem",
  }),
  // remove line separator
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  // displayed value
  singleValue: (provided) => ({
    ...provided,
    fontSize: "1.75rem",
    color: FONT_COLOR,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      cursor: "pointer",
    },
  }),
  // remove white on list options
  menuList: (provided) => ({
    ...provided,
    paddingTop: 0,
    paddingBottom: 0,
    width: "9.5rem",
  }),
};

export const TradeBlockDropdownCustomStyles = {
  // each option in dropdown
  option: (provided) => ({
    ...provided,
    backgroundColor: BACKGROUND_COLOR,
    color: FONT_COLOR,
    fontWeight: "normal",
    margin: 0,
    width: "8rem",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: PRIMARY_ORANGE,
    },
    fontSize: "1.15rem",
  }),
  // overall
  control: (provided) => ({
    ...provided,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: "0.5rem",
    border: 0,
    borderColor: BACKGROUND_COLOR,
    color: FONT_COLOR,
    boxShadow: "none",
    width: "2rem",
    height: "1rem",
    "&:hover": {
      opacity: 0.8,
      cursor: "pointer",
    },
  }),
  // placeholder value
  placeholder: (provided) => ({
    ...provided,
    fontSize: "0",
    color: FONT_COLOR,
    fontFamily: FONT_FAMILY,
  }),
  // arrow icon
  dropdownIndicator: (provided) => ({
    ...provided,
    backgroundColor: PRIMARY_ORANGE,
    borderRadius: "100%",
    padding: "0.15rem",
    color: FONT_COLOR,
    "&:hover": {
      color: FONT_COLOR,
      cursor: "pointer",
      opacity: 0.6,
    },
    position: "absolute",
    top: 6,
    left: 2,
    fontSize: "1rem",
  }),
  // remove line separator
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  // displayed value
  singleValue: (provided) => ({
    ...provided,
    fontSize: "0",
    color: FONT_COLOR,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      cursor: "pointer",
    },
  }),
  // menu background
  menu: (provided) => ({
    ...provided,
    marginTop: "0rem",
    backgroundColor: BACKGROUND_COLOR,
  }),
  // remove white on menu list options
  menuList: (provided) => ({
    ...provided,
    paddingTop: 0,
    paddingBottom: 0,
    width: "8.5rem",
    border: "0.25rem solid rgba(169, 169, 169, 0.8)",
    borderRadius: "0.25rem",
    backgroundColor: BACKGROUND_COLOR,
  }),
};

export const GMDropdownCustomStyles = {
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
    width: "15rem",
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
    width: "16rem",
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

//////////////////////////////////////////////////
const MOBILE_FONT_SIZE = "1rem";
const MOBILE_WIDTH = "6rem";

export const MobileStandingsDropdownCustomStyles = {
  // each option in dropdown
  option: (provided, state) => ({
    ...provided,
    backgroundColor: PRIMARY_ORANGE,
    color: FONT_COLOR,
    fontWeight: state.isSelected ? 800 : "normal",
    margin: 0,
    "&:hover": {
      opacity: 0.8,
      cursor: "pointer",
    },
    fontSize: MOBILE_FONT_SIZE,
    width: MOBILE_WIDTH,
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
      cursor: "pointer",
    },
    width: MOBILE_WIDTH,
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
      cursor: "pointer",
    },
    position: "absolute",
    right: "0rem",
  }),
  // remove line separator
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  // displayed value
  singleValue: (provided) => ({
    ...provided,
    fontSize: MOBILE_FONT_SIZE,
    color: FONT_COLOR,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      cursor: "pointer",
    },
  }),
  // remove white on list options
  menuList: (provided) => ({
    ...provided,
    paddingTop: 0,
    paddingBottom: 0,
    width: MOBILE_WIDTH,
  }),
};

export const MobileMatchupsDropdownCustomStyles = {
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
    fontSize: MOBILE_FONT_SIZE,
    width: MOBILE_WIDTH,
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
    width: MOBILE_WIDTH,
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
    fontSize: MOBILE_FONT_SIZE,
    color: FONT_COLOR,
  }),
  // remove white on list options
  menuList: (provided) => ({
    ...provided,
    paddingTop: 0,
    paddingBottom: 0,
  }),
};
