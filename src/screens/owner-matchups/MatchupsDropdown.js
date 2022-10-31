import { capitalize } from "lodash";
import React, { useMemo } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { BASE_ROUTES } from "Routes";
import {
  BACKGROUND_COLOR,
  FONT_COLOR,
  FONT_FAMILY,
  PRIMARY_GREEN,
} from "styles/variables";

export const MatchupsDropdown = ({ arrayOfYears, teamNumber, year }) => {
  const navigate = useNavigate();
  const currentlySelected = useMemo(() => {
    return {
      value: year,
      label: capitalize(year),
    };
  }, [year]);

  const onSelect = (selectedOption) => {
    navigate(
      `${BASE_ROUTES.OwnerMatchups}/${teamNumber}/${selectedOption.value}`
    );
  };

  const options = useMemo(() => {
    return arrayOfYears.map((year) => ({
      value: year,
      label: capitalize(year),
    }));
  }, [arrayOfYears]);

  const customStyles = useMemo(() => {
    return {
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
  }, []);

  return (
    <Select
      placeholder="Switch Years"
      defaultValue={currentlySelected}
      onChange={onSelect}
      options={options}
      styles={customStyles}
      isSearchable={false}
    />
  );
};
