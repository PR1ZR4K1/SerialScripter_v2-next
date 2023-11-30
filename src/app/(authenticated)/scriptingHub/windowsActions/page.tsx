
import WindowsActions from './WindowsActions';
import AnsibleOutputModal from '../AnsibleOutputModal';
import AnsibleFormModal from '../AnsibleFormModal';

function Page() {

  return (
    <div className='flex flex-col gap-y-16 justify-center items-center w-full h-screen'>
      <WindowsActions />
      <AnsibleOutputModal />
      <AnsibleFormModal />
    </div>
  )
}

export default Page


