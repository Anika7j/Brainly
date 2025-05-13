

export interface ButtonProps {
    variant: "primary" | "secondary";
    size: boolean;
    text: string;
    startIcon?: React.ReactNode;
    onclick?: () => void;
}
const variantClass = {
    "primary":"bg-[#5046e4] text-white",
    "secondary": "bg-[#e0e7ff] text-[#5046e4]"
};
const defaultStyles = "px-4 py-2 rounded-md font-light flex items-center"

const Button = ({ variant, size, text, startIcon, onclick }: ButtonProps) => {
  return (
    <button className={variantClass[variant]+" "+ defaultStyles + `${size ? "w-full flex justify-center items-center": "" }` } onClick={onclick}>
      {startIcon && <span className="icon">{startIcon}</span>}
      {text}
    </button>
  )
}

export default Button