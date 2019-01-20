import { Component, OnInit, Input } from '@angular/core';
import { icon, Marker } from 'leaflet';
import * as L from 'leaflet';
import { ActivatedRoute } from '@angular/router';
import { RackService } from '../rack.service';
import { Rack } from '../components/shared/models/rack';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  rack = new Rack();
  imageUrl: string;
  w = 2048;
  h = 1152;
  markerLat: number;
  markerLng: number;

  constructor(
    private rackService: RackService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get(`id`);
    this.rackService.getRack(id).subscribe(data => {
      this.rack = {
        host: data.host,
        lat: data.lat,
        lng: data.lng,
        ico: data.ico,
        id: data.id,
        img: data.img,
        info: data.info
      };
      this.imageUrl = this.rack.img;
      this.addMap(this.imageUrl, this.rack);
    });
  }
  addMap(imagen: string, rack: Rack) {
    const map = L.map('map', {
      minZoom: 2,
      maxZoom: 5,
      center: [0, 0],
      zoom: 3,
      crs: L.CRS.Simple
    });
    const markers: any = [];
    const southWest = map.unproject([0, this.h], map.getMaxZoom());
    const northEast = map.unproject([this.w, 0], map.getMaxZoom());
    const bounds = new L.LatLngBounds(southWest, northEast);
    L.imageOverlay(imagen, bounds).addTo(map);
    map.setMaxBounds(bounds);
    // tslint:disable-next-line:prefer-const
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    Marker.prototype.options.icon = iconDefault;

    let position;
    if (rack.lat && rack.lng !== 0) {
      position = L.latLng([rack.lat, rack.lng]);
    }
    const options = { draggable: true };
    const marker: L.Marker = L.marker(position, options);
    marker.addTo(map).bindPopup(rack.host);

    const omc = function onMapClick(e) {
      marker.setLatLng(e.latlng);
      // .setContent('You clicked the map at ' + e.latlng.toString())
      // .openOn(map);
      const cadena = e.latlng
        .toString()
        .split(',')
        .toString()
        .split('(')
        .toString()
        .split(')');
      const cadena1 = cadena.toString([0]).split(',');
      rack.lat = cadena1[1];
      rack.lng = cadena1[2];
      console.log(rack);
    };
    map.on('click', omc);
    console.log(marker);
  }
}
