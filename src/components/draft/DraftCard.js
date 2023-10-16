import * as S from "styles/DraftCard.styles";

export const DraftCard = ({ data, sport, isCompleted }) => {
  const { round, pick, overallPick, player = "", position, team } = data;
  const playerNameArray = player.split(" ");
  const playerName =
    playerNameArray.length > 1
      ? `${playerNameArray[0].charAt(0)}. ${playerNameArray[1]}`
      : playerNameArray[0];

  return (
    <S.PaddingContainer sport={sport} position={position}>
      <S.DraftPickNumberText>{`${round}-${pick} (${overallPick})`}</S.DraftPickNumberText>

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
  );
};
