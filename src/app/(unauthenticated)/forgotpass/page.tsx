import Link from 'next/link';

export default function forgotpass(){

    return (
        <main className= "bg-gradient-to-t from-blue-gray-600 to-blue-gray-50 flex flex-col min-h-screen items-center justify-center">
            <div className="max-w-md w-full mx-auto mt-4 bg-white rounded-2xl p-8 borde border-gray-300"> 
              {/* Stylized text **/}
              <div className="text-center mb-4">
                <p className="text-2xl font-extrabold text-black">Forgot Password</p>
                <p className="text-sm font-bold text-gray-600">Please enter yout email address</p>
                <p className="text-sm font-bold text-gray-600">and we will send you an email</p>
                <p className="text-sm font-bold text-gray-600">to reset your password</p>
              </div>
              <form action="" className="space-y-6">
                <div>
                  <label htmlFor="username" className="text-sm font-bold text-black block">Email</label>
                  <input type="text" id="username" className="w-full p-2 border border-gray-300 rounded mt-1" />
                </div>
                <div>
                    <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm">Submit</button>
                </div>
              </form>
            </div>
        </main>
    )

}