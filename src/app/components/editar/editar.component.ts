import { RackService } from './../../rack.service';
import { Rack } from './../shared/models/rack';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../crear/mimetype.validator';
import { ActivatedRoute } from '@angular/router';

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

    this.form = new FormGroup({
      host: new FormControl(this.rack.host, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      lat: new FormControl(null, {
        validators: [Validators.required]
      }),
      lng: new FormControl(null, {
        validators: [Validators.required]
      }),
      id: new FormControl(null, {
        validators: [Validators.required]
      }),
      ico: new FormControl(null),
      img: new FormControl(null),
      info: new FormControl(null),
      archivo: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.rackService.getRack(id).subscribe(
      data => (
        (this.rack = {
          host: data.host,
          lat: data.lat,
          lng: data.lng,
          ico: data.ico,
          id: data.id,
          img: data.img,
          info: data.info
        }),
        this.form.setValue({
          host: this.rack.host,
          lat: this.rack.lat,
          lng: this.rack.lng,
          ico: this.rack.ico,
          id: this.rack.id,
          img: this.rack.img,
          info: this.rack.info
        })
      )
    );
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
