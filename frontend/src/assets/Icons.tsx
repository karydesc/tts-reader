export const PlayIcon = () =>
(
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M15 12.3301L9 16.6603L9 8L15 12.3301Z" fill="currentColor" />
    </svg>
)

export const PauseIcon = () =>
(
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M11 7H8V17H11V7Z" fill="currentColor" />
        <path d="M13 17H16V7H13V17Z" fill="currentColor" />
    </svg>
)
export const RewindIcon = () =>
(
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M2 7H5V17H2V7Z" fill="currentColor" />
        <path d="M6 12L13.0023 7.00003V17L6 12Z" fill="currentColor" />
        <path d="M21.0023 7.00003L14 12L21.0023 17V7.00003Z" fill="currentColor" />
    </svg>
)

export const ForwardIcon = () =>
(
    <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    >
    <path d="M21.0023 17H18.0023V7H21.0023V17Z" fill="currentColor" />
    <path d="M17.0023 12L10 17V7L17.0023 12Z" fill="currentColor" />
    <path d="M2 17L9.00232 12L2 7V17Z" fill="currentColor" />
    </svg>
)

export const MoreIcon = () => (
    <svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12Z"
    fill="currentColor"
  />
  <path
    d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
    fill="currentColor"
  />
  <path
    d="M18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12C16 13.1046 16.8954 14 18 14Z"
    fill="currentColor"
  />
</svg>
)

export const ICON_MAP = {
    play: <PlayIcon />,
    pause: <PauseIcon />,
    rewind: <RewindIcon />,
    forward: <ForwardIcon />,
    more: <MoreIcon />
};

export type IconName = keyof typeof ICON_MAP;