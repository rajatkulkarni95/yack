interface IHeaderProps {
  children: React.ReactNode;
  classes?: string;
  small?: boolean;
}

const Header = ({ children, classes, small }: IHeaderProps) => {
  return (
    <header
      className={`p-4 flex bg-secondary border-b border-primary ${classes} ${
        small ? "h-12" : "h-16"
      }`}
    >
      {children}
    </header>
  );
};

export default Header;
