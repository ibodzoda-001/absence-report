import {Component, OnInit} from '@angular/core';
import {AppService} from '../app.service';
import {Group} from '../headmen/headmen.model';
import {Absent} from './absent.model';
import {Student} from '../group/group.model';
import {UploadFile} from 'ng-zorro-antd';
import {Observable} from 'rxjs';

function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@Component({
  selector: 'app-absent',
  templateUrl: './absent.component.html',
  styleUrls: ['./absent.component.css']
})
export class AbsentComponent implements OnInit {

  fileList: UploadFile[] = [];
  transactionImagesIdList = [];
  previewImage: string | undefined = '';
  previewVisible = false;

  currentGroupId: number = null;
  currentGroupName: string = null;
  currentMonth: string = null;
  groups: Group[] = [];
  userInfo: { groupName: string, groupId: number, userType: string };
  absents: Absent[] = [];
  months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  students: Student[] = [];
  totalHours: number[] = [];
  reasonableHours: number[] = [];

  constructor(private appService: AppService) {
  }

  getStudentTableData() {
    this.getGroupAbcents();
    this.getAllStudents();
  }

  getGroupAbcents() {
    if (this.currentGroupId !== null && this.currentMonth !== null) {
      this.appService.getGroupAbsentsByGroupIdAndMonth(this.currentGroupId, this.currentMonth).subscribe(
        (response) => {
          console.log(response);
          this.absents = response;
          if (this.groups.length !== 0) {
            this.groups.forEach(group => {
              if (this.currentGroupId === group.id) {
                this.currentGroupName = group.title;
              }
            });
          }
          if (this.students.length !== 0) {
            this.students.forEach((element, index) => {
              this.totalHours[index] = 0;
              this.reasonableHours[index] = 0;
            });
          }
        },
        (error) => {
        }
      );
    }
  }

  getAllGroups() {
    this.appService.getAllGroups().subscribe(
      (response) => {
        this.groups = response;
        if (this.currentGroupId === null) {
          this.currentGroupId = response[0].id;
          this.currentGroupName = response[0].title;
        }
      },
      (error) => {
      }
    );
  }

  getAllStudents() {
    this.appService.getAllStudents().subscribe(
      (response) => {
        response.forEach((element, index) => {
          this.totalHours[index] = 0;
          this.reasonableHours[index] = 0;
        });
        this.students = response;
      },
      (error) => {
      }
    );
  }

  saveAbsents() {
    const arrOfAbsenses = [];
    this.students.forEach((student, index) => {
      const obj = {
        total: this.totalHours[index],
        reasonable: this.reasonableHours[index],
        unreasonable: this.totalHours[index] - this.reasonableHours[index],
        studentId: student.id
      };
      arrOfAbsenses.push(obj);
    });
    const mainObj = {
      month: this.currentMonth,
      studentAbsenseDto: arrOfAbsenses
    };
    this.appService.saveAbsenses(mainObj).subscribe(
      (response) => {
        this.getGroupAbcents();
      },
      (error) => {
      }
    );
  }

  handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  };

  handleUpload = (item: any) => {
    const formData = new FormData();

    formData.append(item.name, item.file as any, 'file');

    this.appService.uploadReferenceImage(formData).subscribe(
      (response) => {
        this.transactionImagesIdList.push(response.id);
        item.onSuccess(item.file);
        this.fileList[this.fileList.length - 1].uid = String(response.id);
      },
      (error) => {
        item.onError(error, item.file);
      }
    );

  };

  deleteImage = (file: UploadFile) => new Observable<boolean>((obs) => {
    this.appService.deleteReferenceImage(file.uid).subscribe(
      () => {
        const idIndex = this.transactionImagesIdList.findIndex(id => id === (+file.uid));
        this.transactionImagesIdList.splice(idIndex, 1);
        obs.next(true);
      },
      (er) => {
        obs.next(false);
      }
    );
  });

  ngOnInit(): void {
    const now: Date = new Date();
    this.currentMonth = this.months[now.getMonth()];
    this.userInfo = JSON.parse(localStorage.getItem('user-info'));
    this.currentGroupId = this.userInfo.groupId;
    this.currentGroupName = this.userInfo.groupName;
    this.getAllGroups();
    if (this.userInfo.groupId !== null) {
      this.getStudentTableData();
    }
  }

}
