type TProps = {
  keys: string[];
  additionalStyles?: string;
  inTooltip?: boolean;
};

const KbdShort = ({ keys, additionalStyles, inTooltip }: TProps) => {
  return (
    <div className={`flex items-center ${additionalStyles}`}>
      {keys.map((key) => (
        <kbd
          key={key}
          className={`ml-0.5 inline-flex h-5 items-center justify-center rounded bg-kbd px-1.5 py-0.5 font-[system-ui] text-xs text-secondary`}
        >
          {key}
        </kbd>
      ))}
    </div>
  );
};

export default KbdShort;
