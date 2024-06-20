import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { BatchesProgramAddComponent } from './batches-program/batches-program-add/batches-program-add.component';
import { BatchesProgramTableComponent } from './batches-program/batches-program-table/batches-program-table.component';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  NgForm,
} from '@angular/forms';
import { BatchLayer1Data } from '../../../shared/models/batch-layer1.model';
import { MatTableDataSource } from '@angular/material/table';
import { BatchServiceService } from '../../../../shared/Services/batch-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogueComponent } from '../../../../shared/delete-dialogue/delete-dialogue.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { BatchProgramCoursesService } from 'src/app/components/shared/Services/batch-program-courses.service';
@Component({
  selector: 'app-batches-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    BatchesProgramAddComponent,
    BatchesProgramTableComponent,
  ],
  templateUrl: './batches-table.component.html',
  styleUrls: ['./batches-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0px' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class BatchesTableComponent implements OnInit {
  constructor(
    private batchService: BatchServiceService,
    private _dialog: MatDialog,
    private batchProgramCoursesService: BatchProgramCoursesService
  ) {}
  editBatchReactiveForm!: FormGroup;
  dataSource!: MatTableDataSource<BatchLayer1Data>;
  editingRowID: number = -1;
  expandedRowAdd!: any;
  expandedRowTable!: any;
  displayedColumns: string[] = [
    'actions',
    'batchCode',
    'batchName',
    'batchStartDate',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit(): void {
    console.log(this.editingRowID);
    this.getBatches();
    this.editBatchReactiveForm = new FormGroup({
      batchCode: new FormControl(null, Validators.required),
      batchName: new FormControl(null, Validators.required),
      batchStartDate: new FormControl(null, Validators.required),
    });
  }
  getBatches() {
    this.batchService.getBatches().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource<BatchLayer1Data>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  editBatch(id: number, row: BatchLayer1Data) {
    this.editingRowID = id;
    this.editBatchReactiveForm.patchValue(row);
  }

  cancelBatch() {
    this.editingRowID = -1;
    this.editBatchReactiveForm.reset();
  }
  saveBatch(row: BatchLayer1Data) {}

  deleteBatch(row: BatchLayer1Data) {
    const dialogRef = this._dialog.open(DeleteDialogueComponent, {
      data: {
        targetBatchCode: row.batchCode,
        targetBatchName: row.batchName,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.batchService.deleteBatch(row.id).subscribe({
          next: (data) => {
            this.getBatches();
          },
          error: (error) => {
            console.log(error);
          },
        });
      }
    });
  }

  // toggleRow
  isAddClicked: boolean = false;
  batchCodeForChild!: string;

  toggleAdd(row: any) {
    this.expandedRowAdd = this.expandedRowAdd == row ? null : row;
    this.isAddClicked = !this.isAddClicked;
    this.batchCodeForChild = row.batchCode;
  }

  isTableClicked: boolean = false;
  toggleTable(row: any) {
    this.expandedRowTable = this.expandedRowTable == row ? null : row;
    this.isTableClicked = !this.isTableClicked;
    this.batchCodeForChild = row.batchCode;
    this.batchProgramCoursesService.setBatchCode(row.batchCode);
  }

  recieveIsAddClicked(value: boolean) {
    this.expandedRowTable = null;
    this.expandedRowAdd = null;

    this.isAddClicked = value;
  }
}
