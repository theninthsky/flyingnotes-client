import styled from 'styled-components'

import { NOT_MOBILE } from 'media-queries'

export const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 21px;
  border-radius: 4px 4px 0 0;
  background-color: transparent;
  animation: showOptions 0.25s;

  @keyframes showOptions {
    from {
      opacity: 0;
    }
  }
`
export const Confirm = styled.img`
  position: absolute;
  bottom: 6px;
  left: 10px;
  height: 75%;
  cursor: pointer;

  @media ${NOT_MOBILE} {
    &:hover {
      opacity: 0.5;
    }
  }
`
export const Cancel = styled.img`
  position: absolute;
  bottom: 6px;
  right: 10px;
  height: 75%;
  cursor: pointer;

  @media ${NOT_MOBILE} {
    &:hover {
      opacity: 0.5;
    }
  }
`
export const Delete = styled.img`
  position: absolute;
  bottom: 5px;
  left: 12px;
  height: 75%;
  cursor: pointer;

  @media ${NOT_MOBILE} {
    &:hover {
      opacity: 0.5;
    }
  }
`
