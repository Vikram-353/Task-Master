import BG_IMG from "../../images/protection.png";

function AuthLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-[60%] px-4 md:px-12 pt-6 md:pt-6 pb-6 ">
        <div className="md:flex md:justify-center md:text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-transparent mt-4 pb-6 bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 drop-shadow-sm">
            Task Manager
          </h1>
        </div>

        {children}
      </div>

      {/* Right Panel (image) */}
      <div className="hidden  md:flex w-[50%] h- items-center justify-center bg-blue-50 bg-cover bg-no-repeat bg-center p-8">
        <img
          className="w-64 h-full lg:w-[100%]"
          src={BG_IMG}
          alt="Task Visual"
        />
      </div>
    </div>
  );
}

export default AuthLayout;
