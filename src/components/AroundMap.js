import React, {Component} from 'react';
import { withGoogleMap, GoogleMap, Marker , withScriptjs} from "react-google-maps"
import {POS_KEY} from "../constants";
import AroundMarker from "./AroundMarker";

class NormalAroundMap extends Component {
    getMapRef = (mapInstance) => {
        this.map = mapInstance;
        window.map = mapInstance;
    }
    getCenter() {
        const center = this.map.getCenter();
        return { lat: center.lat(), lon: center.lng() };
    }

    getRadius() {
        const center = this.map.getCenter();
        const bounds = this.map.getBounds();
        if (center && bounds) {
            const ne = bounds.getNorthEast();
            const right = new window.google.maps.LatLng(center.lat(), ne.lng());
            return 0.001 * window.google.maps.geometry.spherical.computeDistanceBetween(center, right);
        }
    }

    reloadMarker = () => {
        const center = this.getCenter();
        const radius = this.getRadius();
        // reload post-> call this.props.loadPostsByTopic
        this.props.loadPostsByTopic(center, radius);
    }
    render() {
        const{lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
        return (
                <GoogleMap
                    ref={this.getMapRef}
                    defaultZoom={8}
                    defaultCenter={{ lat: lat, lng: lon}}
                    onDragEnd={this.reloadMarker}
                    onZoomChanged={this.reloadMarker}
                >{
                    this.props.posts.map(post => <AroundMarker post={post} key={post.url}/>
                    )
                }
                </GoogleMap>
        );
    }
}
const AroundMap = withScriptjs(withGoogleMap(NormalAroundMap));
export default AroundMap;