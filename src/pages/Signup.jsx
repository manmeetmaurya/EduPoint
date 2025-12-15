import signupImg from "../assets/Images/signup.jpg"
import Template from "../components/core/Auth/Template"

function Signup() {
  return (
    <div className="bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] min-h-screen">
      <Template
        title="Join the millions learning to code with Shiksha Mitra  for free"
        description1="Build skills for today, tomorrow, and beyond."
        description2="Education to future-proof your career."
        image={signupImg}
        formType="signup"
      />
    </div>
  )
}

export default Signup
