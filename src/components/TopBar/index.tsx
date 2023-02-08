// import { MoonIcon, SunIcon } from '@heroicons/react/solid'
import { AutoRow, RowBetween, RowFixed } from 'components/Row'
import useTheme from 'hooks/useTheme'
import React from 'react'
import { useDarkModeManager } from 'state/user/hooks'
import styled from 'styled-components/macro'
import { ExternalLink, IconWrapper, ThemedText } from 'theme'

const Wrapper = styled.div<{ warning?: boolean }>`
  position: fixed;
  display: flex;
  align-items: center;
  right: 0;
  left: 0;
  bottom: 0;
  padding: 10px 20px;
  color: ${({ theme, warning }) => (warning ? theme.bg1 : theme.bg0)};
  // transition: 250ms ease color;
  z-index: 1;

  // background: ${({ theme, warning }) => (warning ? theme.bg1 : theme.black)};
  background: ${({ theme, warning }) => 'transparent'};

  ${({ theme }) => theme.mediaWidth.upToMedium`
  // display: none;
`}
`

const Item = styled(ThemedText.Main)`
  font-size: 12px;
`

const StyledLink = styled(ExternalLink)`
  font-size: 12px;
  color: ${({ theme }) => theme.text4};
`
const ToggleMenuItem = styled.button`
  background-color: transparent;

  margin-left: 5px;
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
`

const TopBar = () => {
  const theme = useTheme()
  const [darkMode, toggleDarkMode] = useDarkModeManager()
  const { white, black } = useTheme()

  return (
    <Wrapper>
      <RowBetween>
        {/* <NetworkBadge /> */}
        <AutoRow gap="6px">
          <RowFixed>
            {/* <Item color={theme.text4}>24 Hour Volume:</Item>
            <Item fontWeight="700" ml="4px" color={theme.text4}>
              $0
            </Item> */}
          </RowFixed>
        </AutoRow>
        {/* <AutoRow gap="6px" style={{ justifyContent: 'flex-end' }}> */}
        {/* <StyledLink href="https://docs.apollo-full-stack.vercel.com">Twitter</StyledLink>
          <StyledLink href="https://docs.apollo-full-stack.vercel.com">Docs</StyledLink> */}
        <ToggleMenuItem onClick={() => toggleDarkMode()}>
          {/* <div>{darkMode ? <Trans>Light Theme</Trans> : <Trans>Dark Theme</Trans>}</div> */}
          {/* {darkMode ? (
            <IconWrapper size={'14px'} stroke={theme.bg3}>
              <SunIcon opacity={0.6} color={theme.bg3} />
            </IconWrapper>
          ) : (
            <IconWrapper size={'14px'} stroke={theme.bg3}>
              <MoonIcon opacity={0.6} color={theme.bg3} />
            </IconWrapper>
          )} */}
        </ToggleMenuItem>
        {/* </AutoRow> */}
      </RowBetween>
    </Wrapper>
  )
}

export default TopBar
