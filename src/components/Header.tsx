import { useNavigate } from "react-router-dom";
import KbdShort from "./KbdShort";
import { useHotkeys } from "react-hotkeys-hook";
import { useUsage } from "../hooks/useUsage";
import { LeftArrow, LogoIcon, RightArrow } from "../svg";
import { useNavigation } from "../hooks/useNavigation";
import Tooltip from "./Tooltip";

interface IHeaderProps {
  haltNew?: boolean;
  backToChat?: boolean;
  streamOngoing?: boolean;
  hideHistory?: boolean;
  hideSettings?: boolean;
}

export const hideApp = async () => {
  const appWindow = await (await import("@tauri-apps/api/window")).appWindow;

  await appWindow.hide();
};

const Header = ({
  backToChat,
  streamOngoing,
  hideHistory,
  hideSettings,
}: IHeaderProps) => {
  const { totalCost } = useUsage();

  const navigate = useNavigate();
  const {
    navigateToNextChat,
    navigateToPrevChat,
    onClickHistory,
    onClickNew,
    onClickSettings,
    isLeftDisabled,
    isRightDisabled,
  } = useNavigation();

  const handleEscape = () => {
    if (backToChat) {
      navigate("/");
    } else {
      hideApp();
    }
  };

  useHotkeys("escape", handleEscape);

  useHotkeys("meta+p", onClickHistory);
  useHotkeys("meta+n", () => {
    if (!streamOngoing) {
      onClickNew();
    }
  });
  useHotkeys("meta+,", onClickSettings);

  useHotkeys("meta+[", navigateToPrevChat);
  useHotkeys("meta+]", navigateToNextChat);

  return (
    <header
      className="flex h-12 select-none border-b border-primary bg-primary px-4"
      data-tauri-drag-region
    >
      <div
        className="flex w-full items-center justify-between"
        data-tauri-drag-region
      >
        <div className="flex items-center">
          <LogoIcon className="h-10 w-20 text-primary" />{" "}
          {!backToChat && (
            <Tooltip
              tooltip={
                !isLeftDisabled ? (
                  <span className="flex items-center font-sans text-sm font-normal text-secondary">
                    Prev
                    <KbdShort keys={["⌘", "["]} additionalStyles="ml-2" />
                  </span>
                ) : (
                  ""
                )
              }
            >
              <button
                className="group ml-4 mr-1 rounded border border-primary bg-transparent px-2 py-1 hover:bg-primaryBtnHover disabled:cursor-not-allowed disabled:opacity-40"
                onClick={navigateToPrevChat}
                disabled={isLeftDisabled}
              >
                <LeftArrow className="h-4 w-4 text-tertiary group-hover:text-primary" />
              </button>
            </Tooltip>
          )}
          {!backToChat && (
            <Tooltip
              tooltip={
                !isRightDisabled ? (
                  <span className="flex items-center font-sans text-sm font-normal text-secondary">
                    Next
                    <KbdShort keys={["⌘", "]"]} additionalStyles="ml-2" />
                  </span>
                ) : (
                  ""
                )
              }
            >
              <button
                className="group mr-1 rounded border border-primary bg-transparent px-2 py-1 hover:bg-primaryBtnHover disabled:cursor-not-allowed disabled:opacity-40"
                onClick={navigateToNextChat}
                disabled={isRightDisabled}
              >
                <RightArrow className="h-4 w-4 text-tertiary group-hover:text-primary" />
              </button>
            </Tooltip>
          )}
        </div>
        <div className="flex items-center">
          {!hideHistory && (
            <button
              className="mr-1 rounded border border-primary bg-transparent px-2 py-1 hover:bg-primaryBtnHover"
              onClick={onClickHistory}
            >
              <span className="flex items-center font-sans text-sm font-normal text-secondary">
                History
                <KbdShort keys={["⌘", "P"]} additionalStyles="ml-2" />
              </span>
            </button>
          )}
          {!hideSettings && (
            <button
              className="rounded border border-primary bg-transparent px-2 py-1 hover:bg-primaryBtnHover disabled:cursor-not-allowed disabled:opacity-40"
              onClick={onClickSettings}
              disabled={streamOngoing}
            >
              <span className="flex items-center font-sans text-sm font-normal text-secondary">
                Settings <KbdShort keys={["⌘", ","]} additionalStyles="ml-2" />
              </span>
            </button>
          )}
          <button
            className="rounded border border-primary bg-transparent px-2 py-1 hover:bg-primaryBtnHover disabled:cursor-not-allowed disabled:opacity-40"
            onClick={onClickNew}
            disabled={streamOngoing}
          >
            <span className="flex items-center font-sans text-sm font-normal text-secondary">
              New Chat <KbdShort keys={["⌘", "N"]} additionalStyles="ml-2" />
            </span>
          </button>
          <div className="ml-2 cursor-default select-none rounded bg-action px-2 py-1 font-mono text-sm text-secondary hover:brightness-105">
            ${totalCost}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
