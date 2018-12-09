import { Component, OnInit, ViewChild } from '@angular/core';
import { RackService } from '../../rack.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Rack } from '../shared/models/rack';

@Component({
  selector: 'app-racks',
  templateUrl: './racks.component.html',
  styleUrls: ['./racks.component.css']
})
export class RacksComponent implements OnInit {
  racks: Rack[] = [];
  listado = this.rackService.getListado().subscribe(data => {
    const dataArray = Object.keys(data).map(i => data[i]);
    this.racks = dataArray;
    console.log(this.racks);
  });
  dataSource = new MatTableDataSource<Rack>(this.racks);
  displayedColumns: string[] = [
    'id',
    'host',
    'lat',
    'lng',
    'ico',
    'img',
    'info'
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private rackService: RackService) {}
  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // getListado() {
  //   this.rackService.getListado().subscribe(data => {
  //     const dataArray = Object.keys(data).map(i => data[i]);
  //     this.racks = dataArray;
  //     console.log(this.racks);
  //   });
  // }
}
