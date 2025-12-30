export default function IconBtn({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      className={`flex items-center ${
        outline ? "border border-blue-200 bg-transparent" : "bg-blue-200 hover:bg-blue-300 text-richblack-900"
      } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold ${customClasses}`}
      type={type}
    >
      {children ? (
        <>
          <span className={`${outline && "text-blue-200"}`}>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  )
}
