import { AutoColumn } from 'components/Column'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components/macro'

import ArtByMannCover from '../../assets/images/artbymannCover2.png'
import BlockshotCover from '../../assets/images/blockshotCover.png'
import CarmelCover from '../../assets/images/carmelCover.png'
import DetachCover from '../../assets/images/detachCover.png'
import HPDSCover from '../../assets/images/hpdsCover.png'
import MeImage from '../../assets/images/me.jpg'
import MintUICover from '../../assets/images/mintUICover.png'
import PortalsCover from '../../assets/images/portalsCover.png'
import ShreddersCover from '../../assets/images/shreddersCover.png'
import { RowBetween } from '../../components/Row'
import { useDefaultsFromURLSearch } from '../../state/swap/hooks'
import { ThemedText, Z_INDEX } from '../../theme'
import AppBody from '../AppBody'
import ProjectCard, { ProjectTags } from './ProjectCard'
const AlertWrapper = styled.div`
  max-width: 880px;
  width: 100%;
`

export const PageWrapper = styled.main<{ margin?: string; maxWidth?: string }>`
  position: relative;
  margin-top: ${({ margin }) => margin ?? '0px'};
  // max-width: ${({ maxWidth }) => maxWidth ?? '480px'};
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
  max-width: 1100px;
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
  grid-template-columns: 1fr 1fr;
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

export const Grid = styled(AutoColumn)`
  display: grid;
  height: 100%;
  width: 100%;

  padding-top: 0px;
  position: relative;
  top: 0;

  align-items: start;
  align-content: space-between;
  grid-template-columns: 1fr 1fr 1fr;

  grid-gap: 20px;

  // overflow-x: visible !important;

  ${({ theme }) => theme.mediaWidth.upToLarge`
  grid-template-columns: 1fr 1fr;
  padding-left: 50px;
  padding-right: 50px;
`};
  ${({ theme }) => theme.mediaWidth.upToMedium`
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  
`};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  grid-template-columns: 1fr ;
  padding: 10px 10px;
`};
`

export const CarmelProject = {
  title: 'Carmel',
  link: '/carmel',
  coverImage: CarmelCover,
  color: '#FECB48',
  tags: [ProjectTags.Design, ProjectTags.Development],
  description: 'Developed the first social layer built on top of Solana',
}

export const Blockshot = {
  title: 'Blockshot',
  link: '/blockshot',
  coverImage: BlockshotCover,
  color: '#AE5F58',
  tags: [ProjectTags.Design, ProjectTags.Development],
  description: 'Simple application to show all new Ethereum mints each block.',
}

export const PortalsProject = {
  title: 'Portals',
  link: '/portals',
  coverImage: PortalsCover,
  color: '#FB2643',
  tags: [ProjectTags.Launch, ProjectTags.Design, ProjectTags.Development],
  description: 'A generative art NFT project',
}

export const DetachProject = {
  title: 'Detach',
  link: '/detach',
  coverImage: DetachCover,
  color: '#7B6AA0',
  tags: [ProjectTags.Design, ProjectTags.Development],
  description: 'An iOS app for distraction-free time.',
}

export const MintUIProject = {
  title: 'MintUI',
  link: '/mintui',
  coverImage: MintUICover,
  color: '#2562EC',
  tags: [ProjectTags.Development, ProjectTags.OpenSource],
  description: 'An open source minting tool for Metaplex NFTs',
}

export const ShreddersDigestProject = {
  title: 'Shredders Digest',
  link: '/shredders',
  coverImage: ShreddersCover,
  color: '#FECB48',
  tags: [ProjectTags.Work, ProjectTags.Design],
  description: 'Helped lead design at a clothing company',
}

export const HPDSProject = {
  title: 'Stanford HCI Research',
  link: '/hpds',
  coverImage: HPDSCover,
  color: '#FECB48',
  tags: [ProjectTags.Design, ProjectTags.Development, ProjectTags.Work],
  description: 'Design Research @ Stanford',
}

export const ArtByMannProject = {
  title: 'Art By Mann',
  link: '/abm',
  coverImage: ArtByMannCover,
  color: '#FFFFFF',
  tags: [ProjectTags.Design, ProjectTags.Development],
  description: 'Moving portraits generated from the latent space of a neural network',
}

export default function Projects({ history }: RouteComponentProps) {
  // const loadedUrlParams = useDefaultsFromURLSearch()

  return (
    <>
      <PageWrapper>
        <Grid>
          <ProjectCard project={CarmelProject} />
          <ProjectCard project={Blockshot} />
          <ProjectCard project={PortalsProject} />

          <ProjectCard project={MintUIProject} />
          <ProjectCard project={DetachProject} />
          <ProjectCard project={ArtByMannProject} />

          <ProjectCard project={ShreddersDigestProject} />

          <ProjectCard project={HPDSProject} />
        </Grid>
      </PageWrapper>
    </>
  )
}
