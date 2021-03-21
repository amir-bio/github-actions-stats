import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, } from "@chakra-ui/react"
import { extendTheme } from "@chakra-ui/react"
import { WorkflowStats } from './pages/WorkflowStats'

const colors = {
    brand: {
        900: "#1a365d",
        800: "#153e75",
        700: "#2a69ac",
    },
}
const theme = extendTheme({colors})

const App = () => {
    return (
        <WorkflowStats/>
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
