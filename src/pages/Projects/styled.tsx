import { Trans } from '@lingui/macro'
import styled, { DefaultTheme } from 'styled-components/macro'

import { ProjectTags } from './ProjectCard'

const handleColorType = (status: ProjectTags, theme: DefaultTheme) => {
  switch (status) {
    case ProjectTags.Design:
      return theme.text2
    case ProjectTags.Development:
      return theme.text2
    case ProjectTags.Launch:
      return theme.text2
    case ProjectTags.Work:
      return theme.text2
    default:
      return theme.text2
  }
}

function StatusText({ status }: { status: ProjectTags }) {
  switch (status) {
    case ProjectTags.Design:
      return <Trans>Design</Trans>
    case ProjectTags.Development:
      return <Trans>Develop</Trans>
    case ProjectTags.Launch:
      return <Trans>Launch</Trans>
    case ProjectTags.Work:
      return <Trans>Work</Trans>
    case ProjectTags.OpenSource:
      return <Trans>Open Source</Trans>
    default:
      return <Trans>Undetermined</Trans>
  }
}

const StyledProposalContainer = styled.span<{ status: ProjectTags }>`
  font-size: 0.825rem;
  font-weight: 600;
  padding: 4px;
  border-radius: 8px;
  color: ${({ status, theme }) => handleColorType(status, theme)};
  border: 1px solid ${({ status, theme }) => handleColorType(status, theme)};
  width: fit-content;
  justify-self: flex-end;
  text-transform: uppercase;
  flex: 0 0 100px;
  text-align: center;
`

export function ProjectTag({ status }: { status: ProjectTags }) {
  return (
    <StyledProposalContainer status={status}>
      <StatusText status={status} />
    </StyledProposalContainer>
  )
}
