import { AutoColumn } from 'components/Column'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components/macro'

import MeImage from '../../assets/images/me.jpg'
import { RowBetween } from '../../components/Row'
import { useDefaultsFromURLSearch } from '../../state/swap/hooks'
import { ThemedText, Z_INDEX } from '../../theme'
import AppBody from '../AppBody'
const AlertWrapper = styled.div`
  max-width: 880px;
  width: 100%;
`

export const PageWrapper = styled.main<{ margin?: string; maxWidth?: string }>`
  position: relative;
  margin-top: ${({ margin }) => margin ?? '0px'};
  max-width: ${({ maxWidth }) => maxWidth ?? '480px'};
  width: 100%;
  // background: ${({ theme }) => theme.bg0};
  // box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 24px;
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  z-index: ${Z_INDEX.deprecated_content};
  width: 100%;
  max-width: 600px;
`

const ImageWrapper = styled.div<{ size?: number | null }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  // background-image: url(${MeImage});
  align-items: center;
  justify-content: center;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '24px')};
    width: ${({ size }) => (size ? size + 'px' : '24px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    // align-items: flex-end;
  `};
`

const HorizontalGrid = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-gap: 16px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 1fr;
  `};
  width: 100%;
  gap: 8px;
`

const TextWrapper = styled(AutoColumn)`
  max-width: 580px;
  // height: 200px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 0px 10px;
  max-width: 100%;
`};
`

const text = `
  Luke Mann is a designer and developer based in Palo Alto, CA. He is currently working on a new design system for web3 applications.
  `

export default function Writings({ history }: RouteComponentProps) {
  return (
    <>
      <PageWrapper>
        <ThemedText.Main>{`Coming soon(ish)`}</ThemedText.Main>
      </PageWrapper>
    </>
  )
}
