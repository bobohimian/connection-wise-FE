import React, { useEffect, useRef } from 'react'
import DomToImage from 'dom-to-image'
import apiService from '../../api'
const withScreenShot = (Component) => {
    return (props) => {
        const canvasId = props.canvasId
        const ComponentRef = useRef(null)
        const handleSaveThumbnail = async () => {
            const dataUrl = await DomToImage.toPng(ComponentRef.current)
            const formData = new FormData();
            formData.append('thumbnail', dataURLtoBlob(dataUrl),"thumbnail.png");
            formData.append('canvasId', canvasId)
            const response = await apiService.uploadThumbnail(formData)
            console.log(response)
        }
        const dataURLtoBlob = (dataURL) => {
            const arr = dataURL.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
          };
        useEffect(() => {
            const interval = setInterval(() => {
                handleSaveThumbnail()
            }, 5000);
            return () => clearInterval(interval);
        }, [])
        return (
            <Component {...props} ref={ComponentRef} />
        )
    }
}
export default withScreenShot