import styled from "styled-components";
import { PRIMARY_GREEN } from "./variables";

export const BannerContainer = styled.div`
  position: fixed;
  height: 3rem;
  right: 0.75rem;
  top: 0.75rem;
  background-color: ${PRIMARY_GREEN};
  border-radius: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BannerText = styled.h5`
  font-size: 1.85rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
  padding: 2rem 2.5rem 2rem 2.5rem;
`;
