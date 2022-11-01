import { capitalize } from "lodash";
import React, { useMemo } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { BASE_ROUTES } from "Routes";
import { MatchupsDropdownCustomStyles } from "styles/Dropdown.styles";

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

  return (
    <Select
      placeholder="Switch Years"
      defaultValue={currentlySelected}
      onChange={onSelect}
      options={options}
      styles={MatchupsDropdownCustomStyles}
      isSearchable={false}
    />
  );
};
