interface IHeaderProps {
  children: React.ReactNode;
  classes?: string;
}

const Header = ({ children, classes }: IHeaderProps) => {
  return (
    <header
      className={`p-4 min-h-[64px] flex bg-transparent border-b border-primary ${classes}`}
    >
      {children}
    </header>
  );
};

export default Header;
