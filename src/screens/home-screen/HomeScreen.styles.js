import styled from "styled-components";

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
`;

export const ImageOpacity = styled.div`
  opacity: 0.6;
`;

export const Basketball = styled.img`
  position: absolute;
  max-width: 45%;
  max-height: 35rem;
  width: auto;
  heigh: auto;
  top: 51%;
  left: 4%;
`;

export const Baseball = styled.img`
  position: absolute;
  z-index: 2;
  max-width: 40%;
  max-height: 40rem;
  width: auto;
  heigh: auto;
  top: 50%;
  left: 50%;
`;

export const Football = styled.img`
  position: absolute;
  max-width: 50%;
  max-height: 35rem;
  width: auto;
  heigh: auto;
  top: 15%;
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
  left: 37%;
`;
