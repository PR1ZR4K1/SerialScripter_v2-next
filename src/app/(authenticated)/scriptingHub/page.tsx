import Image from "next/image"
import Link from "next/link"

function ScriptingHub() {
  return (
    <div className="h-screen w-full overflow-hidden relative">
        <Link href='/scriptingHub/windowsActions'>
            <div className="absolute hover inset-shadow flex items-center justify-start w-11/12 lg:w-10/12 h-full bg-gradient-to-tl from-blue-900 to-cyan-400 transition-all ease-in-out duration-300 ">
                <div className="absolute top-[40%] lg:top-unit-6xl left-28 lg:left-60 ">  {/* <-- counteract the skew for the content */}
                    <img alt="Linux Penguin Image" src={'/assets/windows.png'} className="w-40 h-40 lg:w-72 lg:h-72"  />
                </div>
            </div>
        </Link>
        <Link href='/scriptingHub/linuxActions'>
            <div className="absolute hover inset-shadow top-0 -right-80 lg:-right-1/2 w-[70vw] lg:w-full h-full bg-gradient-to-br from-red-600 via-red-600 to-yellow-500 transform -skew-x-[30deg] lg:-skew-x-[45deg] transition-all ease-in-out duration-300 shadow-none">
                <div className="absolute top-[40%] lg:top-unit-6xl left-32 lg:left-80 skew-x-[30deg] lg:skew-x-[45deg]">  {/* <-- counteract the skew for the content */}
                    <img alt="Linux Penguin Image" src={'/assets/scriptingLinux.png'} className="w-40 h-40 lg:w-72 lg:h-72"  />
                </div>
            </div>
        </Link>
    </div>
  )
}


export default ScriptingHub
