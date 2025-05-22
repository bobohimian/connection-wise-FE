import React, { useEffect, useRef } from 'react'
import { domToWebp } from 'modern-screenshot'
import apiService from '../../api'
const options = {
    // width:300,
    // height:160,
    quality:0.5,
    scale:0.7,
}
const withScreenShot = (Component) => {
    return (props) => {
        const canvasId = props.canvasId
        const ComponentRef = useRef(null)
        const handleSaveThumbnail = async () => {
            const dataUrl = await domToWebp(ComponentRef.current,options)
            const formData = new FormData();
            formData.append('thumbnail', dataURLtoBlob(dataUrl), "thumbnail.webp");
            formData.append('canvasId', canvasId)
            try {
                await apiService.uploadThumbnail(formData)
            } catch (error) {
                if (error.isApi) {
                    
                } else {

                }
            }
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