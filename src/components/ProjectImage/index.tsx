import Modal from 'components/Modal'
import { useState } from 'react'
import styled from 'styled-components/macro'

export const StyledImg = styled.img<{ clickable?: boolean; size: string }>`
  width: ${({ size }) => size};
  // height: ${({ size }) => size};
  // border-radius: ${({ size }) => size};
  border-radius: 0;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.035);
  // background-color: ${({ theme }) => theme.white};
  box-shadow: ${({ clickable }) => (clickable ? 'rgba(37, 41, 46, 0.1) 0px 8px 20px;' : 'none')};
  :hover {
    cursor: ${({ clickable }) => (clickable ? 'pointer' : 'none')};
    transform: ${({ clickable }) => (clickable ? 'scale(1.01)' : 'none')};
  }
  transition: ${({ clickable }) => (clickable ? ' all 0.2s ease-in-out' : 'none')};
`
export const StyledVideo = styled.video<{ clickable?: boolean; size: string }>`
  width: ${({ size }) => size};
  // height: ${({ size }) => size};
  // border-radius: ${({ size }) => size};
  // autoplay: true;
  border-radius: 0;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.035);
  background-color: ${({ theme }) => theme.white};
  box-shadow: ${({ clickable }) => (clickable ? 'rgba(37, 41, 46, 0.1) 0px 8px 20px;' : 'none')};
  :hover {
    cursor: ${({ clickable }) => (clickable ? 'pointer' : 'none')};
    transform: ${({ clickable }) => (clickable ? 'scale(1.01)' : 'none')};
  }
  transition: ${({ clickable }) => (clickable ? ' all 0.2s ease-in-out' : 'none')};
`

const Wrapper = styled.div`
  position: relative;
  padding: 8px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding: 0px;

`}
`
const WrapperButton = styled(Wrapper)`
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

function ImageModal({
  isOpen,
  src,
  onConfirm,
  onDismiss,
  size,
}: {
  isOpen: boolean
  src: string
  onConfirm: () => void
  onDismiss: () => void
  size?: string
}) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={900}>
      {!src.includes('mp4') ? (
        <StyledImg src={src} size={size ?? '100%'} />
      ) : (
        <StyledVideo autoPlay src={src} size={size ?? '100%'} />
      )}
    </Modal>
  )
}

export default function ProjectImage({
  src,
  size,
  clickable = true,
  modalSize = '100%',
}: {
  src: string
  size: string
  clickable?: boolean
  modalSize?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const onClick = () => {
    setIsOpen(true)
  }
  return (
    <>
      {!src.includes('mp4') ? (
        <StyledImg src={src} clickable={clickable} size={size} onClick={onClick}></StyledImg>
      ) : (
        <StyledVideo autoPlay src={src} clickable={clickable} size={size} onClick={onClick}></StyledVideo>
      )}
      <ImageModal
        size={modalSize}
        isOpen={isOpen}
        src={src}
        onConfirm={() => setIsOpen(false)}
        onDismiss={() => setIsOpen(false)}
      />
    </>
  )
}
