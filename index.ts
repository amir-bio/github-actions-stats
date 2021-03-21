import { Octokit } from "@octokit/rest";

const octokit = new Octokit();

octokit.repos
  .listForOrg({
    org: "octokit",
    type: "public",
  })
  .then(({ data }) => {
    console.log(data)
  });
