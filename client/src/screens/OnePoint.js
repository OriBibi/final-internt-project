import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles, Container, Snackbar, ListItem, ListItemIcon, ListItemText, List, Divider, AppBar, Card, CardActionArea, Toolbar, IconButton, CardMedia, CardContent, Typography, Box, CardActions, Button } from '@material-ui/core';
import { AccessibleForwardOutlined, AccessTime, AccessTimeOutlined, ArrowBack, AttachMoneyOutlined, BathtubOutlined, Contactless, Info, InfoOutlined, LocationCityOutlined, LocationOnOutlined, MoneyOutlined, Phone, WcOutlined } from '@material-ui/icons';
import PersonIcon from '@material-ui/icons/Person';
import { Rating } from '@material-ui/lab'
import MuiAlert from '@material-ui/lab/Alert';
import SingleLineGridList from '../widgets/Carousel';
import NoImage from '../widgets/NoImage';
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 200,
    },
});

const iconStyles = makeStyles({
    root: {
        fill: "#3f50b5"

    },
    media: {

    },
});

const OnePoint = () => {
    const { toiletId } = useParams();
    const [toiletProp, setToiletProp] = useState();
    const [loading, setLoading] = useState(true)
    console.log('111', toiletId)
    const [snackbarStatus, setOpenSnackbar] = React.useState(false);

    const rateToilet = () => {
        fetch("/api/distributionPoint/newRating", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                toilet_id: toiletId,
                rating: stars



            })
        }).then(res => res.json())
            .then(data => {

                console.log('222', data);
                if (data.error) {

                    console.log(data.error);

                }
                else {
                    console.log(data)
                    setToiletProp(data)
                    setOpenSnackbar(true)


                }
            }).catch(err => {
                //setErrorStatus(true)
                //setErrorMessage(err)
                console.log(err)
            })
    }

    useEffect(() => {
        fetch("/api/distributionPoint/onePoint", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                toilet_id: toiletId



            })
        }).then(res => res.json())
            .then(data => {

                console.log(data);
                if (data.error) {

                    console.log(data.error);

                }
                else {
                    console.log(data)
                    setToiletProp(data)
                    setLoading(false)
                }
            }).catch(err => {
                //setErrorStatus(true)
                //setErrorMessage(err)
                console.log(err)
            })
    }, [])
    const [stars, setStars] = React.useState(2);
    const classes = useStyles();
    const iconMakeup = iconStyles();
    const history = useHistory();
    if (loading) {
        return (<div>

        </div>)
    }
    else {
        return (<div>
            <AppBar position="static" color="secondary" elevation={0} >
                <Toolbar>
                    <IconButton edge="start" color="primary" aria-label="menu">
                        <ArrowBack onClick={
                            history.goBack
                        } />
                    </IconButton>
                    <Typography variant="h6">

                    </Typography>

                </Toolbar>
            </AppBar>

            {toiletProp.photos.length > 1 ? 
                       < SingleLineGridList imageLinks = {toiletProp.photos.slice(1, toiletProp.photos.length)} name={toiletProp.landmarkName} />
                      
                      : 
                      < NoImage imageLinks = {["https://i2.wp.com/blog.scoutingmagazine.org/wp-content/uploads/sites/2/2011/04/volunteer-wordart-highres.jpg?resize=678%2C381&ssl=1"]} />}
            
            <p></p>
            <p></p>
            <Container maxWidth="xs" align="center">



                <Card className={classes.root} elevation={0}>
                    <CardActionArea>

                        <CardContent>
                            <Typography gutterBottom variant="h4" component="h4">
                                {toiletProp.landmarkName}
                            </Typography>
                            <Typography gutterBottom variant="h6" component="h6" aria-label="Volunteer name: ">
                                {toiletProp.volunteer}
                            </Typography>
                            {/* <Typography variant="body2" color="textSecondary" component="p">

                            
                               
                                   <Rating name="read-only" value={toiletProp.avgRating > 0 ? toiletProp.avgRating : 1} />
                                   <Box ml={2}>{toiletProp.avgRating <= 0 ? 2: toiletProp.avgRating }/5.0 (average)</Box>
                               
                            </Typography> */}
                        </CardContent>
                    </CardActionArea>

                </Card>
                <div>
                    <List component="nav" aria-label="main mailbox folders">
                        <ListItem button>
                            <ListItemIcon >
                                <LocationOnOutlined className={iconMakeup.root} />
                            </ListItemIcon>
                            <ListItemText primary={toiletProp.landmarkName} />
                        </ListItem>
                        {toiletProp.differentlyAbled ? <ListItem button>
                            <ListItemIcon >
                                <AccessibleForwardOutlined className={iconMakeup.root} />
                            </ListItemIcon>
                            <ListItemText primary="Differently Abled Friendly" />
                        </ListItem> : null}

                        <Divider />
                        <ListItem button>
                            <ListItemIcon>
                                <PersonIcon className={iconMakeup.root} />
                            </ListItemIcon>
                            <ListItemText primary={toiletProp.volunteer} />
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <ListItemIcon>
                                <AccessTimeOutlined className={iconMakeup.root} />
                            </ListItemIcon>
                            <ListItemText primary={toiletProp.isAvailable ? " The volunteer will arrive from 9 AM to 1 PM " : "Closed"} />
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <ListItemIcon>
                                <Phone className={iconMakeup.root} />
                            </ListItemIcon>
                            <ListItemText primary={(toiletProp.owner && toiletProp.owner.phone) ? toiletProp.owner.phone : "6000439169"} />
                        </ListItem>

                    </List>
                    {/* <Card elevation={0}>
                        <CardActionArea>
                            <CardMedia


                                title="landmarkName"


                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Rate this restroom
              </Typography>
                                <Typography color="textSecondary">
                                    Tell us about your perception of social hygiene
            </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">

                                    <Box component="fieldset" borderColor="transparent">

                                        <Rating name="read-only" value={stars}
                                            onChange={(event, newValue) => {
                                                setStars(newValue);
                                            }} />
                                    </Box>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" onClick={() => { rateToilet() }}>SUBMIT</Button>
                        </CardActions>
                    </Card> */}


                </div>
            </Container>
            {/* <Snackbar open={snackbarStatus} autoHideDuration={6000} onClose={(e) => { setOpenSnackbar(false) }}>
                <Alert onClose={(e) => { setOpenSnackbar(false) }} severity="success">
                    Your rating has been submitted
                </Alert>
            </Snackbar> */}

        </div>
        );

    }






}

export default OnePoint;