import { capitalize } from "lodash";
import React, { useMemo, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { BASE_ROUTES, STATIC_ROUTES } from "Routes";
import {
  MobileStandingsDropdownCustomStyles,
  StandingsDropdownCustomStyles,
} from "styles/Dropdown.styles";
import { MOBILE_MAX_WIDTH } from "styles/global";
import { BASEBALL, BASKETBALL, FOOTBALL } from "Constants";

const SPORTS_ARRAY = ["trifecta", BASKETBALL, BASEBALL, FOOTBALL];

export const StandingsDropdown = ({ year }) => {
  const [isMobile] = useState(useMediaQuery({ query: MOBILE_MAX_WIDTH }));
  const navigate = useNavigate();
  const currentlySelected = useMemo(() => {
    return {
      value: year,
      label: year,
    };
  }, [year]);

  const onSelect = (selectedOption) => {
    const routeString = `${selectedOption.label}Standings`;
    navigate(
      `${STATIC_ROUTES.TrifectaHome}/${BASE_ROUTES[routeString]}/${year}`
    );
  };

  const options = useMemo(
    () =>
      SPORTS_ARRAY.map((sport) => ({
        value: sport,
        label: capitalize(sport),
      })),
    []
  );

  return (
    <Select
      placeholder="Switch Years"
      defaultValue={currentlySelected}
      onChange={onSelect}
      options={options}
      styles={
        isMobile
          ? MobileStandingsDropdownCustomStyles
          : StandingsDropdownCustomStyles
      }
      isSearchable={false}
    />
  );
};
