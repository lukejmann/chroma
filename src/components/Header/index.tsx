import useScrollPosition from "@react-hook/window-scroll";
import useTheme from "hooks/useTheme";
import { NavLink } from "react-router-dom";
import styled from "styled-components/macro";

import Logo from "../../assets/images/chromaTempLogo.png";

const HeaderFrame = styled.div<{ showBackground: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  gap: 7px;
`;

const LogoText = styled.div`
  font-family: "Satoshi", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  color: ${({ theme }) => theme.text1};
`;

const ImageWrapper = styled.div<{ size?: number | null }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > img,
  span {
    height: ${({ size }) => (size ? size + "px" : "100%")};
    width: ${({ size }) => (size ? size + "px" : "100%")};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    // align-items: flex-end;
  `};
`;

export default function Header() {
  // const { account, chainId } = useActiveWeb3React()

  const scrollY = useScrollPosition();

  const theme = useTheme();

  return (
    <HeaderFrame showBackground={scrollY > 70}>
      <ImageWrapper size={21}>
        <img src={Logo} alt="logo" />
      </ImageWrapper>
      <LogoText>Chroma</LogoText>
    </HeaderFrame>
  );
}
