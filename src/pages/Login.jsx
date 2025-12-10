import loginImg from "../assets/Images/login.webp"
import Template from "../components/core/Auth/Template"

function Login() {
  return (
    <div className="bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] min-h-screen">
      <Template
        title="Welcome Back"
        description1="Build skills for today, tomorrow, and beyond."
        description2="Education to future-proof your career."
        image={loginImg}
        formType="login"
      />
    </div>
  )
}

export default Login
