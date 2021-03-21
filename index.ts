const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});


// octokit.actions.listRepoWorkflows({
//     owner: process.env.OWNER,
//     repo: process.env.REPO,
// }).then(({data}) => console.log(data))

const main = async () => {
    const { data: specificWorkflowRuns } = await octokit.actions.listWorkflowRuns({
        owner: process.env.OWNER,
        repo: process.env.REPO,
        workflow_id: process.env.WORKFLOW_NAME,
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

        const durationMs = Date.parse(run.updated_at)- Date.parse(run.created_at)
        stats.durations[run.conclusion].push(durationMs/1000)
    }

    console.log(stats)

}

main()

