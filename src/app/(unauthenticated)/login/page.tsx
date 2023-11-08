import Signup from '../signup/page';
import forgotpass from '../forgotpass/page'
import Link from 'next/link';
import LoginWidget from './LoginWidget';

export default function login(){

  // for some reason your gradient colors don't exist anymore lol
  //  from-sky-500 to-sky-950

    return (
        <main className= "w-unit-8xl">
            <LoginWidget />
        </main>
    )

}
