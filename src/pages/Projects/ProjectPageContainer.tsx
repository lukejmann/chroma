import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { ArrowLeft } from 'react-feather'
import styled from 'styled-components/macro'

import { AutoColumn } from '../../components/Column'
import { DataCard } from '../../components/earn/styled'
import { RowBetween } from '../../components/Row'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import { ExternalLink, StyledInternalLink, ThemedText } from '../../theme'
import { Project } from './ProjectCard'

const PageWrapper = styled(AutoColumn)`
  width: 100%;
`

const ProposalInfo = styled(AutoColumn)`
  background: ${() => 'transparent'};
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  max-width: 640px;
  width: 100%;
`

const ArrowWrapper = styled(StyledInternalLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  color: ${({ theme }) => theme.text1};

  a {
    color: ${({ theme }) => theme.text1};
    text-decoration: none;
  }
  :hover {
    text-decoration: none;
  }
`

export const SepLine = styled.div<{ color?: string }>`
  width: 100%;
  height: 1px;
  background-color: ${({ color }) => color ?? '#e6e6e6'};
`

type ProjectPageContainerProps = React.PropsWithChildren<{
  project: Project
}>

export default function ProjectPageContainer({ project, children }: ProjectPageContainerProps) {
  return (
    <>
      <PageWrapper gap="lg" justify="center">
        <ProposalInfo gap="8px" justify="start">
          <RowBetween style={{ width: '100%' }}>
            <ArrowWrapper to="/projects">
              <Trans>
                <ArrowLeft size={20} /> Projects
              </Trans>
            </ArrowWrapper>
          </RowBetween>
          <ThemedText.SanLarge>{project.title}</ThemedText.SanLarge>
          <SepLine color={project.color}></SepLine>
          {children}
        </ProposalInfo>
      </PageWrapper>
      <SwitchLocaleLink />
    </>
  )
}
