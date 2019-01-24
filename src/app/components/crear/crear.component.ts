import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RackService } from './../../rack.service';
import { Rack } from './../shared/models/rack';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from './mimetype.validator';

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
  mode = 'create';
  @Input() coords: any = {};
  constructor(
    private rackService: RackService,
    private location: Location,
    public route: ActivatedRoute
  ) {
    this.onMarkerChanges(this.coords);
  }

  nouRack(): void {
    this.enviado = false;
    this.rack = new Rack();
  }

  onMarkerChanges(coord: any) {
    this.coords = coord;
    console.log(this.coords);
  }

  onSaveRack() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.rack.id = 0;
      this.enviado = true;
      this.save();
      this.mensaje = 'Host creado!';
    } else {
      this.update();
      this.mensaje = 'Host actualizado!';
    }
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.rackService
      .addRack(
        this.form.value.host,
        this.form.value.lat,
        this.form.value.lng,
        this.form.value.archivo
      )
      .subscribe();
  }

  update(): void {
    this.enviado = true;
    if (this.form.value.lat !== 0 && this.form.value.lng !== 0) {
      this.form.value.lat = this.coords.lat;
      this.form.value.lng = this.coords.lng;
      this.save();
    }
    if (this.form.value.lat === 0 && this.form.value.lng === 0) {
      this.form.value.lat = 1;
      this.form.value.lng = 1;
    }

    this.rackService
      .actualizaRack(
        this.rack.id,
        this.form.value.host,
        this.form.value.lat,
        this.form.value.lng,
        this.rack.img,
        this.form.value.archivo
      )
      .subscribe(() => (this.mensaje = 'Host actualizado correctamente'));
  }

  delete(): void {
    this.enviado = true;
    this.rackService
      .borraRack(this.rack.id)
      .subscribe(() => (this.mensaje = 'Host borrado correctamente'));
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
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.rack.id = Number(paramMap.get('id'));
        this.rackService.getRack(this.rack.id).subscribe(data => {
          this.rack = {
            host: data.host,
            lat: data.lat,
            lng: data.lng,
            ico: data.ico,
            id: data.id,
            img: data.img,
            info: data.info
          };
          this.form.setValue({
            host: this.rack.host,
            lat: this.rack.lat,
            lng: this.rack.lng,
            // ico: this.rack.ico,
            // id: this.rack.id,
            // img: this.rack.img,
            archivo: this.rack.img
            // info: this.rack.info
          });
        });
      } else {
        this.mode = 'create';
        this.rack.id = null;
      }
    });
  }
}
