import {
  BACKGROUND_COLOR,
  FONT_COLOR,
  FONT_FAMILY,
  PRIMARY_GREEN,
} from "./variables";

export const MatchupsDropdownCustomStyles = {
  // each option in dropdown
  option: (provided, state) => ({
    ...provided,
    backgroundColor: PRIMARY_GREEN,
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
    backgroundColor: PRIMARY_GREEN,
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
  // container: (provided) => ({
  //   ...provided,
  //   width: "15rem",
  // }),
  // each option in dropdown
  option: (provided, state) => ({
    ...provided,
    backgroundColor: PRIMARY_GREEN,
    color: FONT_COLOR,
    fontWeight: state.isSelected ? 800 : "normal",
    margin: 0,
    "&:hover": {
      opacity: 0.8,
    },
    fontSize: "1.75rem",
  }),
  // overall
  control: (provided) => ({
    ...provided,
    backgroundColor: PRIMARY_GREEN,
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
    fontSize: "1.75rem",
    color: FONT_COLOR,
  }),
  // remove white on list options
  menuList: (provided) => ({
    ...provided,
    paddingTop: 0,
    paddingBottom: 0,
    width: "9.5rem",
  }),
};
