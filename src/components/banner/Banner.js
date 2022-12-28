import { startCase } from "lodash";
import { useParams } from "react-router-dom";
import * as S from "styles/Banner.styles";
import * as T from "styles/shared";

export const Banner = () => {
  const { era } = useParams();

  return (
    <S.BannerContainer>
      <T.FlexColumnCentered>
        <S.BannerText>{startCase(era.replace("-", " "))}</S.BannerText>
      </T.FlexColumnCentered>
    </S.BannerContainer>
  );
};
