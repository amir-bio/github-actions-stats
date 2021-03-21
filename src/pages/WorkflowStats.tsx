import React, { useState } from 'react';
import { Box, Button, Flex, HStack, Input } from "@chakra-ui/react"
import { Octokit } from "@octokit/rest";
import { VictoryAxis, VictoryChart, VictoryHistogram, VictoryLabel, VictoryVoronoiContainer } from 'victory';

const octokit = new Octokit({
    auth: process.env.REACT_APP_GITHUB_TOKEN
});

export const WorkflowStats = () => {
    // const [owner, setOwner] = useState("")
    // const [repo, setRepo] = useState("")
    // const [workflowName, setWorkflowName] = useState("")
    const [workflowRunsStats, setWorkflowRunsStats] = useState<any>({})

    // TODO: type properly
    const handleSubmit = async (event: any) => {
        event.preventDefault()
        try {
            // TODO: setup proper pagination (potentially with a request limit of 10/20 ?)
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
                },
                earliestRun: new Date(8640000000000000).getTime(),
                latestRun: new Date(-8640000000000000).getTime()
            }
            // only count completed runs
            for (const run of specificWorkflowRuns.workflow_runs) {
                if (run.status !== "completed") continue
                stats.conclusion[run.conclusion] += 1

                const createdAtTime = Date.parse(run.created_at)
                const updatedAtTime = Date.parse(run.updated_at)
                const durationMs = updatedAtTime - createdAtTime
                stats.durations[run.conclusion].push(durationMs / 1000)

                stats.earliestRun = Math.min(stats.earliestRun, createdAtTime)
                stats.latestRun = Math.max(stats.latestRun, createdAtTime)

            }

            console.log(stats)

            setWorkflowRunsStats(stats)
        } catch (e) {
            console.error("error while getting data from github", e)
        }

    }
    return (
        <Box display="flex"
             maxW="1840px"
             mx="auto"
             pt={50}
             justifyContent="center"
             flexDirection="column"
        >
            <Flex direction="row" justifyContent="center">
                <form onSubmit={handleSubmit}>
                    <HStack spacing="30px">
                        <Input placeholder="Repo owner (organisation)" name="owner"/>
                        <Input placeholder="Name of the repo" name="repo"/>
                        <Input placeholder="Name of the workflow (e.g. main.yml)" name="workflowName"/>

                        <Button w={350} type="submit">Visualize!</Button>
                    </HStack>
                </form>
            </Flex>

            {workflowRunsStats?.durations?.success && workflowRunsStats?.totalRuns && (
                <>
                    <Flex justifyContent="space-evenly" pt={10}>
                        <Flex>Total Runs: {workflowRunsStats.totalRuns}</Flex>
                        <Flex>{workflowRunsStats.conclusion.success} Successes </Flex>
                        <Flex>{workflowRunsStats.conclusion.failure} Failures</Flex>
                        <Flex>{workflowRunsStats.conclusion.cancelled} Cancelled </Flex>
                        <Flex>{workflowRunsStats.conclusion.startup_failure} Start up failure</Flex>

                    </Flex>
                    <br/>
                    Latest Run: {new Date(workflowRunsStats.latestRun).toLocaleDateString()} <br/>
                    Earliest Run: {new Date(workflowRunsStats.earliestRun).toLocaleDateString()} <br/>
                </>
            )}

            <Flex>
                {workflowRunsStats?.durations?.success && (
                    <VictoryChart
                        domainPadding={10}
                        width={1000}
                        height={300}
                        containerComponent={
                            <VictoryVoronoiContainer labels={({datum}) => `${datum.y} (${datum.x} minutes)`}/>
                        }
                    >

                        <VictoryLabel
                            x={500}
                            y={25}
                            textAnchor="middle"
                            text="Duration of successful runs"
                        />

                        <VictoryAxis dependentAxis label="Total number of runs"/>
                        <VictoryAxis label="Time (minutes)"/>

                        <VictoryHistogram
                            style={{data: {fill: "#29d05c", strokeWidth: 0}}}
                            binSpacing={20}
                            bins={50}
                            // data must be in this format: [ {x: t1}, {x: t2}, ... ]
                            // also convert duration from second to minutes
                            data={
                                workflowRunsStats.durations.success.map(successDuration => ({
                                    x: successDuration / 60
                                }))

                            }
                        />
                    </VictoryChart>
                )}
            </Flex>
        </Box>
    )
}
