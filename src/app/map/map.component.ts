import { Component, OnInit, Input } from '@angular/core';
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
      this.addMap(this.imageUrl);
    });
  }
  addMap(imagen: string) {
    const map = L.map('map', {
      minZoom: 2,
      maxZoom: 5,
      center: [0, 0],
      zoom: 3,
      crs: L.CRS.Simple
    });
    const southWest = map.unproject([0, this.h], map.getMaxZoom());
    const northEast = map.unproject([this.w, 0], map.getMaxZoom());
    const bounds = new L.LatLngBounds(southWest, northEast);
    console.log(imagen);
    L.imageOverlay(imagen, bounds).addTo(map);

    map.setMaxBounds(bounds);
  }
  addItem(map, markers, item) {
    const name = item.name;
    const position = L.latLng([item.position.lat, item.position.lng]);
    const options = { draggable: true };
    const marker: L.Marker = L.marker(position, options)
      .addTo(map)
      .bindPopup(name);
    markers.push(marker);
  }
}
