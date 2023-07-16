import styled from "styled-components";

export const HomeContainer = styled.div`
  width: 95%;
`;

export const TitleContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: pink;
`;

export const TitleText = styled.h1`
  z-index: 5;
  font-size: 3rem;
  margin-bottom: 0.75rem;
`;

export const ImageOpacity = styled.div`
  opacity: 0.7;
`;

export const HorizontalBanner = styled.img`
  position: absolute;
  width: 75%;
  height: auto;
  top: -5rem;
`;

export const Basketball = styled.img`
  position: absolute;
  max-width: 39%;
  max-height: 35rem;
  width: auto;
  heigh: auto;
  top: 60%;
  left: 51%;
`;

export const Baseball = styled.img`
  position: absolute;
  z-index: 2;
  max-width: 36%;
  max-height: 40rem;
  width: auto;
  height: auto;
  top: 59%;
  left: 13%;
`;

export const Football = styled.img`
  position: absolute;
  max-width: 47%;
  max-height: 35rem;
  width: auto;
  heigh: auto;
  top: 27%;
  left: 27%;
`;

export const Trophy = styled.img`
  position: absolute;
  z-index: 3;
  max-width: 30%;
  max-height: 50rem;
  width: auto;
  height: auto;
  top: 33%;
  left: 38%;
`;
