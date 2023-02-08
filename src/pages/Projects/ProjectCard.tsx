import { BaseButton } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { AutoRow, RowBetween } from 'components/Row'
import { AnimatePresence, motion } from 'framer-motion'
import useTheme from 'hooks/useTheme'
import { lighten, transparentize } from 'polished'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import styled, { keyframes } from 'styled-components/macro'
import { ThemedText } from 'theme'

import { ReactComponent as LongArrow } from '../../assets/images/longArrow.svg'
import { ProjectTag } from './styled'

const YieldCardContainer = styled(motion.li)`
  margin: 20px 0px 0px 0px;
  margin-block-end: 0px;
  list-style-type: none;
  // width: 360px;
`

const CardContainer = styled.div`
  perspective: 2000px;
`

export const shimmerKeyframe = (color = 'rgba(0,0,0,0)') => keyframes`
    0% {
        box-shadow: ${color}66 0px 0px 70px;
    }
    50% {
        box-shadow: ${color}29 0px 0px 70px;
    }
    100% {
        box-shadow: ${color}66 0px 0px 70px;
    }
`

export const animatedGradientKeyframe = () => keyframes`
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}`

const TopContainer = styled.div<{ color: string }>`
  // display: flex;
  position: relative;
  // justify-content: space-between;
  width: calc(100% + 32px);
  // height: 120px;
  margin: -16px;
  padding: 16px;
  margin-bottom: 0;
  border-radius: 4px 4px 0px 0px;

  background: linear-gradient(90deg, ${(props) => props.color}05 1.04%, ${(props) => props.color}30 98.99%);

  background-size: 200% 200%;

  // -webkit-animation: ${({ color }) => ` ${shimmerKeyframe(color)}`} 6s ease infinite;
  // -moz-animation: ${({ color }) => ` ${shimmerKeyframe(color)}`} 6s ease infinite;
  // animation: ${({ color }) => ` ${shimmerKeyframe(color)}`} 6s ease infinite;
`

const ProductCard = styled(motion.div)<{ color: string }>`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  // background-color: ${({ theme }) => theme.bg2};
  background: linear-gradient(90deg, ${(props) => props.color}05 1.04%, ${(props) => props.color}30 98.99%);

  border: 2px solid ${({ theme, color }) => lighten(0.2, color)};
  border-radius: 4px;
  transition: 0.22s box-shadow ease-out, 0.22s border ease-out;
  width: 100%;
  position: relative;
  // min-height: 500px;
  padding: 16px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    width: 100%;
  `}
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
  `}

  &:hover {
    box-shadow: ${(props) => props.color}66 0px 0px 70px;
    border: 2px solid ${(props) => transparentize(0.5, props.color)};

    ${TopContainer} {
      background: linear-gradient(90deg, ${(props) => props.color}15 1.04%, ${(props) => props.color}45 98.99%);

      background-size: 200% 200%;

      -webkit-animation: ${animatedGradientKeyframe} 2s ease infinite;
      -moz-animation: ${animatedGradientKeyframe} 2s ease infinite;
      animation: ${animatedGradientKeyframe} 2s ease infinite;
    }
  }
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  margin-left: -16px;
  margin-right: -16px;
`

export enum ProjectTags {
  Design = 'Design',
  Development = 'Development',
  Launch = 'Launch',
  Work = 'Work',
  OpenSource = 'OpenSource',
}

const TagRow = styled(AutoRow)`
  margin-top: 8px;
  gap: 6px;
`
const DescriptionRow = styled(AutoRow)`
  margin-top: 8px;
  gap: 6px;
`

const LongArrowIcon = styled(LongArrow)<{ highlighted: boolean }>`
  path {
    stroke: ${({ theme }) => theme.text2};
    fill: ${({ theme, highlighted }) => (highlighted ? theme.text1 : theme.text3)};
  }
  width: 24px;
  height: 24px;
`

const StyledImg = styled.img`
  width: calc(100% + 32px);
  height: 100%;
  object-fit: cover;
  margin-left: -16px;
  margin-right: -16px;
  // border-radius: 4px;
`

export type Project = {
  color: string
  link: string
  title: string
  coverImage: string
  tags: ProjectTags[]
  description: string
}

export default function ProjectCard({ project }: { project: Project }) {
  const [buttonIsHovered, setButtonIsHovered] = React.useState(false)
  const [mintCardIsHovered, setMintCardIsHovered] = React.useState(false)

  const { title, color, link, coverImage, tags, description } = project
  const history = useHistory()

  return (
    <YieldCardContainer
      onMouseEnter={() => {
        setMintCardIsHovered(true)
      }}
      onMouseLeave={() => {
        setMintCardIsHovered(false)
      }}
    >
      <CardContainer>
        <AnimatePresence exitBeforeEnter initial={false}>
          <ProductCard
            key={link}
            transition={{
              duration: 0.5,
              type: 'keyframes',
              ease: 'linear',
            }}
            initial={{
              transform: 'rotateY(90deg)',
            }}
            animate={{
              transform: 'rotateY(0deg)',
            }}
            exit={{
              transform: 'rotateY(-90deg)',
            }}
            onClick={() => {
              history.push(`${link}`)
            }}
            role="button"
            color={color}
          >
            <TopContainer color={color}>
              <RowBetween>
                <ThemedText.LargeHeader>{title}</ThemedText.LargeHeader>
                <LongArrowIcon highlighted={mintCardIsHovered}></LongArrowIcon>
              </RowBetween>
              <TagRow>
                {tags.map((tag) => (
                  <ProjectTag status={tag} key={tag} />
                ))}
              </TagRow>
            </TopContainer>
            {/* <ImageContainer> */}
            <StyledImg
              // style={{
              //   // maxHeight: '200px',
              //   objectFit: 'fill',
              //   width: '356px',
              //   // maxWidth: '100%',
              //   marginLeft: '-16px',
              //   marginRight: '-16px',
              // }}
              src={coverImage}
              alt={title}
            />
            {/* </ImageContainer> */}
            <DescriptionRow>
              <ThemedText.Body>{description}</ThemedText.Body>
            </DescriptionRow>
          </ProductCard>
        </AnimatePresence>
      </CardContainer>
    </YieldCardContainer>
  )
}
