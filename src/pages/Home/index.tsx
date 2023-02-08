import { Text } from 'rebass'
import styled from 'styled-components/macro'

export const TextStandard = styled(Text)`
  font-family: 'Satoshi', sans-serif;
  color: ${({ theme }) => theme.text1};
  font-size: 12px;
  font-weight: 500;
`
export const TextBold = styled(TextStandard)`
  font-weight: 900;
`
export const TextLight = styled(TextStandard)`
  font-weight: 400;
`

export const PageWrapper = styled.main<{ margin?: string; maxWidth?: string }>`
  position: relative;
  margin-top: ${({ margin }) => margin ?? '0px'};
  max-width: ${({ maxWidth }) => maxWidth ?? '510px'};
  width: 100%;
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 520px;
`

export default function Home() {
  // const loadedUrlParams = useDefaultsFromURLSearch()

  return (
    <>
      <PageWrapper>Chroma</PageWrapper>
    </>
  )
}
