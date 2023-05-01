import { useNavigate } from "react-router-dom";
import KbdShort from "./KbdShort";
import { useHotkeys } from "react-hotkeys-hook";
import { useUsage } from "../hooks/useUsage";
import { LeftArrow, LogoIcon, RightArrow } from "../svg";
import { useNavigation } from "../hooks/useNavigation";
import Tooltip from "./Tooltip";

interface IHeaderProps {
  haltNew?: boolean;
  hideHistory?: boolean;
}

export const hideApp = async () => {
  const appWindow = await (await import("@tauri-apps/api/window")).appWindow;

  await appWindow.hide();
};

const Header = ({ hideHistory }: IHeaderProps) => {
  const { totalCost } = useUsage();

  const navigate = useNavigate();
  const {
    navigateToNextChat,
    navigateToPrevChat,
    onClickHistory,
    onClickNew,
    isLeftDisabled,
    isRightDisabled,
  } = useNavigation();

  const handleEscape = () => {
    if (hideHistory) {
      navigate(-1);
    } else {
      hideApp();
    }
  };

  useHotkeys("escape", handleEscape);

  useHotkeys("meta+p", onClickHistory);
  useHotkeys("meta+n", onClickNew);

  useHotkeys("meta+[", navigateToPrevChat);
  useHotkeys("meta+]", navigateToNextChat);

  const historyKbd = hideHistory ? ["Esc"] : ["⌘", "P"];

  return (
    <header className="p-4 flex bg-primary border-b border-primary h-12">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <LogoIcon className="w-20 h-10 text-primary" />{" "}
          {!hideHistory && (
            <Tooltip
              tooltip={
                !isLeftDisabled ? (
                  <span className="text-sm font-normal text-secondary font-sans flex items-center">
                    Prev
                    <KbdShort keys={["⌘", "["]} additionalStyles="ml-2" />
                  </span>
                ) : (
                  ""
                )
              }
            >
              <button
                className="px-2 ml-4 py-1 bg-transparent disabled:opacity-40 disabled:cursor-not-allowed group border border-primary hover:bg-primaryBtnHover rounded mr-1"
                onClick={navigateToPrevChat}
                disabled={isLeftDisabled}
              >
                <LeftArrow className="w-4 h-4 text-tertiary group-hover:text-primary" />
              </button>
            </Tooltip>
          )}
          {!hideHistory && (
            <Tooltip
              tooltip={
                !isRightDisabled ? (
                  <span className="text-sm font-normal text-secondary font-sans flex items-center">
                    Next
                    <KbdShort keys={["⌘", "]"]} additionalStyles="ml-2" />
                  </span>
                ) : (
                  ""
                )
              }
            >
              <button
                className="px-2 py-1 bg-transparent border disabled:opacity-40 disabled:cursor-not-allowed group border-primary hover:bg-primaryBtnHover rounded mr-1"
                onClick={navigateToNextChat}
                disabled={isRightDisabled}
              >
                <RightArrow className="w-4 h-4 text-tertiary group-hover:text-primary" />
              </button>
            </Tooltip>
          )}
        </div>
        <div className="flex items-center">
          <button
            className="px-2 py-1 bg-transparent border border-primary hover:bg-primaryBtnHover rounded mr-1"
            onClick={hideHistory ? handleEscape : onClickHistory}
          >
            <span className="text-sm font-normal text-secondary font-sans flex items-center">
              {hideHistory ? "Back" : "History"}{" "}
              <KbdShort keys={historyKbd} additionalStyles="ml-2" />
            </span>
          </button>

          <button
            className="px-2 py-1 bg-transparent border border-primary hover:bg-primaryBtnHover rounded"
            onClick={onClickNew}
          >
            <span className="text-sm font-normal font-sans text-secondary flex items-center">
              New Chat <KbdShort keys={["⌘", "N"]} additionalStyles="ml-2" />
            </span>
          </button>
          <div className="px-2 py-1 bg-action cursor-default select-none hover:brightness-105 font-mono text-sm text-secondary rounded ml-4">
            ${totalCost}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
