import { toast } from 'react-hot-toast';
import { Host } from "@prisma/client";
import { AnsibleOutputType } from '@/store/ScriptingHubStore';


interface Row {
      id: number;
      scriptName: string;
      category: string;
      risk: string;
      parameter: boolean;
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
            throw new Error(`Ensure playbook exists...`);
        }

        // If you still want to do something with the response, you can
        const data = await result.json();
        // For example, console.log it:
        console.log(data.output);

        // return the stdout from the post request given that it is a success
        return data.output

    } catch (error) {

        if (error instanceof Error) {
            console.error(`BRUHHHHHH: ${error.message}`);
            throw error; // Re-throw the error
        } else {
            console.error('An unknown error occurred');
            throw new Error('An unknown error occurred'); // Throw a new error
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

export const deployAnsiblePlaybooks = async ({selectedHosts, selectedPlaybooks, rows, hosts, os}: DeployAnsibleTypes) => {

    // set vals to evaluate later in the function

    const selectedHostsSize: number = selectedHosts.size;
    const selectedPlaybooksSize: number = selectedPlaybooks.size; 
    const totalPlaybooks: number = rows.length;
    const totalHosts: number = hosts.length;
    const totalDeployments: number = selectedHostsSize * selectedPlaybooksSize
    const deploymentOutput: AnsibleOutputType[] = [];
    const deploymentPromises: Promise<any>[] = [];



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
        const selectedPlaybook: string =  rows[playbook].scriptName

        // make sure the ip exists within our host object
        if (selectedHostIp === '0.0.0.0') {
          toast.error('Selected host IP was not found!')
          return
        }
        
        // only show toasts for each deployment if total is less than 5
        if (totalDeployments < 5 ) { 

              // make a post request to ansible deploy endpoint for each playbook 
              // add a loading state for toast to display back to the user

                deploymentPromises.push(
                    toast.promise(
                        postData(os, selectedHostIp, selectedPlaybook), 
                        {
                            loading: `Deploying ${selectedPlaybook}.yml to: ${selectedHostIp}`,
                            success: (data) => {
                                deploymentOutput.push({ip: selectedHostIp, playbookName: `${selectedPlaybook}.yml`, output: data});
                                return `Deployed ${selectedPlaybook} to: ${selectedHostIp}`;
                            },
                            error: (err) => `Failed to deploy ${selectedPlaybook} to: ${selectedHostIp} - ${err.message}`
                        }
                    )
                );

        }
        else {


            // For 5 or more deployments, use async/await and push promises to deploymentPromises array
            deploymentPromises.push(
                (async () => {
                    try {
                        const data = await postData(os, selectedHostIp, selectedPlaybook);
                        deploymentOutput.push({
                            ip: selectedHostIp,
                            playbookName: `${selectedPlaybook}.yml`,
                            output: data
                        });
                    } catch (error) {
                        toast.error(`Failed to deploy ${selectedPlaybook} to: ${selectedHostIp}`);
                    }
                })() // Immediately invoked async function
            );
        }     
      })
    })

    // make one toast for entire deployment
    if (totalDeployments >= 5) { 
      toast.success(`Deploying ${selectedPlaybooksSize}/${totalPlaybooks} playbooks to ${selectedHostsSize}/${totalHosts} hosts.`)
    }

    await Promise.all(deploymentPromises);

    return deploymentOutput;

};