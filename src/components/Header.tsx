import { useNavigate } from "react-router-dom";
import KbdShort from "./KbdShort";
import { useUsage } from "../hooks/useUsage";
import { useGlobalShortcut } from "../hooks/useGlobalShortcut";
import { PaintBrushIcon } from "@heroicons/react/24/solid";
import { LogoIcon } from "../svg";

interface IHeaderProps {
  haltNew?: boolean;
  hideHistory?: boolean;
}

const Header = ({ haltNew, hideHistory }: IHeaderProps) => {
  const { promptCost, totalCost } = useUsage();
  const navigate = useNavigate();
  const onClickNew = () => {
    if (haltNew) return;
    navigate("/chat/new");
  };

  const onClickHistory = () => {
    navigate("/history");
  };

  useGlobalShortcut("Command+H", onClickHistory);
  useGlobalShortcut("Command+N", onClickNew);

  return (
    <header className="p-4 flex bg-secondary border-b border-primary h-12">
      <div className="flex items-center justify-between w-full">
        <LogoIcon className="w-6 h-6 text-primary" />
        <div className="flex items-center">
          <div className="px-2 py-1 bg-transparent cursor-default select-none hover:bg-primaryBtnHover font-mono text-secondary rounded mr-4">
            ${totalCost}
          </div>
          {!hideHistory && (
            <button
              className="px-2 py-1 bg-transparent hover:bg-primaryBtnHover rounded mr-4"
              onClick={onClickHistory}
            >
              <span className="text-sm font-normal text-secondary flex items-center">
                History <KbdShort keys={["⌘", "H"]} additionalStyles="ml-2" />
              </span>
            </button>
          )}
          <button
            className="px-2 py-1 bg-transparent hover:bg-primaryBtnHover rounded"
            onClick={onClickNew}
          >
            <span className="text-sm font-normal text-secondary flex items-center">
              New Chat <KbdShort keys={["⌘", "N"]} additionalStyles="ml-2" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
