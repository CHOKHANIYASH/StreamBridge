import Loader from "react-js-loader";

const SubmitButton = ({ loading, label }) => {
  return loading ? (
    <Loader type="spinner-circle" bgColor="#000000" size={50} />
  ) : (
    <button
      className="bg-gradient-to-br relative group/btn from-black to-neutral-600 
                 block w-full text-white rounded-md h-10 font-medium 
                 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
      type="submit"
    >
      {label}
      <BottomGradient />
    </button>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 block w-full h-px transition duration-500 opacity-0 group-hover/btn:opacity-100 -bottom-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="absolute block w-1/2 h-px mx-auto transition duration-500 opacity-0 group-hover/btn:opacity-100 blur-sm -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

export default SubmitButton;
