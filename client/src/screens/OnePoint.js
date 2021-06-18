import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles, Container, Snackbar, ListItem, ListItemIcon, ListItemText, List, Divider, AppBar, Card, CardActionArea, Toolbar, IconButton, CardMedia, CardContent, Typography, Box, CardActions, Button } from '@material-ui/core';
import { AccessibleForwardOutlined, AccessTime, AccessTimeOutlined, ArrowBack, AttachMoneyOutlined, Contactless, Info, InfoOutlined, LocationCityOutlined, LocationOnOutlined, MoneyOutlined, Phone, WcOutlined } from '@material-ui/icons';
import PersonIcon from '@material-ui/icons/Person';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
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
    const { userId } = useParams();
    const [pointProp, setPointProp] = useState();
    const [loading, setLoading] = useState(true)
    console.log('111', userId)
    const [snackbarStatus, setOpenSnackbar] = React.useState(false);
    const [isAvailable ,pointIsntAvailable ]=useState(true);
    // const pointIsntAvailable = () =>{
    //     pointProp.isAvailable=false;
    //     console.log("the point is unavailable")
    // }
    const ratePoint = () => {
        fetch("/api/distributionPoint/newRating", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                user_id: userId,
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
                    setPointProp(data)
                    setOpenSnackbar(true)


                }
            }).catch(err => {
                //setErrorStatus(true)
                //setErrorMessage(err)
                console.log(err)
            })
    }

    useEffect(() => {
        console.log("onePoint useEffect triggered")
        fetch("/api/distributionPoint/onePoint", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                point_id: userId



            })
        }).then(res => res.json())
            .then(data => {
                console.log("user number ", userId);

                console.log("get onePoint msg ", data);
                if (data.error) {

                    console.log("didnt get onePoint msg ", data.error);

                }
                else {
                    console.log(data)
                    setPointProp(data)
                    setLoading(false)
                }
            }).catch(err => {
                //setErrorStatus(true)
                //setErrorMessage(err)
                console.log("didnt get onePoint msg ", err)
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

            {pointProp.photos.length > 1 ?
                < SingleLineGridList imageLinks={pointProp.photos.slice(1, pointProp.photos.length)} name={pointProp.landmarkName} />

                :
                < NoImage imageLinks={["https://i2.wp.com/blog.scoutingmagazine.org/wp-content/uploads/sites/2/2011/04/volunteer-wordart-highres.jpg?resize=678%2C381&ssl=1"]} />}

            <p></p>
            <p></p>
            <Container maxWidth="xs" align="center">



                <Card className={classes.root} elevation={0}>
                    <CardActionArea>

                        <CardContent>
                            <Typography gutterBottom variant="h4" component="h4">
                                {pointProp.landmarkName}
                            </Typography>
                            <Typography gutterBottom variant="h6" component="h6" aria-label="Volunteer name: ">
                                {pointProp.volunteer}
                            </Typography>
                        
                        </CardContent>
                    </CardActionArea>

                </Card>
                <div>
                    <List component="nav" aria-label="main mailbox folders">
                        <ListItem button>
                            <ListItemIcon >
                                <LocationOnOutlined className={iconMakeup.root} />
                            </ListItemIcon>
                            <ListItemText primary={pointProp.landmarkName} />
                        </ListItem>
                        {/* {pointProp.differentlyAbled ? <ListItem button>
                            <ListItemIcon >
                                <AccessibleForwardOutlined className={iconMakeup.root} />
                            </ListItemIcon>
                            <ListItemText primary="Differently Abled Friendly" />
                        </ListItem> : null} */}

                        <Divider />
                        <ListItem button>
                            <ListItemIcon>
                                <PersonIcon className={iconMakeup.root} />
                            </ListItemIcon>
                            <ListItemText primary={pointProp.volunteer} />
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <ListItemIcon>
                                <AccessTimeOutlined className={iconMakeup.root} />
                            </ListItemIcon>
                            <ListItemText primary={isAvailable ? " The volunteer will arrive from 9 AM to 1 PM " : "Closed"} />
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <ListItemIcon>
                                <CalendarTodayIcon className={iconMakeup.root} />
                            </ListItemIcon>
                            <ListItemText primary={pointProp.distributionDate} />
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <ListItemIcon>
                                <Phone className={iconMakeup.root} />
                            </ListItemIcon>
                            <ListItemText primary={(pointProp.owner && pointProp.owner.phone) ? pointProp.owner.phone : "6000439169"} />
                        </ListItem>
                        <ListItem button>
                            <Button onClick={() => pointIsntAvailable(false)} color="primary" on fullWidth type="submit" variant="contained">
                             Package delivered
                            </Button>
                        </ListItem>

                    </List>



                </div>
            </Container>


        </div>
        );

    }






}

export default OnePoint;