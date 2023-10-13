import Signup from '../signup/page';
import Link from 'next/link';

export default function login(){

  

  // for some reason your gradient colors don't exist anymore lol
  //  from-sky-500 to-sky-950

    return (
        <main className= "bg-gradient-to-t from-blue-gray-600 to-blue-gray-50 flex flex-col min-h-screen items-center justify-center">
            <div className="max-w-md w-full mx-auto mt-4 bg-white rounded-2xl p-8 borde border-gray-300"> 
              {/* Stylized text **/}
              <div className="text-center mb-4">
                <p className="text-3xl font-extrabold text-black">Login </p>
                <p className="text-sm font-bold text-gray-600">to Cyberwarden</p>
              </div>
              <form action="" className="space-y-6">
                <div>
                  <label htmlFor="username" className="text-sm font-bold text-black block">Username</label>
                  <input type="text" id="username" className="w-full p-2 border border-gray-300 rounded mt-1" />
                </div>
                <div>
                  <label htmlFor="password" className="text-sm font-bold text-black block">Password</label>
                  <input type="password" id="password" className="w-full p-2 border border-gray-300 rounded mt-1" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input type="checkbox" id="rememberMe" className="h-4 w-4 text-blue-300 rounded" />
                    <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-500">Remember me</label>
                  </div>
                  <a href="" className="font-medium text-sm text-gray-500">Forgot Password?</a>
                </div>
                <div>
                  <Link href='/'>
                    <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm">Proceed</button>
                  </Link>
                </div>
                <div className="text-sm flex justify-center space-x-1 items-center">
                  <p>Don't have an account?</p>
                  <div className="bg-white hover:bg-stone-200 underline font-bold rounded-md text-blue-500 text-sm">
                    <Link href='/signup'>Create an Account </Link>
                  </div>
                </div>
              </form>
            </div>
        </main>
    )

}