import styled from "styled-components";
import { MOBILE_MAX_WIDTH, PRIMARY_ORANGE } from "./global";

export const EraBannerContainer = styled.div`
  left: 7rem;
  top: 1.7rem;
  position: fixed;
  height: 3rem;
  background-color: ${PRIMARY_ORANGE};
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
  background-color: ${PRIMARY_ORANGE};
  border-radius: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${PRIMARY_ORANGE}99;
    cursor: pointer;
  }

  @media ${MOBILE_MAX_WIDTH} {
    right: 0.25rem;
    top: 0.5rem;
    height: 2rem;
    width: 5rem;
  }
`;

export const BannerText = styled.h5`
  font-size: 1.85rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
  padding: 2rem 2.5rem 2rem 2.5rem;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1.25rem;
    padding: 0;
  }
`;
