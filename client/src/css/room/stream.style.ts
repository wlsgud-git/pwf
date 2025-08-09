import styled, { createGlobalStyle } from "styled-components";

export const StreamGlobal = createGlobalStyle`
  :root{
    // list ----------------------------------------
    //  width
    --participant-video-max-width: 340px;
    --participant-video-share-max-width: 240px;
    // height
    --participant-video-share-height: 140px;
    --participant-video-max-height: 235px;
    // any
    --participant-video-gap: 4px;
    // share ----------------------------------------

    // footer ----------------------------------------
    --stream-footer-btn-size: 60px;
  }
`;

export const StreamPage = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  border: 4px solid green;
`; // ---------------------------

// 비디오 and 풋터 포함 박스
export const StreamBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid orange;
`;

// 비디오 담는 박스
export const StreamSectionBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: calc(100% - var(--stream-footer-btn-size));
`;

// 공유화면 부분
export const ShareContainer = styled.div<{ share: boolean }>`
  width: 100%;
  height: calc(100% - var(--participant-video-share-height));
  display: ${(p) => (p.share ? "flex" : "none")};
  justify-content: center;
`;

export const shareVideoBox = styled.div`
  width: 100%;
  height: 100%;
  max-width: 500px;
  position: relative;
  border: 1px solid red;
`;

export const shareVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const shareUserNick = styled.span`
  padding: 3px 8px;
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: var(--pwf-background-transparent);
  color: var(--pwf-white);
`;

// 하단 네이게이션
export const Footer = styled.footer`
  background-color: var(--pwf-signiture-color);
  display: flex;
  align-items: center;
  border-top: 1px solid var(--pwf-light-gray);
  width: 100%;

  button {
    border: none;
    flex: 1;
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    height: var(--stream-footer-btn-size);
    background-color: inherit;
    font-weight: bold;
    color: var(--pwf-white);
    position: relative;

    span {
      margin-top: 4px;
    }
    &:hover {
      background-color: var(--pwf-background-transparent-light);
    }
  }
`;
