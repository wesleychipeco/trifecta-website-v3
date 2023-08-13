import React from "react";
import * as S from "styles/Button.styles";

export const Button = ({ title, navTo, disabled = false }) => {
  return (
    <S.Container disabled={disabled}>
      {disabled ? (
        <S.Link
          to={navTo}
          disabled={disabled}
          onClick={(e) => e.preventDefault()}
        >
          {title}
        </S.Link>
      ) : (
        <S.Link to={navTo}>{title}</S.Link>
      )}
    </S.Container>
  );
};
