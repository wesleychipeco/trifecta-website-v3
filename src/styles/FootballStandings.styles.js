import styled from "styled-components";
import { TableBodyCell } from "styles/Table.styles";
import { PRIMARY_GREEN } from "styles/variables";

export const WeeksPointsTableBodyCell = styled(TableBodyCell)`
  width: 2rem;
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;
  background-color: ${(props) =>
    props.win === "true" ? `${PRIMARY_GREEN}` : "transparent"};
`;