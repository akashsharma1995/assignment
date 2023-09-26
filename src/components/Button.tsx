import { FC, ReactElement, ReactNode } from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode,
}

const Button: FC<Props> = ({ children, ...otherProps }): ReactElement => {
  return (
    <button
      {...otherProps}
      className="text-white bg-gradient-to-l from-violet-500 to-fuchsia-400 border-0 py-2 px-6 focus:outline-none rounded-full text-lg w-full mt-4 disabled:bg-none bg-zinc-700"
    >
      Next
    </button>
  );
};

export default Button;
