import { ArrowRight } from "react-feather";
import { NavLink } from "react-router-dom";
import { Text } from "rebass";
import { useIsDarkMode } from "state/user/hooks";
import styled from "styled-components/macro";
import { IconWrapper } from "theme";

export const TextStandard = styled(Text)`
  font-family: "Satoshi", sans-serif;
  color: ${({ theme }) => theme.black};
  font-size: 12px;
  font-weight: 500;
`;
export const TextBold = styled(TextStandard)`
  font-weight: 900;
`;
export const TextLight = styled(TextStandard)`
  font-weight: 400;
`;

export const PageWrapper = styled.main<{ margin?: string; maxWidth?: string }>`
  position: relative;
  margin-top: ${({ margin }) => margin ?? "0px"};
  max-width: ${({ maxWidth }) => maxWidth ?? "510px"};
  width: 100%;
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 520px;
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

const TopRowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 40px;
`;

const TopRowTextColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0px;
  width: 337px;
  gap: 6px;
  max-width: 100%;
`;

const CurrentlyWorkingOnWrapper = styled.div`
  margin-top: 30px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;

  color: ${({ theme }) => theme.text1};
`;

const SubtleLink = styled.a`
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.text1};
  text-decoration-line: underline;
`;

const WorkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export default function Home() {
  // const loadedUrlParams = useDefaultsFromURLSearch()

  const darkMode = useIsDarkMode();

  return (
    <>
      <PageWrapper>
        <TopRowWrapper>
          <ImageWrapper size={121}></ImageWrapper>
          <TopRowTextColumn>
            <TextStandard as={"span"}>
              You’ve reached the homepage of{" "}
              <TextBold as={"span"}>{`Luke Mann`}</TextBold>
              {`!`}
            </TextStandard>
            <TextStandard as={"span"}>
              I’m a student and researcher at{" "}
              <TextBold as={"span"}>{` Stanford `}</TextBold> where I’m pursuing
              a double major in{" "}
              <TextBold as={"span"}>{`Computer Science (AI track) `}</TextBold>
              and
              <TextBold as={"span"}>{` Design (AI/UX track) `}</TextBold>
            </TextStandard>
            <TextStandard as={"span"}>
              My sole objective is to create technology that{" "}
              <TextBold as={"span"}>{` feels like magic`}</TextBold>
              {"."}
            </TextStandard>
          </TopRowTextColumn>
        </TopRowWrapper>
        <CurrentlyWorkingOnWrapper>
          Currently I’m working on:
          <ul style={{ marginTop: 0 }}>
            <li>
              {/* open in new */}
              <SubtleLink href="https://ziggy.com" target="_blank">
                Ziggy
              </SubtleLink>
            </li>
            <li>RLHF (Reinforcement Learning from Human Feedback) research</li>
            <li>Classes</li>
          </ul>
        </CurrentlyWorkingOnWrapper>
        <TextBold style={{ marginTop: "30px", marginBottom: "8px" }}>
          Past Work
        </TextBold>
        <WorkList></WorkList>
      </PageWrapper>
    </>
  );
}

interface WorkSectionProps {
  title: string;
  subtitle?: string;
  image?: string;
  link: string;
  linkIsExternal?: boolean;
}

const WorkSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 7px;
`;

const WorkSectionTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 3px;
`;

const WorkSectionContentWrapper = styled.div`
  box-sizing: border-box;

  /* Auto layout */

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 5.31536px 3.98652px;
  gap: 4px;

  width: 100%;
  max-height: 351.5px;

  background: ${({ theme }) => theme.bg0};
  border: 1.32884px solid ${({ theme }) => theme.bg3};
  border-radius: 9.30189px;
`;

const GoToButton = styled.a`
  box-sizing: border-box;

  /* Auto layout */

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5.31536px 171.42px;
  gap: 13.29px;

  width: 100%;
  height: 39.87px;

  background: ${({ theme }) => theme.bg3};
  border-radius: 8px;

  text-decoration: none;
  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.text1};
  }
`;

const CoverWrapper = styled.div`
  background: ${({ theme }) => theme.bg4};
  border-radius: 9.30189px;
  overflow: hidden;

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
`;

const WorkSection = ({
  title,
  subtitle,
  image,
  link,
  linkIsExternal,
}: WorkSectionProps) => {
  return (
    <WorkSectionWrapper>
      <WorkSectionTextWrapper>
        <TextStandard as={"span"}>{title}</TextStandard>
        {subtitle && <TextLight as={"span"}>{subtitle}</TextLight>}
      </WorkSectionTextWrapper>
      <WorkSectionContentWrapper>
        <CoverWrapper>
          <ImageWrapper size={null}>
            <img src={image} alt="logo" />
          </ImageWrapper>
        </CoverWrapper>
        <GoToButton href={link} target={linkIsExternal ? "_blank" : "_self"}>
          <TextStandard as={"span"}>
            {linkIsExternal ? "Go to site" : "Go to page"}
            {/* <ArrowRight size={12} /> */}
          </TextStandard>
        </GoToButton>
      </WorkSectionContentWrapper>
    </WorkSectionWrapper>
  );
};
