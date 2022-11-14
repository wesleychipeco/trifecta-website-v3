import styled from "styled-components";
import { FlexRowCentered } from "./shared";

export const HomeContainer = styled.div`
  padding-top: 1rem;
  width: 90%;
`;

export const TitleContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const TitleText = styled.h1`
  z-index: 5;
  font-size: 3rem;
  margin-bottom: 0.75rem;
`;

export const ImageOpacity = styled.div`
  opacity: 0.6;
`;

export const Basketball = styled.img`
  position: absolute;
  max-width: 42%;
  max-height: 35rem;
  width: auto;
  heigh: auto;
  top: 56%;
  left: 5%;
`;

export const Baseball = styled.img`
  position: absolute;
  z-index: 2;
  max-width: 39%;
  max-height: 40rem;
  width: auto;
  heigh: auto;
  top: 55%;
  left: 51%;
`;

export const Football = styled.img`
  position: absolute;
  max-width: 50%;
  max-height: 35rem;
  width: auto;
  heigh: auto;
  top: 20%;
  left: 25%;
`;

export const Trophy = styled.img`
  position: absolute;
  z-index: 3;
  max-width: 30%;
  max-height: 50rem;
  width: auto;
  height: auto;
  top: 24%;
  left: 38%;
`;
