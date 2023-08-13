import styled from "styled-components";
import { MOBILE_MAX_WIDTH, MOBILE_TITLE_FONT_SIZE } from "./global";

export const TitleText = styled.h2`
  font-size: 2rem;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: ${MOBILE_TITLE_FONT_SIZE};
  }
`;

export const ScreenContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 5rem;

  @media ${MOBILE_MAX_WIDTH} {
    flex-direction: column;
  }
`;

export const StandingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 42%;

  @media ${MOBILE_MAX_WIDTH} {
    width: 100%;
    align-items: center;
  }
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
  margin-top: 2rem;

  @media ${MOBILE_MAX_WIDTH} {
    flex-direction: column;
    margin-top: 1rem;
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

  @media ${MOBILE_MAX_WIDTH} {
    margin: 0 0 1rem 0;
    padding: 0;
  }
`;

export const AnnouncementTitle = styled(TitleText)`
  margin: 0 0 0.5rem 0;

  @media ${MOBILE_MAX_WIDTH} {
    margin: 0;
    font-size: ${MOBILE_TITLE_FONT_SIZE};
    text-align: center;
  }
`;

export const Announcement = styled.div`
  display: flex;
  margin: 0 0 1rem 0;
  align-items: center;
`;

export const AnnouncementDate = styled.p`
  font-size: 1.35rem;
  width: 10rem;
  margin: 0;

  @media ${MOBILE_MAX_WIDTH} {
    width: 7rem;
    font-size: 1rem;
  }
`;

export const AnnouncementTitleText = styled.p`
  font-size: 1.35rem;
  width: 100%;
  margin: 0;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1rem;
  }
`;
