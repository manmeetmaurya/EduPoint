// Icons Import
import { FaArrowRight } from "react-icons/fa"
import { Link } from "react-router-dom"

// Image and Video Import
import Banner from "../assets/Images/banner.mp4"
// import Vid1 and Vid2 only once below
import Vid1 from "../assets/Images/vid1.mp4"
import Vid2 from "../assets/Images/vid2.mp4"
// Component Imports
import Footer from "../components/Common/Footer"
import ReviewSlider from "../components/Common/ReviewSlider"
import CTAButton from "../components/core/HomePage/Button"
import CodeBlocks from "../components/core/HomePage/CodeBlocks"
import ExploreMore from "../components/core/HomePage/ExploreMore"
import HighlightText from "../components/core/HomePage/HighlightText"
import InstructorSection from "../components/core/HomePage/InstructorSection"
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection"
import TimelineSection from "../components/core/HomePage/Timeline"
import { TypeAnimation } from "react-type-animation"


function Home() {
  return (
  <div className="bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] min-h-screen">
      {/* Hero Section */}
      <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white py-10">
        {/* 3D floating cubes background */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <div className="w-full h-full flex flex-wrap justify-center items-center opacity-30 animate-pulse">
            {[...Array(8)].map((_,i) => (
              <div key={i} className={`w-24 h-24 m-6 rounded-2xl bg-gradient-to-br from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] shadow-2xl shadow-[#1FA2FF]/40 transform-gpu rotate-${i*10} scale-110 animate-float${i%2===0?"":"-reverse"}`}></div>
            ))}
          </div>
        </div>
        {/* Animated Tech Background */}
  <div className="absolute inset-0 -z-10 animate-pulse bg-gradient-to-tr from-[#1FA2FF]/30 via-[#12D8FA]/30 to-[#A6FFCB]/30 blur-2xl opacity-80" />
        {/* Become a Instructor Button */}
        <Link to={"/signup"}>
          <div className="group mx-auto mt-16 w-fit rounded-full bg-gradient-to-r from-[#ff512f] to-[#dd2476] p-1 font-bold text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-2xl hover:brightness-110">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-[#232526] group-hover:scale-105">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        {/* Heading */}
  <div className="text-center text-5xl font-extrabold mt-8">
          <TypeAnimation
            className="bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text"
            repeat={Infinity}
            sequence={['UNLOCK THE NEW HORIZON TODAY WITH', 2000, ' ']} 
            omitDeletionAnimation={true}
            style={{ display: 'inline-block' }}
          />
          <span className="relative z-10">
            <HighlightText text={" Development Skills"} />
            <span className="block absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-[80%] h-2 bg-gradient-to-r from-[#1FA2FF]/60 via-[#12D8FA]/40 to-[#A6FFCB]/0 blur-lg opacity-80 rounded-full" />
          </span>
        </div>

        {/* Sub Heading */}
        <div className="-mt-3 w-[90%] text-center text-xl font-bold text-richblack-200 relative">
          <span className="bg-gradient-to-r from-[#ff512f] via-[#f09819] to-[#ff512f] text-transparent bg-clip-text">
            With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
          </span>
          <span className="block absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-[60%] h-2 bg-gradient-to-r from-[#ff512f]/60 via-[#f09819]/40 to-[#ff512f]/0 blur-lg opacity-80 rounded-full" />
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-row gap-7">
          <CTAButton active={true} linkto={"/signup"}>
            <span className="bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text transition-transform duration-300 group-hover:scale-110">Learn More</span>
          </CTAButton>
          <CTAButton active={false} linkto={"/login"}>
            <span className="bg-gradient-to-r from-[#ff512f] via-[#f09819] to-[#ff512f] text-transparent bg-clip-text transition-transform duration-300 group-hover:scale-110">Book a Demo</span>
          </CTAButton>
        </div>

        {/* Tech Video Banner - Now 3 videos side by side */}
        <div className="mx-3 my-7 w-full flex flex-row gap-4 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#1FA2FF]/40 animate-fade-in">
          <div className="w-1/3 flex-shrink-0 flex-grow-0">
            <video
              className="w-full h-[320px] object-cover drop-shadow-[0_8px_32px_rgba(31,162,255,0.4)] rounded-xl transition-transform duration-500 hover:scale-105"
              muted
              loop
              autoPlay
              style={{filter:'drop-shadow(0 8px 32px #1FA2FF88)'}}
            >
              <source src={Banner} type="video/mp4" />
            </video>
          </div>
          <div className="w-1/3 flex-shrink-0 flex-grow-0">
            <video
              className="w-full h-[320px] object-cover drop-shadow-[0_8px_32px_rgba(31,162,255,0.4)] rounded-xl transition-transform duration-500 hover:scale-105"
              muted
              loop
              autoPlay
              style={{filter:'drop-shadow(0 8px 32px #1FA2FF88)'}}
            >
              <source src={Vid1} type="video/mp4" />
            </video>
          </div>
          <div className="w-1/3 flex-shrink-0 flex-grow-0">
            <video
              className="w-full h-[320px] object-cover drop-shadow-[0_8px_32px_rgba(31,162,255,0.4)] rounded-xl transition-transform duration-500 hover:scale-105"
              muted
              loop
              autoPlay
              style={{filter:'drop-shadow(0 8px 32px #1FA2FF88)'}}
            >
              <source src={Vid2} type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Code Section 1  */}
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Empower your
                <HighlightText text={" next-gen tech skills"} /> with our platform.
              </div>
            }
            subheading={
              "Learn, build, and innovate with hands-on projects, real-world challenges, and a vibrant tech community. Your journey to mastery starts here."
            }
            ctabtn1={{
              btnText: "Try it Yourself",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            codeColor={"text-yellow-25"}
            codeblock={`<!DOCTYPE html>\n <html lang=\"en\">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href=\"/\">Header</a></h1>\n<nav> <a href=\"/one\">One</a> <a href=\"/two\">Two</a> <a href=\"/three\">Three</a>\n</nav>\n</body>`}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>

        {/* Code Section 2 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                Start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            codeColor={"text-white"}
            codeblock={`import React from \"react\";\n import CTAButton from \"./Button\";\nimport TypeAnimation from \"react-type\";\nimport { FaArrowRight } from \"react-icons/fa\";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>

        {/* Explore Section */}
        <div className="w-full">
          <ExploreMore />
        </div>
      </div>

      {/* Section 2: Explore & Timeline */}
  <div className="bg-gradient-to-br from-[#232526] via-[#1FA2FF]/10 to-[#A6FFCB]/10 text-richblack-700 py-16">
        <div className="homepage_bg h-[320px] relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1FA2FF]/20 via-[#12D8FA]/20 to-[#A6FFCB]/20 blur-2xl opacity-60 -z-10 animate-pulse" />
          {/* Explore Full Catagory Section */}
          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
            <div className="lg:h-[150px]"></div>
            <div className="flex flex-row gap-7 text-white lg:mt-8">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/login"}>
                Learn More
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ">
          {/* Job that is in Demand - Section 1 */}
          <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
            <div className="text-4xl font-semibold lg:w-[45%] bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text drop-shadow-[0_4px_16px_rgba(31,162,255,0.5)]" style={{textShadow:'0 4px 16px #1FA2FF'}}>
                Get the skills you need for a <HighlightText text={"job that is in demand."} />
                <span className="block w-[70%] h-2 bg-gradient-to-r from-[#1FA2FF]/60 via-[#12D8FA]/40 to-[#A6FFCB]/0 blur-lg opacity-80 rounded-full mt-2 mx-auto" />
              </div>
            <div className="flex flex-col items-start gap-10 lg:w-[40%]">
              <div className="text-[16px] text-richblack-700 bg-white/80 rounded-lg p-4 shadow-lg" style={{textShadow:'0 2px 8px #232526'}}> 
                The modern Shiksha Mitra dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                <div className="bg-gradient-to-r from-[#ff512f] via-[#f09819] to-[#ff512f] text-transparent bg-clip-text transition-transform duration-300 hover:scale-110">Learn More</div>
              </CTAButton>
            </div>
          </div>

          {/* Timeline Section - Section 2 */}
          <TimelineSection />

          {/* Learning Language Section - Section 3 */}
          <LearningLanguageSection />
        </div>
      </div>

      {/* Section 3: Instructors & Reviews */}
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-gradient-to-br from-[#232526] via-[#1FA2FF]/10 to-[#A6FFCB]/10 text-white rounded-3xl shadow-2xl py-12">
        {/* Become a instructor section */}
        <InstructorSection />

        {/* Reviews from Other Learners */}
        <h1 className="text-center text-4xl font-extrabold mt-8 bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text drop-shadow-lg">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home
