import { useParams } from "react-router-dom";
import { startCase } from "lodash";
import * as S from "styles/Banner.styles";
import * as T from "styles/shared";

export const EraBanner = () => {
  const { era } = useParams();
  return null;

  // eslint-disable-next-line no-unreachable
  return (
    <S.EraBannerContainer>
      <T.FlexColumnCentered>
        <S.BannerText>{startCase(era.replace("-", " "))}</S.BannerText>
      </T.FlexColumnCentered>
    </S.EraBannerContainer>
  );
};
