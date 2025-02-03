import Image from "next/image";

export const Home = async() => {

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile&access_type=offline`;

      
  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-8 md:p-0 p-4 w-full'>
       <a target='_blank'
            className='w-full md:w-fit justify-center flex flex-row items-center bg-neutral-9500 hover:bg-neutral-800 transition duration-300 font-semibold rounded-full px-4 py-2 border-2 border-neutral-800 gap-2' href={googleAuthUrl}>
            Sign In with Google
              <Image
              width={24}
              height={24}
              className='w-4 h-4'
              src="/assets/google.svg"
              alt="google"
            />
          </a>
    </div>
  )
}
export default Home;