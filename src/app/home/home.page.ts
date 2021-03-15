import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {AngularFirestore } from '@angular/fire/firestore'; 
import { AngularFireStorage} from '@angular/fire/storage'; 
import * as firebase from 'firebase/app'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  clickedImage: string;

  options: CameraOptions = {
    quality: 30,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  selectedPhoto: Blob;
  selectedPhotobase64="/assets/img/camera-icon.png";  

  constructor(private camera: Camera,public db: AngularFirestore,public storage:AngularFireStorage) { }

  captureImage() { 
    ///camera options
    const options: CameraOptions = {
      //quality
      quality: 100,
      ////dimensions of the photo
      targetHeight: 100,
      targetWidth: 100,
      ///type of destination
      destinationType: this.camera.DestinationType.DATA_URL,
      ///type of photo
      encodingType: this.camera.EncodingType.JPEG,
      //define what an image is
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {  
      
      this.selectedPhoto  = this.dataURItoBlob('data:image/jpeg;base64,' + imageData); 
      this.selectedPhotobase64='data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log('error', err);
    });
  } 
  save(){    
    this.upload(this.selectedPhoto) 
  }
  upload(selectedPhoto){ 
    return firebase.storage().ref().child(`images/image_${ new Date().getTime() }.jpg`).put(selectedPhoto); 
  }

  dataURItoBlob(dataURI) {
    // codej adapted from:
    //  http://stackoverflow.com/questions/33486352/
    //cant-upload-image-to-aws-s3-from-ionic-camera
        let binary = atob(dataURI.split(',')[1]);
        let array = [];
        for (let i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  }
}
