import useScrollPosition from '@react-hook/window-scroll'
import useTheme from 'hooks/useTheme'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components/macro'

const HeaderFrame = styled.div<{ showBackground: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 0px;
  gap: 7px;

  position: absolute;
  width: fit-content;
  height: 177px;
  right: 71px;
  top: 90px;
  z-index: 100;
`
const StyledNavLink = styled(NavLink)`
  font-family: 'Satoshi', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  color: #4D4D4D;
  text-decoration-line: none;
  &.active {
    color: #4D4D2B
    text-decoration-line: underline;
  }
`

export default function Header() {
  // const { account, chainId } = useActiveWeb3React()

  const scrollY = useScrollPosition()

  const theme = useTheme()

  return (
    <HeaderFrame showBackground={scrollY > 70}>
      <StyledNavLink
        id={`home-nav-link`}
        to={'/'}
        isActive={(match, { pathname }) => pathname === '/' || pathname === '/home'}
      >
        Home
      </StyledNavLink>
      <StyledNavLink id={`projects-nav-link`} to={'/writings'} isActive={(match, { pathname }) => Boolean(match)}>
        Writings
      </StyledNavLink>
      {/* <StyledNavLink id={`writings-nav-link`} to={'/writings'} isActive={(match, { pathname }) => Boolean(match)}>
        Colors
      </StyledNavLink> */}
    </HeaderFrame>
  )
}
