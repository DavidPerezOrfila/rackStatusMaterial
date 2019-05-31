import { Component, OnInit, ViewChild } from '@angular/core';
import { RackService } from '../../rack.service';
import { MatPaginator, MatTableDataSource, MatSort, PageEvent } from '@angular/material';
import { Rack } from '../shared/models/rack';
@Component({
  selector: 'app-racks',
  templateUrl: './racks.component.html',
  styleUrls: ['./racks.component.css'],
})
export class RacksComponent implements OnInit {
  racks: Rack[] = [];
  listado = this.rackService.getListado().subscribe(data => {
    const dataArray = Object.keys(data).map(i => data[i]);
    this.racks = dataArray;
  });
  // MatPaginator Inputs
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  dataSource = new MatTableDataSource<Rack>(this.racks);
  displayedColumns: string[] = ['id', 'host', 'lat', 'lng', 'ico', 'img', 'info'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private rackService: RackService) {}
  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }
}
