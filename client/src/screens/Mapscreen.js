import React, { useEffect, useLayoutEffect } from "react";
import { NavLink } from 'react-router-dom'
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { formatRelative } from "date-fns";
import { ReactComponent as PersonLogo } from  '../icons/person-24px.svg';
import { ReactComponent as FilterLogo } from  '../icons/filter-24px.svg';
import "@reach/combobox/styles.css";
import { KeyboardReturnOutlined, SearchOutlined } from "@material-ui/icons";
import mapStyles from "./mapStyles";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ExploreIcon from '@material-ui/icons/Explore';
import { Card, CardActions,Chip, Avatar, Box, Fab,  Typography, Button, CardContent, makeStyles, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import {AccessibleForward, AirlineSeatLegroomExtra, Info, Person, PersonAddDisabled, PlayCircleFilledWhite, PregnantWoman, Wc} from '@material-ui/icons'; 
import { indigo } from "@material-ui/core/colors";
import { withTheme } from "@material-ui/styles";
import Rating from '@material-ui/lab/Rating';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "white", 
    
  },
  icons:
  {
    fill:indigo[800], 
  }
}));

const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: false,
};
const center = {
  lat: 51.501286,
  lng: 0.046541,
};  
console.log('3333',process.env.REACT_APP_GOOGLE_MAPS_API_KEY)
const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [currentLat, setLat] = React.useState(51.501286);
  const [currentLng, setLng] = React.useState(0.046541);
  const [zoom, setZoom] = React.useState(14);
  const [doneWithMapLoad, doneMapLoad] = React.useState(false);


  
  
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
    doneMapLoad(true)
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
    searchPoints()
    //changePositionState();
  }, []);

  /*
  const changePositionState = () =>{
    
    console.log("Position changed.")
    
    setLat(mapRef.current.getCenter().lat());
    setLng(mapRef.current.getCenter().lng());
    changeZoomState();
  } 
  const changeZoomState = () => {
    if(!doneWithMapLoad){
      return 0; 
    }
    setZoom(mapRef.current.getZoom())
    if(zoom<=12){
      handleExtraZoom()
    }
    else{
      handleSnackbarClose()
    }
  }*/
  const searchPoints = ()=>{
    setZoom(mapRef.current.getZoom())
    setLat(mapRef.current.getCenter().lat());
    setLng(mapRef.current.getCenter().lng());
    return;
  }
  
  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  

  return (
    <div>
    
      
    <Button variant="contained" size="medium" className="searchFab" color="primary" onClick={searchPoints} >
      <ExploreIcon />
         Search for nearby distribution point
    </Button>
  
    <NavLink to="/profile" className="profile"><PersonLogo className="profile" /></NavLink>
    <NavLink to="/filter" className="filter"><FilterLogo className="filter" /></NavLink>
    
    <Locate panTo={panTo} />
    <Search panTo={panTo} />

      <GoogleMap
        key="map"
        mapContainerStyle={mapContainerStyle}
        zoom={zoom}
        center={center}
        options={options}
        // onClick={onMapClick}
        onLoad={onMapLoad}
        // onDragEnd={changePositionState}
        // onZoomChanged={changeZoomState}
      >
      


      <Markers key={currentLat*currentLng} currentLat={currentLat} currentLng={currentLng} zoom={zoom} ></Markers>

      
      
      
      
      </GoogleMap>
    </div>
  );
}

function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img src="./my_loc.svg" alt="loc" />
    </button>
  );
}

function Search({ panTo }) {
  const {ready,value,suggestions: { status, data },setValue,clearSuggestions,} = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.6532, lng: () => -79.3832 },
      radius: 70 * 1000,
    },
  });

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("???? Error: ", error);
    }
  };

  return (
    <div className="search">
      
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}



const Markers = ({currentLat, currentLng}) => {
  const [points, setPoints] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const chipStyle = useStyles(); 
  
  const handleZeroPoints = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    setSnackbarOpen(false);
  };
  
  useLayoutEffect(()=>{   
    console.log("mapScreen useEffect triggered")
     fetch('/api/distributionPoint/allPoints',{
      method:"GET",
            headers:{
                "Content-Type":"application/json", 
                "Authorization":"Bearer "+localStorage.getItem("jwt"), 
            },
    }).then(res=>res.json())
    .then(result=>{
          console.log("Found points, "+result.length+" points"); 
          if(result.length===0){
            handleZeroPoints();
          }
         
          const filter=JSON.parse(localStorage.getItem("filterSettings"));

          var filteredPoint=[];
          if(!filter||!result||result.length===0){
            setPoints(result);
            console.log("no filter or distribution point found.");
            return;
          }
          result.forEach((distributionPoint) => {
           
            var distributionPointFits=true;
            console.log("99999999999",distributionPoint.volunteer)
            console.log("123456789",filter.userFilter)

            if(filter && distributionPoint.volunteer!==filter.userFilter){
              console.log("@@   ",{distributionPoint, filter}) 
              distributionPointFits=false;
            }
            if(distributionPointFits){
              console.log("!!    ",{distributionPoint, filter})
              filteredPoint.push(distributionPoint);
            }
           
        });
        setPoints(filteredPoint); 
        
        console.log("Filtered points, "+filteredPoint.length+" distribution points");
    }).catch(err => {
      console.log("error loading points ",err)
  })
 },[])

 const handleMarkerClick = (marker) => {
  fetch("/api/distributionPoint/onePoint", {
    method: "post",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
    },
    body: JSON.stringify({
      point_id: marker._id
    })
  })
  .then(res => res.json())
  .then(data => {
        console.log("get onePoint msg ",data);
        setSelected(data)
    }).catch(err => {
        console.log("didn't get onePoint msg ",err)
    })
    //setSelected(marker)
}

 return(
   <div>
     {points.map((marker) => (
          <Marker
            key={`${marker._id}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              handleMarkerClick(marker);
              //setSelected(marker);
            }}
            
            icon ={{
              url: `https://icon-library.com/images/icon-marker/icon-marker-12.jpg`,
              
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(50, 50),
            }}
          />
        ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
            <Card>
            <CardContent>
            
            
            <Typography variant="body2" component="p">
                  {selected.landmarkName}
            </Typography>
            
            {/* <Box component="fieldset" borderColor="transparent">
                  {selected.avgRating > 0 ? <Rating name="read-only" value={selected.avgRating > 0 ? selected.avgRating: 0} readOnly />: null}
            </Box> */}
            <div>
                  {/* {selected.differentlyAbled ? 
                  <span><Chip variant="outlined" icon={<AccessibleForward className={chipStyle.icons}/>} size="small" label="Different abled friendly" className = {chipStyle.root}/>&nbsp;</span> 
                   : null} */}
                  
                  {!selected.volunteer ? <span> <Chip  variant="outlined" icon={<AirlineSeatLegroomExtra className={chipStyle.icons}/>}   size="small" label="Commode" className = {chipStyle.root}/>&nbsp; </span>: null}
                  

                  
                 
                 
            </div>
            
            
            
            
            
            </CardContent>
            <CardActions>
                <NavLink to={'/one_point/'+selected._id}><Chip  icon= {<Info style={{color:"white"}}/>} label = "Details" style={{backgroundColor:"#3f50b5", color:"white", fontWeight:"bold"}}></Chip></NavLink>     
            </CardActions>
            </Card>
            </div>
          </InfoWindow>
        ) : null}

    <Snackbar 
            open={snackbarOpen} 
            autoHideDuration={5005} 
            onClose={handleSnackbarClose}
            style={{ height: "100%" }} 
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}>

        <Alert onClose={handleSnackbarClose} severity="warning">
          No distribution point were found in this area!
        </Alert>
      </Snackbar>
   
   </div>
 )

}

export default Map;