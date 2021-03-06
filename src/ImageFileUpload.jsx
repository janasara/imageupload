import React from 'react'
import axios, { post } from 'axios';


class ImageFileUpload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      file: null,
      imgSrc:null,
      productName:"",
      productUrl:"",
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }
  onFormSubmit(e) {
    e.preventDefault() // Stop form submit
    if (this.state.imgSrc){
    this.fileUpload(this.state.imgSrc).then((response) => {
      console.log(response.data);
      const prodDtl=`Product Name: ${response.data[0].productClass} `
      const prodUrl= response.data[0].productUrl
      this.setState({productName:prodDtl, productUrl:prodUrl})
    })
    }
  }
  toBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };
  onChange(e) {
    const lfile = e.target.files[0]; 
    if (!lfile) return 
    const spltLfile=lfile['name'].split('.')
    const fileExtn=spltLfile[1]

  if (fileExtn=='jpg'|| fileExtn=='jpeg'){
    this.toBase64(lfile).then(imgBase64=>{
      //console.log("imagBase64:",imgBase64)
      this.setState({ file: lfile,imgSrc:imgBase64, productName:"",productUrl:""})
    })
  } else{
    this.setState({ file: null,imgSrc:null, productName:"",productUrl:""})
  }
  }
  fileUpload(imgSrc) {
    const url = 'http://localhost:5000/product';
    const formData = new FormData();
    const splImage=imgSrc.split(',')
    const secondBase64=splImage[1]
    //console.log("secondBase64",secondBase64)
    formData.append('product_image', secondBase64)
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    return post(url, formData, config)
  
  }

  render() {
    //console.log("imgSrc:",this.state.imgSrc)
    //console.log("file:",this.state.file)
    return (
      <div>
      <form onSubmit={this.onFormSubmit}>
        <h1>Image File Upload</h1>
        <div>
          <input type="file" onChange={this.onChange} accept="image/jpeg,image/jpg" />
          <button type="submit">Search</button>
        </div>
        </form>
      <div className="image-div">
       <span> {this.state.productName}   </span>    
      </div>
      {this.state.productUrl  &&<div className="image-div">          
       Product URL: <a href={this.state.productUrl} target="_blank"> {this.state.productUrl}</a>   
      </div>}
      <div className="image-div">
        <img src={this.state.imgSrc} />       
      </div>
      </div>
    )
  }
}



export default ImageFileUpload