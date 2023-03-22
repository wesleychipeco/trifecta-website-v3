import styled from "styled-components";
import { PRIMARY_GREEN } from "./variables";

export const EraBannerContainer = styled.div`
  left: 7rem;
  top: 1.7rem;
  position: fixed;
  height: 3rem;
  background-color: ${PRIMARY_GREEN};
  border-radius: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SignInBannerContainer = styled.div`
  right: 0.75rem;
  top: 1.7rem;
  position: fixed;
  height: 3rem;
  background-color: ${PRIMARY_GREEN};
  border-radius: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    opacity: 0.5;
    cursor: pointer;
  }
`;

export const BannerText = styled.h5`
  font-size: 1.85rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
  padding: 2rem 2.5rem 2rem 2.5rem;
`;
