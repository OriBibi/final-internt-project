
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import { Close } from '@material-ui/icons';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NoImage from '../widgets/NoImage';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(3),
    },
}));


const Filter = () => {
    const getUsersFromDB = () => {
        fetch("/api/profile/getUsers", {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
    
          })
        }).then(res => res.json())
          .then(data => {
    
            if (data.error) {
              alert(data.error)
            }
            else {
              setNameOfAllUsers(data.users)
              //  setNameOfAllUsers(data.users.values())
              //console.log("User data from DB by getUsersFromDB()", data.users);
              //console.log("typeof",typeof data.users); 
              //console.log("nameOfAllUsers",nameOfAllUsers); 
            }
          }).catch(err => {
            console.log(err)
          })
      }
    
    const classes = useStyles();

    const history = useHistory()
    const [userFilter, setUser] = useState("")
    const [nameOfAllUsers, setNameOfAllUsers] = useState(
        []);
        const [filter,setFilter] = useState("")
        

    const filterResults = () => {

        localStorage.setItem("filterSettings", JSON.stringify({ userFilter }))
        history.push("/");
    }
    useEffect(() => {
        var filter = JSON.parse(localStorage.getItem("filterSettings"));
        if (!filter) {
            filter = {
                userFilter: userFilter,
            }
        }
        setFilter(filter.userFilter);
        console.log('filter ', filter.userFilter);

    })

    return (
        <div>

            <AppBar position="static" color="secondary" elevation={0}>
                <Toolbar>
                    <IconButton edge="start" color="primary" aria-label="menu">
                        <Close onClick={
                            history.goBack
                        } />
                    </IconButton>


                </Toolbar>
            </AppBar>
            {
                < NoImage imageLinks={["https://i2.wp.com/blog.scoutingmagazine.org/wp-content/uploads/sites/2/2011/04/volunteer-wordart-highres.jpg?resize=678%2C381&ssl=1"]} />}

            <p></p>
            <p></p>
            <Container className={classes.container} maxWidth="xs" paddingTop="20vh">
                <form onSubmit={(e) => { e.preventDefault() }}>
                    <Grid container
                        spacing={3}

                    >
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h4" align="center">Filter Search Results</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1" align="center">Tip: Leave the field blank if you don't have a preference.</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Select
                                        label="Users:"
                                        variant="filled"
                                        fullWidth id="user"
                                        onClick={getUsersFromDB()}
                                        onChange={(event) => {
                                            setUser(event.currentTarget.dataset.value);
                                        }}
                                    >
                                        {nameOfAllUsers.map(userName => (<MenuItem key={userName} value={userName} >{userName}</MenuItem>))}
                                    </Select>
                                    {/* <MenuItem value="true">{getUsersFromDB()}</MenuItem> */}
                                </Grid>

                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Button color="primary" fullWidth type="submit" variant="contained" onClick={() => filterResults()}>
                                Done
                </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </div>

    );
};

export default Filter;