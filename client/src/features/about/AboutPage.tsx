import { ButtonGroup, Typography, Button, Alert, AlertTitle, List, ListItem, ListItemText } from "@mui/material";
import { Container } from "@mui/system";
import { useState } from "react";
import agent from "../../app/api/agent";

export default function AboutPage() {
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    function getValidationError(){
        agent.TestErrors.getValidationError()
            .then(() => console.log('should not see this'))
            .catch(error => setValidationErrors(error));
    }
    
    return (
        <Container>
            <Typography gutterBottom variant="h2">Errors for testing purposes</Typography>
            <ButtonGroup fullWidth>
                <Button variant='contained'
                    onClick={() =>
                        agent.TestErrors
                            .get400Error()
                            .catch(error => console.log(error))}>
                    Bad Request Error
                </Button>
                <Button variant='contained'
                    onClick={() =>
                        agent.TestErrors
                            .get401Error()
                            .catch(error => console.log(error))}>
                    Unauthorised Error
                </Button>
                <Button variant='contained'
                    onClick={() =>
                        agent.TestErrors
                            .get404Error()
                            .catch(error => console.log(error))}>
                    Not Found Error
                </Button>
                <Button variant='contained'
                    onClick={() =>
                        agent.TestErrors
                            .get500Error()
                            .catch(error => console.log(error))}>
                    Server Error
                </Button>
                <Button variant='contained'
                    onClick={getValidationError}>
                    Validation Error
                </Button>
            </ButtonGroup>
            {validationErrors.length > 0 &&
                <Alert severity="error">
                    <AlertTitle>Validation Errors</AlertTitle>
                    <List>
                        {validationErrors.map(error => (
                            <ListItem key={error}>
                                <ListItemText>{error}</ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Alert>
            }
        </Container>
    )
}