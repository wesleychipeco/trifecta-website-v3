import { capitalize } from "lodash";
import React, { useMemo } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { BASE_ROUTES } from "Routes";
import { StandingsDropdownCustomStyles } from "styles/Dropdown.styles";

const SPORTS_ARRAY = ["trifecta", "basketball", "baseball", "football"];

export const StandingsDropdown = ({ year }) => {
  const navigate = useNavigate();
  const currentlySelected = useMemo(() => {
    return {
      value: year,
      label: year,
    };
  }, [year]);

  const onSelect = (selectedOption) => {
    const routeString = `${selectedOption.label}Standings`;
    navigate(`${BASE_ROUTES[routeString]}/${year}`);
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
      styles={StandingsDropdownCustomStyles}
      isSearchable={false}
    />
  );
};
