import { capitalize } from "lodash";
import React, { useMemo, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { BASE_ROUTES, STATIC_ROUTES } from "Routes";
import {
  MatchupsDropdownCustomStyles,
  MobileMatchupsDropdownCustomStyles,
} from "styles/Dropdown.styles";
import { MOBILE_MAX_WIDTH } from "styles/global";

export const MatchupsDropdown = ({ arrayOfYears, teamNumber, year }) => {
  const [isMobile] = useState(useMediaQuery({ query: MOBILE_MAX_WIDTH }));
  const navigate = useNavigate();
  const currentlySelected = useMemo(() => {
    return {
      value: year,
      label: capitalize(year),
    };
  }, [year]);

  const onSelect = (selectedOption) => {
    navigate(
      `${STATIC_ROUTES.TrifectaHome}/${BASE_ROUTES.OwnerMatchups}/${teamNumber}/${selectedOption.value}`
    );
  };

  const options = useMemo(() => {
    return arrayOfYears.map((year) => ({
      value: year,
      label: capitalize(year),
    }));
  }, [arrayOfYears]);

  return (
    <Select
      placeholder="Switch Years"
      defaultValue={currentlySelected}
      onChange={onSelect}
      options={options}
      styles={
        isMobile
          ? MobileMatchupsDropdownCustomStyles
          : MatchupsDropdownCustomStyles
      }
      isSearchable={false}
    />
  );
};
