import { toast } from 'react-hot-toast';
import { Host } from "@prisma/client";
import { AnsibleOutputType, PlaybookParametersType } from '@/store/ScriptingHubStore';


interface Row {
      id: number;
      scriptName: string;
      category: string;
      risk: string;
      parameter: boolean;
      description: string;
}

interface DeployAnsibleTypes {
    playbooksToDeploy: PlaybookParametersType[];
    os: OS;
}

type OS = 'linux' | 'windows'

const postData = async (os: OS, ip: string, playbook: string, extra_vars?: string | '' ) => {
    try {

        const response = await fetch(`/api/v1/ansibleDeploy/${os}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hostIp: ip, playbook: playbook, extra_vars: extra_vars })
        });

        if (!response.ok) {
            return { error: 'Failed to deploy playbook!' };
        }

        // If you still want to do something with the response, you can
        const data = await response.json();
        // For example, console.log it:
        // console.log(data.output);

        // return the stdout from the post request given that it is a success
        return {success: 'Successfully deployed playbook!', output: data.output}

    } catch (error) {

        // return the stderr from the post request given that it is a failure
        return {error: `Unknown error while deploying playbook\n${error}`}
    }
};

const getSelectedHost = (hosts: Host[], id: number) => {
    // Iterate through the list of hosts and match the host with the id that has been 
    // selected in the ansible hosts table
    // for (const host of hosts) {
    //   if (host.id == id) {
        // return host.ip;
    //   }
    // }

    return hosts[id].ip;

};

export const deployAnsiblePlaybooks = async ({playbooksToDeploy, os}: DeployAnsibleTypes) => {

    // set vals to evaluate later in the function

    // const totalPlaybooks: number = rows.length;
    // const totalHosts: number = hosts.length;
    const totalDeployments: number = playbooksToDeploy.length;
    const deploymentOutput: AnsibleOutputType[] = [];

    let successCount = 0;
    let failureCount = 0;

    const deploymentPromises = playbooksToDeploy.flatMap(async (playbook) => {

            if (totalDeployments <= 5) {
                toast.loading(`Deploying ${playbook.playbook}.yml to: ${playbook.hostIp}`, { duration: 1500 });
                try {
                    const data = await postData(os, playbook.hostIp, playbook.playbook, playbook.extra_vars);
                    
                    // check if the data returned is an error
                    if (data.error) {
                        toast.error(`Failed to deploy ${playbook.playbook} to: ${playbook.hostIp}\n${data.error}`);
                        failureCount++;
                        return;
                    }

                    toast.success(`Successfully deployed ${playbook.playbook} to: ${playbook.hostIp}`);
                    deploymentOutput.push({ ip: playbook.hostIp, playbookName: `${playbook.playbook}.yml`, output: data.output });
                    successCount++;
                } catch (error) {
                    toast.error(`Failed to deploy ${playbook.playbook} to: ${playbook.hostIp}`);
                    failureCount++;
                }
            } else {
                // For more than 5 deployments, push promises to deploymentPromises array
                return postData(os, playbook.hostIp, playbook.playbook, playbook.extra_vars)
                    .then(data => {
                        if (data.error) {
                            toast.error(`Failed to deploy ${playbook.playbook} to: ${playbook.hostIp}`);
                            failureCount++;
                            return;
                        }
                        deploymentOutput.push({ ip: playbook.hostIp, playbookName: `${playbook.playbook}.yml`, output: data.output });
                        successCount++;
                    })
                    .catch(error => {
                        toast.error(`Failed to deploy ${playbook.playbook} to: ${playbook.hostIp}\n${error}`);
                        failureCount++;
                    });
            }
    });

    // Wait for all the deployments to complete
    await Promise.all(deploymentPromises.flat());

    // Show consolidated message for more than 5 deployments
    if (totalDeployments > 5) {
        if (successCount > 0) {
            toast.success(`Successfully deployed ${successCount} out of ${totalDeployments} deployments!`);
        }
        if (failureCount > 0) {
            toast.error(`Failed to deploy ${failureCount} out of ${totalDeployments} deployments!`);
        }
    }

    return deploymentOutput;

};