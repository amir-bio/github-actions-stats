import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
    Box, Button,
    ChakraProvider,
    Flex,
    Grid,
    GridItem,
    HStack, Input,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from "@chakra-ui/react"
import { extendTheme } from "@chakra-ui/react"
import { WorkflowStats } from './pages/WorkflowStats'
import { Octokit } from "@octokit/rest";

const colors = {
    brand: {
        activeBlue: "#0566d6",
        900: "#1a365d",
        800: "#153e75",
        700: "#2a69ac",
    },
}
const theme = extendTheme({colors})

const tabStyle = {
    borderRadius: "5px",
    justifyContent: "left",
}

const selectedTabStyle = {
    color: "white",
    bg: "brand.activeBlue",
    borderRadius: "5px",
    justifyContent: "left",
}

const octokit = new Octokit({
    auth: process.env.REACT_APP_GITHUB_TOKEN
});


const App = () => {
    const [owner, setOwner] = useState("")
    const [repo, setRepo] = useState("")
    const [workflowsList, setWorkflowsList] = useState<any>([])

    // TODO: type properly
    const handleSubmit = async (event: any) => {
        event.preventDefault()
        try {
            const {data} = await octokit.actions.listRepoWorkflows({
                owner: event.target.owner.value,
                repo: event.target.repo.value,
            })
            setOwner(event.target.owner.value)
            setRepo(event.target.repo.value)
            setWorkflowsList(data.workflows)
        } catch (e) {
            console.error("error while getting list of repo workflows from github", e)
        }
    }

    return (
        <>
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

                            <Button w={350} type="submit">Visualize!</Button>
                        </HStack>
                    </form>
                </Flex>

                <Tabs isLazy orientation="vertical" variant={"solid-rounded"} align={"center"}
                      sx={{textAlign: "left"}}>
                    <Grid
                        h="200px"
                        templateRows="repeat(2, 1fr)"
                        templateColumns="repeat(5, 1fr)"
                        gap={4}
                    >

                        <GridItem colSpan={1}>
                            <TabList>
                                {!!workflowsList && workflowsList.map(workflow => (
                                    <Tab
                                        sx={tabStyle}
                                        _hover={{bg: "gray.100", color: "gray.600"}}
                                        _selected={selectedTabStyle}
                                    >
                                        {workflow.name}
                                    </Tab>
                                ))}

                            </TabList>
                        </GridItem>
                        <GridItem colSpan={3}>
                            <TabPanels>
                                {!!workflowsList && workflowsList.map(workflow => (
                                    <TabPanel>
                                        <WorkflowStats workflowId={workflow.id} owner={owner} repo={repo}/>
                                    </TabPanel>
                                ))}
                            </TabPanels>

                        </GridItem>

                    </Grid>
                </Tabs>
            </Box>
        </>
    )
}


ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider theme={theme} resetCSS>
            <App/>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
