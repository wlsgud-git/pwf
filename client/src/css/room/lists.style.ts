import styled, { createGlobalStyle } from "styled-components";

import { ParticipantTrack } from "../../types/stream.types";

export const ParticipantsListsBox = styled.ul<{ share: boolean }>`
  width: 100%;
  height: ${(p) =>
    p.share ? "var(--participant-video-share-height)" : "100%"};
  position: relative;
  overflow: hidden;
  display: flex;
  border-bottom: ${(p) =>
    p.share ? "1px solid var(--pwf-light-gray)" : "none"};
`;

export const PageContainer = styled.div<{ width: number; x: number }>`
  display: flex;
  height: 100%;
  width: ${(p) => p.width}px;
  transition: transform 0.5s ease;
  transform: translateX(-${(p) => p.x}px);
`;

export const Page = styled.div<{ width: number }>`
  width: ${(p) => p.width}px;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  // flex-wrap: wrap;
  padding: 12px 25px;
  justify-content: center;
`;

// 참가자 비디오
export const UserVideoLi = styled.li<{
  share: boolean;
  active: boolean;
  width: number;
  height: number;
}>`
  list-style: none;
  width: calc(
    100% / ${(p) => p.width} -
      (var(--participant-video-gap) * ${(p) => p.width})
  );
  max-width: ${(p) =>
    p.share
      ? "var(--participant-video-share-max-width)"
      : "var(--participant-video-max-width)"};
  height: calc(
    100% / ${(p) => p.height} -
      (var(--participant-video-gap) * ${(p) => p.height})
  );
  max-height: var(--participant-video-max-height);
  margin: var(--participant-video-gap);
  border: 2px solid var(--pwf-${(p) => (p.active ? "blue" : "gray")});
  position: relative;
`;

export const PageUpdateBtnLeft = styled.button<{
  page: {
    arr: ParticipantTrack[][];
    current: number;
  };
}>`
  position: absolute;
  top: 50%;
  z-index: 10;
  background-color: inherit;
  padding: 8px;
  color: var(--pwf-white);
  left: 3px;
  border: none;
  outline: none;
  display: ${(p) => (!p.page.current ? "none" : "block")};
  font-size: 16px;
  transform: translate(0%, -50%);

  &:hover {
    color: var(--pwf-blue);
  }
`;

export const PageUpdateBtnRight = styled.button<{
  page: {
    arr: ParticipantTrack[][];
    current: number;
  };
}>`
  position: absolute;
  top: 50%;
  z-index: 10;
  background-color: inherit;
  padding: 8px;
  color: var(--pwf-white);
  right: 3px;
  border: none;
  outline: none;
  display: ${(p) =>
    p.page.current == p.page.arr.length - 1 ? "none" : "block"};
  font-size: 16px;
  transform: translate(0%, -50%);

  &:hover {
    color: var(--pwf-blue);
  }
`;

export const UserVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const UserNoVideoText = styled.span<{ video_state: boolean }>`
  z-index: 123;
  overflow: hidden;
  position: absolute;
  left: 50%;
  top: 50%;
  display: ${(p) => (p.video_state ? "none" : "flex")};
  transform: translate(-50%, -50%);
  color: var(--pwf-white);
`;

export const UserInfoBox = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 4px 7px;
  z-index: 1234;
  background-color: var(--pwf-background-transparent);
  display: flex;
  align-items: baseline;

  span {
    margin: 0px 5px;
    color: var(--pwf-white);
    font-weight: bold;
  }
`;
