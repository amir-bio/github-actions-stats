# Github Actions Stats

Statistics for your Github Actions to help analyse and optimise your workflows.

This project provides a CLI that can be used to analyse your github actions over time.
The resulting analysis can be used to monitor the duration of workflows over time and bea valuable tool for measuring
effect of changes to the pipeline, thereby helping to find which optimisations are optimal for your actions. 

## 🌟 Features


## How it works?

Long term: cache all fetched data and only retrieve again if not already cached.

## 🌟 Upcoming Features
- List all workflows
- List all runs for a workflow (up to last 100)
- Provide number of workflows that successed, and the ones that failed (future: more detailed explanation of failed, 
    e.g. cancelled vs failed; failed after how long?)
- Provide basic stats for the given runs for a workflow, e.g. min, max, mean, 80th, 90th, 95th, 99th percentile
- List all runs for a workflow with a variable time based start window
- Number of workflows run per day (with possibility of filtering by a given workflow)
- Filtering based on the branch that workflows ran on? 
- App to provide better UI/UX and allow for more sophisticated expansions and actions
