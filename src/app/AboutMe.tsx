import Image from "next/image";

export default function AboutMe() {
  return (
    <div className="mb-32">
      <h3 className="mb-16 cursor-default text-center text-4xl font-medium text-gray-800 transition duration-300 dark:text-white lg:mb-20 xl:mb-24">
        About Me
      </h3>
      <div className="flex p-10 items-center bg-cyan-100 border-2 border-cyan-400 dark:border-0 dark:bg-gray-800 mx-4 sm:mx-10 rounded-xl justify-center flex-col md:flex-row">
        <Image
          src="/profile_pic.jpg"
          alt="Profile Picture"
          width={480}
          height={480}
          className="rounded-full mb-10 md:mb-0 w-full max-w-xs border-4 border-cyan-500 filter grayscale hover:filter-none transition duration-300 dark:border-cyan-700"
        />
        <p className="text-center w-full md:mb-0 text-base lg:text-lg flex items-center max-w-xl mx-10">
          {`I'm a student at Bennett University in Greater Noida, India, where I'm studying a Bachelor of Technology in Computer Science Engineering. I am specializing in artificial intelligence, but I'll experiment with any new technology I come across. Details about my schooling, abilities, and completed projects are provided here. I hope you enjoy them, and please consider emailing me any comments you may have.`}
        </p>
      </div>
    </div>
  );
}
