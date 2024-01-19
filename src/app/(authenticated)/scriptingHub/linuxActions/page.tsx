
import LinuxActions from './LinuxActions';
import AnsibleOutputModal from '../AnsibleOutputModal';
import AnsibleFormModal from '../AnsibleFormModal';

function Page() {

  return (
    <div className='flex flex-col gap-y-16 justify-center items-center w-full h-screen'>
      <LinuxActions />
      <AnsibleOutputModal />
      <AnsibleFormModal />
    </div>
  )
}

export default Page


