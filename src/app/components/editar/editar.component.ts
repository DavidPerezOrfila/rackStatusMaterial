import { RackService } from './../../rack.service';
import { Rack } from './../shared/models/rack';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styles: []
})
export class EditarComponent implements OnInit {
  rack = new Rack();
  enviado = false;
  mensaje: string;
  envFoto = false;
  archivo: File;

  constructor(
    private rackService: RackService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get(`id`);
    this.rackService.getRack(id).subscribe(data => (this.rack = data));
  }

  update(): void {
    this.enviado = true;
    this.rackService
      .actualizaRack(this.rack)
      .subscribe(() => (this.mensaje = 'Host actualizado correctamente'));
  }

  delete(): void {
    this.enviado = true;
    this.rackService
      .borraRack(this.rack.id)
      .subscribe(() => (this.mensaje = 'Host borrado correctamente'));
  }

  onFileSelected(file: File) {
    if (!file) {
      this.archivo = null;
      return;
    }
    this.archivo = file;
    console.log(this.archivo);
    return this.archivo;
  }

  goBack(): void {
    this.location.back();
  }
}
