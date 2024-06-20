import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  NgForm,
} from '@angular/forms';
import { CoursesTableComponent } from './courses-table/courses-table.component';
import { CourseTableDataService } from '../../../../shared/Services/course-table-data.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    ReactiveFormsModule,
    MatMenuModule,
    OverlayModule,
    CoursesTableComponent,
    MatTooltipModule,
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent {
  constructor(private courseTableData: CourseTableDataService) {}

  displayedColumns: string[] = [
    'actions',
    'code',
    'course',
    'theoryTime',
    'practiceTime',
    'description',
    'topics',
  ];
  protected isAddCourseClicked: boolean = false;

  // REACTIVE FORM
  protected addCourseReactiveForm!: FormGroup;

  ngOnInit(): void {
    this.addCourseReactiveForm = new FormGroup({
      code: new FormControl(null, Validators.required),
      course: new FormControl(null, Validators.required),
      theoryTime: new FormControl(null, Validators.required),
      practiceTime: new FormControl(null, Validators.required),
      description: new FormControl(null, [
        Validators.required,
        Validators.maxLength(40),
      ]),
    });
  }

  protected onSubmit() {
    // console.log(this.addCourseReactiveForm.value);
    if (this.addCourseReactiveForm.valid) {
      this.courseTableData
        .addCourse(this.addCourseReactiveForm.value)
        .subscribe({
          next: (data: any) => {
            // console.log(data);
            // add snackbar
          },
          error: (err: any) => {
            console.log(err);
          },
          complete: () => {
            this.closeForm();
          },
        });
    }
  }

  closeForm() {
    this.addCourseReactiveForm.reset();
    this.isAddCourseClicked = !this.isAddCourseClicked;
    // console.log('close form', this.isAddCourseClicked);
  }

  // logic for letters / 40 in desc
  protected isDescOpen = false;
  protected lettersTypedDesc: number = 0;
  protected onInputChange(event: any) {
    this.lettersTypedDesc = event.target.value.length;
    return;
  }
}
