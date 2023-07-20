import styled from "styled-components";
import { MOBILE_MAX_WIDTH } from "./global";

export const TitleText = styled.h2`
  font-size: 2rem;
`;

export const ScreenContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 5rem;
`;

export const StandingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 42%;
`;

export const StandingsTitle = styled(TitleText)`
  margin: 0rem;
  text-align: center;
`;

export const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AnnouncementsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 2rem 0 0 0;

  @media ${MOBILE_MAX_WIDTH} {
    background-color: green;
  }
`;

export const AnnouncementContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AnnouncementTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 2rem;
  padding-left: 1.5rem;
`;

export const AnnouncementTitle = styled(TitleText)`
  margin: 0 0 0.5rem 0;
`;

export const Announcement = styled.div`
  display: flex;
  margin: 0 0 1rem 0;
  align-items: center;
`;

export const AnnouncementDate = styled.p`
  font-size: 1.5rem;
  width: 10rem;
  margin: 0;
`;

export const AnnouncementTitleText = styled.p`
  font-size: 1.5rem;
  width: 100%;
  margin: 0;
`;
