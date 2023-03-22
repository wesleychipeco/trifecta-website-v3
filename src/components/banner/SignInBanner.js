import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import * as S from "styles/Banner.styles";
import * as T from "styles/shared";

export const SignInBanner = () => {
  const location = useLocation();
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const title = isAuthenticated ? "Log Out" : "Sign In";

  const loginOnClick = useCallback(() => {
    loginWithRedirect();
  }, []);

  const logoutOnClick = useCallback(() => {
    logout({ returnTo: window.location.origin });
  }, [window.location]);

  if (location.pathname.startsWith("/dynasty")) {
    return (
      <S.SignInBannerContainer
        onClick={isAuthenticated ? logoutOnClick : loginOnClick}
      >
        <T.FlexColumnCentered>
          <S.BannerText>{title}</S.BannerText>
        </T.FlexColumnCentered>
      </S.SignInBannerContainer>
    );
  }

  return null;
};
