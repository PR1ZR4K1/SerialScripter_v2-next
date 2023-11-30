import { toast } from 'react-hot-toast';


export const getAnsibleParameter = (e: FormData) => {
    const parameter = e.get('parameter')?.toString() || '';

    if (!parameter) {
        toast.error('No parameter was provided!');
        return;
    }

    return parameter

  };