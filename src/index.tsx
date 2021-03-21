import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Box, Button, Center, ChakraProvider, Flex } from "@chakra-ui/react"
import { Octokit } from "@octokit/rest";
import { extendTheme } from "@chakra-ui/react"
import { Input } from "@chakra-ui/react"

const octokit = new Octokit({
    auth: process.env.REACT_APP_GITHUB_TOKEN
});

const colors = {
    brand: {
        900: "#1a365d",
        800: "#153e75",
        700: "#2a69ac",
    },
}
const theme = extendTheme({colors})

const App = () => {
    // const [owner, setOwner] = useState("")
    // const [repo, setRepo] = useState("")
    // const [workflowName, setWorkflowName] = useState("")

    // TODO: type properly
    const handleSubmit = async (event: any) => {
        event.preventDefault()
        try {


            console.log("event.target", event.target)
            console.log("event.target.owner", event.target.owner.value)
            const {data: specificWorkflowRuns} = await octokit.actions.listWorkflowRuns({
                owner: event.target.owner.value,
                repo: event.target.repo.value,
                workflow_id: event.target.workflowName.value,
                per_page: 100,
            })


            console.log(specificWorkflowRuns)
            console.log("\n\n\n---------\n\n\n")
            const stats = {
                totalRuns: specificWorkflowRuns.total_count,
                conclusion: {
                    success: 0,
                    failure: 0,
                    cancelled: 0,
                    startup_failure: 0
                },
                // list of duration of runs in seconds for each conclusion
                durations: {
                    success: [] as number[],
                    failure: [] as number[],
                    cancelled: [] as number[],
                    startup_failure: [] as number[],
                }
            }
            // only count completed runs
            for (const run of specificWorkflowRuns.workflow_runs) {
                if (run.status != "completed") continue
                stats.conclusion[run.conclusion] += 1

                const durationMs = Date.parse(run.updated_at) - Date.parse(run.created_at)
                stats.durations[run.conclusion].push(durationMs / 1000)
            }

            console.log(stats)
        } catch (e) {
            console.error("error while getting data from github", e)
        }

    }
    return (
        <Box display="flex" maxW="1140px" mx="auto" pt={50}
             justifyContent={"center"}>
            <Flex>
                <form onSubmit={handleSubmit}>
                    <Input placeholder="Repo owner (organisation)" name="owner"/>
                    <Input placeholder="Name of the repo" name="repo"/>
                    <Input placeholder="Name of the workflow (e.g. main.yml)" name="workflowName"
                    />
                    <Center pt={5}>
                        <Button type="submit">Visualize!</Button>
                    </Center>
                </form>
            </Flex>
        </Box>
    )
}


ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <App/>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
