import * as S from "styles/DraftCard.styles";
import * as T from "styles/DraftBoard.styles";
import * as X from "styles/shared";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const DraftCard = ({ data, sport, isCompleted }) => {
  const {
    round,
    pick,
    overallPick,
    player = "",
    position,
    team,
    tradedTo = false,
    tradedFrom = false,
    fantasyTeam,
  } = data;
  const playerNameArray = player.split(" ");
  const playerName =
    playerNameArray.length > 1
      ? `${playerNameArray[0].charAt(0)}. ${playerNameArray[1]}`
      : playerNameArray[0];

  const nonCompletedText =
    round && overallPick ? `${round}-${pick} (${overallPick})` : pick;
  return (
    <>
      <S.PaddingContainer>
        <S.DraftPickNumberText>{nonCompletedText}</S.DraftPickNumberText>

        {isCompleted && (
          <>
            <S.ExtraContainer>
              <S.TooltipContainer className="hover-text">
                <S.PlayerText>{`${playerName}`}</S.PlayerText>
                <S.TooltipText className="tooltip-text">{player}</S.TooltipText>
              </S.TooltipContainer>
            </S.ExtraContainer>
            <S.DraftPickNumberText>{`${position} - ${team}`}</S.DraftPickNumberText>
          </>
        )}
      </S.PaddingContainer>

      {tradedTo && (
        <X.FlexRowStart>
          <S.PaddingContainer2 style={{ width: "60%" }}>
            <X.FlexColumnStart>
              <S.ExtraContainer>
                <S.PlayerText>{`to ${tradedTo}`}</S.PlayerText>
                <S.DraftPickNumberText>{`via ${fantasyTeam}`}</S.DraftPickNumberText>
              </S.ExtraContainer>
            </X.FlexColumnStart>
          </S.PaddingContainer2>
          <S.PaddingContainer2 style={{ width: "40%" }}>
            <X.FlexColumnStart>
              <FontAwesomeIcon icon="fa-handshake" size="xl" />
            </X.FlexColumnStart>
          </S.PaddingContainer2>
        </X.FlexRowStart>
      )}

      {tradedFrom && (
        <T.PickPickContainer fantasyTeam={fantasyTeam}>
          <X.FlexRowStart>
            <S.PaddingContainer2 style={{ width: "60%" }}>
              <X.FlexColumnStart>
                <S.ExtraContainer>
                  <S.PlayerText>{`to ${fantasyTeam}`}</S.PlayerText>
                  <S.DraftPickNumberText>{`via ${tradedFrom}`}</S.DraftPickNumberText>
                </S.ExtraContainer>
              </X.FlexColumnStart>
            </S.PaddingContainer2>
            <S.PaddingContainer2 style={{ width: "40%" }}>
              <X.FlexColumnStart>
                <FontAwesomeIcon icon="fa-handshake" size="xl" />
              </X.FlexColumnStart>
            </S.PaddingContainer2>
          </X.FlexRowStart>
        </T.PickPickContainer>
      )}
    </>
  );
};
