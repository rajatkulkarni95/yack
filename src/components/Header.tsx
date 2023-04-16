import { useNavigate } from "react-router-dom";
import KbdShort from "./KbdShort";
import { useUsage } from "../hooks/useUsage";

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

  return (
    <header className="p-4 flex bg-secondary border-b border-primary h-12">
      <div className="flex items-center justify-between w-full">
        <div />
        <div className="flex items-center">
          <div className="px-2 py-1 bg-transparent cursor-default select-none hover:bg-primaryBtnHover font-mono text-secondary rounded mr-4">
            ${totalCost}
          </div>
          {hideHistory && (
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
