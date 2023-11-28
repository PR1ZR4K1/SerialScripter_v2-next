import { toast } from 'react-hot-toast';
import { Host } from "@prisma/client";


interface Row {
      id: number;
      scriptName: string;
      category: string;
      risk: string;
      description: string;
}

interface DeployAnsibleTypes {
    selectedHosts: Set<number>;
    selectedPlaybooks: Set<number>;
    rows: Row[];
    hosts: Host[];
    os: OS;
}

type OS = 'linux' | 'windows'

const postData = async (os: OS, ip: string, playbook: string) => {
    try {

        const result = await fetch(`/api/v1/ansibleDeploy/${os}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hostIp: ip, playbook: playbook })
        });

        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }

        // If you still want to do something with the response, you can
        const data = await result.json();
        // For example, console.log it:
        console.log(data);

    } catch (error) {

        if (error instanceof Error) {
            console.error(`BRUHHHHHH: ${error.message}`);
        } else {
            console.error('An unknown error occurred');
        }

    }
};

const getSelectedHost = (hosts: Host[], id: number) => {
    // Iterate through the list of hosts and match the host with the id that has been 
    // selected in the ansible hosts table
    for (const host of hosts) {
      if (host.id == id) {
        return host.ip;
      }
    }

    // Return an empty host object if the id does not exist within any of the host objects
    return '0.0.0.0';
};

export const deployAnsiblePlaybooks = ({selectedHosts, selectedPlaybooks, rows, hosts, os}: DeployAnsibleTypes) => {

    // set vals to evaluate later in the function

    const selectedHostsSize = selectedHosts.size;
    const selectedPlaybooksSize = selectedPlaybooks.size; 
    const totalPlaybooks = rows.length;
    const totalHosts = hosts.length;
    const totalDeployments = selectedHostsSize * selectedPlaybooksSize


    // error check boy
    if (selectedHostsSize === 0) {
      toast.error('No hosts are currently selected!')
      return
    }
    else if (selectedPlaybooksSize === 0)
    {
      toast.error('No playbooks are currently selected!')
      return
    }


    // iterate through the selected hosts and playbooks and deploy them
    selectedHosts.forEach(host => {
      selectedPlaybooks.forEach(playbook => {
        
        // get the ip of the selected host
        const selectedHostIp: string = getSelectedHost(hosts, host)
        const selectedPlaybook =  rows[playbook].scriptName

        // make sure the ip exists within our host object
        if (selectedHostIp === '0.0.0.0') {
          toast.error('Selected host IP was not found!')
          return
        }
        
        // only show toasts for each deployment if total is less than 5
        if (totalDeployments < 5 ) { 

              // make a post request to ansible deploy endpoint for each playbook 
              // add a loading state for toast to display back to the user

          toast.promise(
            postData(os, selectedHostIp, selectedPlaybook), 
            {
              loading: `Deploying Playbook: ${selectedPlaybook} to: ${selectedHostIp}`, 
              success: `Deployed ${selectedPlaybook} to: ${selectedHostIp}`, 
              error: `Failed to deploy ${selectedPlaybook} to: ${selectedHostIp}`
            }, 
            {duration: 5000}
          )

        }
        else {

          // if there are 5 or more toasts that would be deployed don't display toast
          postData(os, selectedHostIp, selectedPlaybook);

        }     
      })
    })

    // make one toast for entire deployment
    if (totalDeployments >= 5) { 
      toast.success(`Deploying ${selectedPlaybooksSize}/${totalPlaybooks} playbooks to ${selectedHostsSize}/${totalHosts} hosts.`, {duration: 5000})
    }

};