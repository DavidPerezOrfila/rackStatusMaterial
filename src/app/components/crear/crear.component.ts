import { RackService } from './../../rack.service';
import { Rack } from './../shared/models/rack';
import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent {
  rack = new Rack();
  enviado = false;
  mensaje: string;

  constructor(private rackService: RackService, private location: Location) {}

  nouRack(): void {
    this.enviado = false;
    this.rack = new Rack();
  }

  addRack() {
    this.rack.id = 0;
    this.enviado = true;
    this.save();
    this.mensaje = 'Host creado!';

    // this.location.back();
  }

  goBack(): void {
    this.location.back();
  }

  private save(): void {
    this.rackService.crearRack(this.rack).subscribe();
  }
}
