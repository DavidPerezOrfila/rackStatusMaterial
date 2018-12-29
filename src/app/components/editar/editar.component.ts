import { RackService } from './../../rack.service';
import { Rack } from './../shared/models/rack';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {
  rack = new Rack();
  enviado = false;
  mensaje: string;
  form: FormGroup;
  imgPreview: string;

  constructor(
    private rackService: RackService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get(`id`);
    this.rackService.getRack(id).subscribe(data => (this.rack = data));
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ archivo: file });
    this.form.get('archivo').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imgPreview = <string>reader.result;
    };
    reader.readAsDataURL(file);
    console.log(file);
    console.log(this.form);
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

  goBack(): void {
    this.location.back();
  }
}
