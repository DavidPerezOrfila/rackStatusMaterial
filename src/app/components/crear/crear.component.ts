import { RackService } from './../../rack.service';
import { Rack } from './../shared/models/rack';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {
  rack = new Rack();
  enviado = false;
  mensaje: string;
  form: FormGroup;
  imgPreview: string;

  constructor(
    private rackService: RackService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  nouRack(): void {
    this.enviado = false;
    this.rack = new Rack();
  }

  addRack() {
    if (this.form.invalid) {
      return;
    }
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
    this.rack.host = this.form.value.host;
    this.rack.lat = this.form.value.lat;
    this.rack.lng = this.form.value.lng;
    this.rackService.crearRack(this.rack).subscribe();
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
  }

  ngOnInit() {
    this.form = new FormGroup({
      host: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      lat: new FormControl(null, {
        validators: [Validators.required]
      }),
      lng: new FormControl(null, {
        validators: [Validators.required]
      }),
      archivo: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }
}
