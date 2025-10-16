// src/pages/home/cropImage.js
export default function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const canvas = document.createElement('canvas');
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      // 캔버스 크기를 crop 영역으로 설정
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');

      // 회전 적용 (optional)
      if (rotation !== 0) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
      }

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, 'image/jpeg');
    };
    image.onerror = () => reject(new Error('Image load error'));
  });
}
