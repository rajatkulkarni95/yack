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
          className={`ml-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded px-1 font-sans text-secondary text-s bg-tertiary`}
        >
          {key}
        </kbd>
      ))}
    </div>
  );
};

export default KbdShort;
