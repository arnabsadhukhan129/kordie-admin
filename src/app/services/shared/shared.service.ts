import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { FileSaverService } from 'ngx-filesaver'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { ToastrService } from 'ngx-toastr';
//import {Http, ResponseContentType, RequestOptions, RequestMethod} from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  queryParamData : any = {
    edituser: {user_id: '', role_slug:''},
    editcourse : {course_id:''},
    editvideo: {video_id: ''},
    dashboard :  {searchType: '', searchVal:''},
  }

  excelType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  constructor(private __fileSaverService: FileSaverService, 
              private __http: HttpClient, 
              private __route:Router,
              private toastrService : ToastrService)
  { }

  logout()
  {
    localStorage.removeItem('portal_login_token');
    localStorage.removeItem('login_role');
    localStorage.removeItem('profile_pic');
    localStorage.removeItem('login_rights');
    this.__route.navigate(['/login']);
  }

  sessionExpired()
  {
        this.toastError('Your session has been expired, Please login again to continue');
        this.logout();
  }

  exportAsExcelFile(jsonData : any = [], fileName:string = '' ): void {
    console.log(jsonData);
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    this.saveAsExcelFile(excelBuffer, 'Edninja_'+fileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: this.excelType
    });

    console.log('download--->', data);
    //saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');     //cil-data-transfer-down
    this.__fileSaverService.save(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
  }

  downloadPdf(fileUrl: string, fileName: string)
  {

       let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/pdf');

       return this.__http.get(fileUrl,
        { headers: headers, responseType: 'blob' }).subscribe((data)=>{
              console.log(data);
              var blob = new Blob([data], {type: 'application/pdf'});
              console.log(blob);
              this.__fileSaverService.save(blob, fileName+'.pdf');
          },
          err=>{
              console.log(err);
              if(err.status == 403)
                      {
                            this.sessionExpired();
                      }
              }
          )
  }


  uploadFileToS3Bucket(file: any, type : string, index:number,callback: any) {

    console.log('file type ---->',file.type, file.size);
    
    const contentType = file.type;
    const bucket = new S3(
          {
              accessKeyId: environment.amazon_s3_detail.S3_ACCESS_KEY,
              secretAccessKey: environment.amazon_s3_detail.S3_SECRET_KEY,
              region: environment.amazon_s3_detail.S3_REGION                //'ap-south-1'  //Asia Pacific (Mumbai)
          }
      );
    const current_time = new Date().getTime();  
      
     
      const params = {
          Bucket: environment.amazon_s3_detail.BUCKET_NAME,
          //Key: file.name,
          Key: environment.amazon_s3_detail.FOLDER_NAME +'/'+current_time+ file.name,
          //Key:  '/home/lp-36/Pictures/'+file.name,
          //Key: environment.amazon_s3_detail.FOLDER_NAME+'/home/lp-36/Pictures/889b86dfb255824f611c12f367f69cb6.png',
          Body: file,
          ACL: 'public-read',
          ContentType: contentType
      };
      
      
      let params1 : any = {};

      if(file.size < 5242880)
      {
            params1 = {};
      }
      else
      {
            params1 = {
              partSize: file.size,
              queueSize: 1
            };
      }

      console.log('params1:',params1);

      bucket.upload(params, params1,

        (err : any, data : any) => {

              callback(err, data, type, index);
        }
       
       );
     
}

toastError(message: string) {
  this.toastrService.clear();
  this.toastrService.error(message, 'Error !!', {
    // timeOut: 30000,
     timeOut: 8000,
    enableHtml: true,
    // closeButton: true,
    closeButton: false,
    toastClass: "alert alert-danger alert-with-icon toastErrorBlock",
    positionClass: 'toast-bottom-right'
  });
}

toastSuccess(message:string) {
  this.toastrService.clear();
  this.toastrService.success(message, 'Success !!', {
    // timeOut: 30000,
     timeOut: 8000,
    // closeButton: true,
    closeButton: false,
    enableHtml: true,
    toastClass: "alert alert-success alert-with-icon toastSuccessBlock",
    positionClass: 'toast-bottom-right'
  });
}

toastNotification(title:string,message:string) {

  this.toastrService.success(message, 'You have new notification : '+title, {
    timeOut: 8000,
    closeButton: true,
    enableHtml: true,
    toastClass: "alert alert-info alert-with-icon toastSuccessBlock",
    positionClass: 'toast-bottom-right'
  });
}


}
